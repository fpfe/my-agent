#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(
        locale="ja-JP", timezone_id="Asia/Tokyo",
        viewport={"width": 1280, "height": 900},
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"
    )
    page = ctx.new_page()

    # Intercept network requests
    api_responses = []
    def on_response(response):
        url = response.url
        if "demae-can.com" in url and any(k in url for k in ["shop", "store", "restaurant", "list", "search", "api"]):
            print(f"  API: {response.status} {url[:120]}")

    page.on("response", on_response)

    print("=== Trying Demaecan top page ===")
    try:
        page.goto("https://demae-can.com/", timeout=25000, wait_until="domcontentloaded")
        time.sleep(3)
        print("URL:", page.url)
        print("Title:", page.title())
    except Exception as e:
        print("Error:", e)

    html = page.content()
    with open("/tmp/demaecan_top.html", "w") as f:
        f.write(html)
    print("HTML length:", len(html))

    browser.close()
