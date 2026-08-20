"""Focused Playwright script body passed to mcp_browser_automation for iteration 12."""

import time
try:
    await page.set_viewport_size({"width": 1920, "height": 1080})
    print("Viewport set")

    observed = []
    def on_response(response):
        url = response.url
        if "vertex-profile.png" in url or "vertex-logo.png" in url or "/_next/image" in url:
            observed.append({"url": url, "status": response.status})
    page.on("response", on_response)

    start_url = page.url
    base = "https://vertex-trading-2.preview.emergentagent.com"
    if start_url.startswith("http"):
        base = start_url.split("/dashboard")[0].split("/login")[0]
    await page.goto(base + "/dashboard", wait_until="domcontentloaded")
    print(f"Reloaded URL: {page.url}")

    hero = page.locator('[data-testid="dashboard-hero-card"]')
    login_email = page.locator('[data-testid="auth-email-input"]')
    login_handled = False
    for i in range(80):
        if await hero.count() > 0 and await hero.first.is_visible():
            print("Dashboard hero already visible")
            break
        if not login_handled and await login_email.count() > 0 and await login_email.first.is_visible():
            print("Dashboard is gated; logging in with test credentials")
            await login_email.fill("uitest1787059924@vertex.com")
            await page.locator('[data-testid="auth-password-input"]').fill("Test1234!")
            await page.locator('[data-testid="auth-submit-button"]').click()
            login_handled = True
        await page.wait_for_timeout(500)
    else:
        body_text = await page.locator('body').inner_text(timeout=2000)
        raise Exception(f"Neither dashboard hero nor usable login appeared. url={page.url}, body={body_text[:500]}")

    await page.wait_for_selector('[data-testid="dashboard-hero-card"]', timeout=30000)
    await page.wait_for_function("""() => Array.from(document.images).some(img => {
        const rawSrc = img.getAttribute('src') || '';
        return rawSrc === '/vertex-profile.png' && img.complete && img.naturalWidth > 0;
    })""", timeout=30000)
    print("Dashboard hero card and completed profile image are visible")

    image_data = await page.evaluate("""() => Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.getAttribute('src'),
        currentSrc: img.currentSrc,
        alt: img.getAttribute('alt'),
        srcset: img.getAttribute('srcset'),
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
    }))""")
    print(f"Images found: {image_data}")
    profile_images = [img for img in image_data if img.get('src') == '/vertex-profile.png']
    if not profile_images:
        raise Exception("Profile image src attr is not exactly /vertex-profile.png")
    profile = profile_images[0]
    if '/_next/image' in str(profile.get('src')) or '/_next/image' in str(profile.get('currentSrc')) or '/_next/image' in str(profile.get('srcset')):
        raise Exception(f"Profile image still uses Next optimizer: {profile}")
    if not profile.get('complete') or profile.get('naturalWidth', 0) <= 0:
        raise Exception(f"Profile image did not finish loading correctly: {profile}")
    print(f"Profile DOM image verified raw and loaded: {profile}")

    await page.wait_for_timeout(1000)
    print(f"Observed image-related responses during page flow: {observed}")
    matching_profile_responses = [r for r in observed if '/vertex-profile.png' in r['url']]
    if not matching_profile_responses or not any(r['status'] == 200 for r in matching_profile_responses):
        raise Exception("No successful /vertex-profile.png network response observed during dashboard load")
    if any('/_next/image' in r['url'] and 'vertex-profile.png' in r['url'] for r in observed):
        raise Exception("Observed profile image request through /_next/image optimizer")

    perf_entries = await page.evaluate("""() => performance.getEntriesByType('resource')
        .filter(e => e.name.includes('vertex-profile.png') || e.name.includes('vertex-logo.png') || e.name.includes('/_next/image'))
        .map(e => ({name: e.name, duration: e.duration, transferSize: e.transferSize, encodedBodySize: e.encodedBodySize}))""")
    print(f"Browser performance resource entries: {perf_entries}")

    timings = {}
    for asset in ['/vertex-logo.png', '/vertex-profile.png']:
        attempts = []
        for i in range(3):
            start = time.perf_counter()
            response = await page.request.get(base + asset)
            elapsed_ms = (time.perf_counter() - start) * 1000
            body = await response.body()
            attempts.append({"status": response.status, "elapsed_ms": round(elapsed_ms, 2), "bytes": len(body)})
            if response.status != 200:
                raise Exception(f"{asset} page.request status {response.status}")
        timings[asset] = attempts
    print(f"Playwright page.request timings: {timings}")
    logo_avg = sum(t['elapsed_ms'] for t in timings['/vertex-logo.png']) / len(timings['/vertex-logo.png'])
    profile_avg = sum(t['elapsed_ms'] for t in timings['/vertex-profile.png']) / len(timings['/vertex-profile.png'])
    if profile_avg > max(1000, logo_avg * 6):
        raise Exception(f"Profile request average too slow vs logo: profile={profile_avg:.2f}ms logo={logo_avg:.2f}ms")
    print(f"Comparable asset timing verified: logo_avg={logo_avg:.2f}ms profile_avg={profile_avg:.2f}ms")

    # Get error messages using specific selectors
    error_text = await page.evaluate("""() => {
    const errorElements = Array.from(document.querySelectorAll('.error, [class*="error"], [id*="error"]'));
    return errorElements.map(el => el.textContent).join(", ");
    }""")
    if error_text:
        print(f"Found error message: {error_text}")
    else:
        print("No error messages found on the page")

    print("UI/profile-image probe PASS")
except Exception as e:
    print(f"UI/profile-image probe FAIL: {e}")
    raise
