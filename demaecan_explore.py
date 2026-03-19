#!/usr/bin/env python3
"""出前館 サイト構造調査スクリプト"""
from playwright.sync_api import sync_playwright
import time, json

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(
        locale="ja-JP", timezone_id="Asia/Tokyo",
        viewport={"width": 1280, "height": 900},
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    )
    page = ctx.new_page()

    # Try area search URL
    print("=== Trying Demaecan area page ===")
    page.goto("https://demae-can.com/shop/list/area/tokyo/minato/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(3)
    print("URL:", page.url)
    print("Title:", page.title())

    # Check for store cards
    html = page.content()
    with open("/tmp/demaecan_area.html", "w") as f:
        f.write(html)
    print("HTML saved to /tmp/demaecan_area.html")
    print("HTML length:", len(html))

    browser.close()
