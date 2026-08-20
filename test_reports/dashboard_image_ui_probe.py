"""
Playwright probe body used with the browser automation tool for the focused
logo/profile-image regression check. This file is an artifact copy of the
script passed to mcp_browser_automation.
"""

async def run_probe(page):
    try:
        await page.set_viewport_size({"width": 1920, "height": 1080})
        print("Viewport set")
        await page.wait_for_load_state("domcontentloaded")
        await page.wait_for_timeout(1000)
        print(f"Initial URL: {page.url}")

        if "/login" in page.url or await page.locator('[data-testid="auth-email-input"]').count() > 0:
            print("Dashboard is gated; logging in with test credentials")
            await page.locator('[data-testid="auth-email-input"]').fill("uitest1787059924@vertex.com")
            await page.locator('[data-testid="auth-password-input"]').fill("Test1234!")
            await page.locator('button[type="submit"]').click()
            await page.wait_for_url("**/dashboard", timeout=20000)
            await page.wait_for_load_state("networkidle", timeout=20000)

        await page.wait_for_selector('[data-testid="dashboard-hero-card"]', timeout=20000)
        print("Dashboard hero card visible")

        tagline = await page.locator('[data-testid="dashboard-hero-card"]').inner_text()
        print(f"Hero text: {tagline}")
        if "Scan any OTC or real market chart in seconds" not in tagline:
            raise Exception("Updated dashboard tagline text is missing")
        if "Your intelligent trading companion" in tagline or "—" in tagline:
            raise Exception("Old tagline text or em dash is still present")
        print("Dashboard tagline verified")

        image_data = await page.evaluate("""() => Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.getAttribute('src'),
            currentSrc: img.currentSrc,
            alt: img.getAttribute('alt'),
            srcset: img.getAttribute('srcset')
        }))""")
        print(f"Images found: {image_data}")
        profile_images = [
            img
            for img in image_data
            if "vertex-profile.png" in str(img.get("src"))
            or "vertex-profile.png" in str(img.get("currentSrc"))
            or "vertex-profile.png" in str(img.get("srcset"))
        ]
        if not profile_images:
            raise Exception("No rendered image references vertex-profile.png")
        print(f"Rendered dashboard profile image verified: {profile_images[0]}")

        # Get error messages using specific selectors
        error_text = await page.evaluate("""() => {
        const errorElements = Array.from(document.querySelectorAll('.error, [class*="error"], [id*="error"]'));
        return errorElements.map(el => el.textContent).join(", ");
        }""")
        if error_text:
            print(f"Found error message: {error_text}")
        else:
            print("No error messages found on the page")

        print("UI probe PASS")
    except Exception as e:
        print(f"UI probe FAIL: {e}")
        raise