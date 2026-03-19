#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False, slow_mo=100)  # headful for debugging
    ctx = browser.new_context(
        locale="ja-JP", timezone_id="Asia/Tokyo",
        viewport={"width": 1280, "height": 900},
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"
    )
    page = ctx.new_page()

    def on_response(response):
        url = response.url
        if any(k in url for k in ["shop", "store", "list", "search", "api", "category"]):
            print(f"  RESP: {response.status} {url[:130]}")

    page.on("response", on_response)

    print("Navigating...")
    try:
        page.goto("https://demae-can.com/", timeout=30000, wait_until="networkidle")
    except Exception as e:
        print("goto error:", e)

    time.sleep(2)
    print("URL:", page.url)
    print("Title:", page.title())

    html = page.content()
    with open("/tmp/demaecan_top.html", "w") as f:
        f.write(html)
    print("Saved, len:", len(html))
    browser.close()
