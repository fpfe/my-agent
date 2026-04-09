# Whisper Transcriber — Local Setup

Transcription runs fully offline on your machine using OpenAI's open-source Whisper model (`medium`). No API key required.

## Setup

**1. Install dependencies**

```bash
pip install flask flask-cors openai-whisper
```

> The `medium` model (~1.5 GB) is downloaded automatically on first run.

**2. Start the server**

```bash
cd ~/my-agent
python whisper_server.py
```

The server runs at `http://localhost:5001` and stays running in the background while you use the dashboard.

**3. Open the dashboard**

Open `whisper-transcriber.html` in your browser (or visit https://fpfe.github.io/my-agent/whisper-transcriber.html), upload an audio file, and click **Transcribe**.

## Endpoint

```
POST http://localhost:5001/transcribe
Content-Type: multipart/form-data

file=<audio file>   (.m4a, .mp3, .wav, .mp4)
```

Response:

```json
{ "text": "transcribed text here" }
```

## Notes

- First transcription takes longer while the model loads into memory.
- For faster results use `model="small"` or `model="base"` in `whisper_server.py`.
- `ffmpeg` must be installed for non-WAV formats: `brew install ffmpeg`
