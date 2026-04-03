// ── google-drive-auth.js ─────────────────────────────────────────────────────
// Reusable Google Drive authentication + upload module.
// Usage:
//   await initGoogleDrive(CLIENT_ID, SCOPES);
//   const link = await uploadToDrive('file.txt', 'hello', 'text/plain');

// Top-level flags — must be declared here so the inline onload= callbacks work
// without ReferenceError when the scripts fire before DOMContentLoaded.
var gisLoaded = false;
var gapiLoaded = false;

// Wrapper functions referenced by script onload= attributes
function onGapiLoaded() {
  gapiLoaded = true;
}
function onGisLoaded() {
  gisLoaded = true;
}

// ── Private state ─────────────────────────────────────────────────────────────
var _accessToken  = null;
var _tokenExpiry  = 0;
var _tokenClient  = null;

// ── Script loader ─────────────────────────────────────────────────────────────
function _loadScript(src, onloadFn) {
  return new Promise(function (resolve) {
    // Don't double-load
    if (document.querySelector('script[src="' + src + '"]')) {
      resolve();
      return;
    }
    var s = document.createElement('script');
    s.src = src;
    s.onload = function () { onloadFn(); resolve(); };
    document.head.appendChild(s);
  });
}

// ── Restore cached token ──────────────────────────────────────────────────────
function _restoreToken() {
  var tok = localStorage.getItem('gdrive_auth_token');
  var exp = localStorage.getItem('gdrive_auth_expiry');
  if (tok && exp && Date.now() < parseInt(exp) - 60000) {
    _accessToken = tok;
    _tokenExpiry  = parseInt(exp);
    return true;
  }
  return false;
}

// ── Public: initGoogleDrive ───────────────────────────────────────────────────
// Loads gapi + GIS scripts, initialises the token client, and resolves once
// the user has a valid access token (from cache or a new OAuth consent popup).
async function initGoogleDrive(clientId, scopes) {
  // Restore a cached token first — may skip the popup entirely
  _restoreToken();

  // Load both scripts in parallel
  await Promise.all([
    _loadScript(
      'https://apis.google.com/js/api.js',
      function () { gapiLoaded = true; }
    ),
    _loadScript(
      'https://accounts.google.com/gsi/client',
      function () { gisLoaded = true; }
    ),
  ]);

  // Initialise gapi.client (needed for future gapi calls; harmless if unused)
  await new Promise(function (resolve) { gapi.load('client', resolve); });

  // If we already have a valid token, we're done
  if (_accessToken && Date.now() < _tokenExpiry - 60000) return;

  // Otherwise request a new token (triggers OAuth popup / consent)
  return new Promise(function (resolve, reject) {
    _tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: scopes,
      callback: function (resp) {
        if (resp.error) { reject(new Error('Google auth error: ' + resp.error)); return; }
        _accessToken = resp.access_token;
        _tokenExpiry  = Date.now() + (resp.expires_in * 1000);
        localStorage.setItem('gdrive_auth_token',  _accessToken);
        localStorage.setItem('gdrive_auth_expiry', String(_tokenExpiry));
        resolve();
      },
    });
    _tokenClient.requestAccessToken({ prompt: '' });
  });
}

// ── Public: uploadToDrive ─────────────────────────────────────────────────────
// Creates a new file or overwrites the existing one with the same name.
// Returns the web view URL of the file.
async function uploadToDrive(filename, content, mimeType) {
  if (!_accessToken || Date.now() >= _tokenExpiry - 60000) {
    throw new Error('Not authenticated. Call initGoogleDrive() first.');
  }

  var authHeader = { 'Authorization': 'Bearer ' + _accessToken };

  // Search for an existing file with this name
  var searchRes = await fetch(
    'https://www.googleapis.com/drive/v3/files' +
    '?q=' + encodeURIComponent("name='" + filename + "' and trashed=false") +
    '&fields=files(id)&spaces=drive',
    { headers: authHeader }
  );
  if (!searchRes.ok) throw new Error('Drive search failed: ' + searchRes.status);
  var searchData = await searchRes.json();
  var existing   = searchData.files && searchData.files[0];

  var blob = new Blob([content], { type: mimeType });
  var fileId;

  if (existing) {
    // Update existing file content
    var updateRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files/' + existing.id +
      '?uploadType=media&fields=id',
      {
        method:  'PATCH',
        headers: Object.assign({ 'Content-Type': mimeType }, authHeader),
        body:    blob,
      }
    );
    if (!updateRes.ok) throw new Error('Drive update failed: ' + updateRes.status);
    fileId = (await updateRes.json()).id;
  } else {
    // Create new file
    var meta = { name: filename, mimeType: mimeType };
    var form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
    form.append('file', blob);
    var createRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
      {
        method:  'POST',
        headers: authHeader,
        body:    form,
      }
    );
    if (!createRes.ok) throw new Error('Drive create failed: ' + createRes.status);
    fileId = (await createRes.json()).id;
  }

  return 'https://drive.google.com/file/d/' + fileId + '/view';
}
