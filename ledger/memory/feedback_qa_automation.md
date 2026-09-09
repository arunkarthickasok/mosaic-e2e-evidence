---
name: Feedback — QA Automation Philosophy
description: User wants UAT to be final sign-off only, not bug discovery. Automation must cover 95%+ from end-user perspective, not developer perspective.
type: feedback
originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
---
Use Playwright over Selenium/Behat for browser automation. Write tests as user journeys, not technical assertions.

**Why:** User was finding "hundreds of bugs" in UAT because automated tests only covered logic, not integration or browser behavior. The goal is to move all bug discovery to CI/automation, leaving UAT as a confidence check.

**How to apply:**
- Every new feature needs: unit test (logic) + functional test (HTTP integration) + Playwright spec (browser journey)
- Playwright tests must be written from the user's perspective: "editor opens builder, switches to Preview mode, sees iframe" — NOT "assert drupalSettings has components array"
- Honest gap analysis: always document what IS NOT automated (drag-and-drop precision, visual design feel, Safari cross-browser)
- The PHPUnit Functional test is the most important layer for backend features — it catches route access bugs, render failures, CSS class omissions that unit tests miss
- For POST endpoints with CSRF: write Kernel test (call controller directly) rather than fighting BrowserTestBase HTTP POST
- For GET JSON API endpoints: BrowserTestBase + `drupalGet()` + `getSession()->getPage()->getContent()` + `json_decode()` works perfectly
