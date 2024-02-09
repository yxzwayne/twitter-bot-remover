// @ts-check
const { test } = require('@playwright/test');

// Be sure to create a `config.json` and modify it properly.
const { username, password } = require('../config.json');

// add some jitter per scroll so we look like an actuall human
const scrollSize = 1492;

// How long to loop for
// normally this is too much, because how many followers are you gonna have anyway
const loopFor = 5;

test("Twitter TimeLine Scraper", async ({ page }) => {
  // upper bound of our execution time
  test.setTimeout(loopFor * 6000 + 10000);
  await page.setViewportSize({
    width: 1492,
    height: 1024,
  });

  await page.goto("https://x.com/");
  await page.click("text=Sign in");
  // Wait for page to load
  await page.waitForTimeout(1122);
  const userInput = "input";
  await page.fill(userInput, username);
  await page.click("text=Next");
  await page.waitForTimeout(1122);
  await page.keyboard.type(password, { delay: 66 });
  await page.click("text=Log in");
  await page.waitForTimeout(965);

  // We are logged into twitter now
  await page.goto(`https://x.com/${username}/followers`);
  await page.waitForTimeout(332);

  for (let i = 0; i < loopFor; i++) {
    await page.mouse.wheel(0, scrollSize);
    await page.waitForTimeout(525);

    var followers = page.locator('[data-testid="cellInnerDiv"]');
    var count = await followers.count();

    for (let f = 0; f < count; f++) {
      var followers = page.locator('[data-testid="cellInnerDiv"]');
      // Set a timeout for the innerText() function
      var followerTextPromise = followers.nth(f).innerText();
      var timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
      var followerText;
      
      // I noticed that retrieving followerText can get stuck, hence this check.
      // the break leads to a page refresh.
      try {
        followerText = await Promise.race([followerTextPromise, timeoutPromise]);
      } catch (error) {
        console.log("innerText() function took too long, continuing to scroll");
        break;
      }

      var followerLines = followerText.split('\n');
      if (followerLines.length > 1) {
        // Here, the second line of each user's card will be the username we want to check against
        var followerUname = followerLines[1];

        // ====== This is where you sort of modify your check logic ====== //
        // I check if the follower's uname contains 5 or more consecutive digits
        // the current spam bot meta username
        if ((/\d{5,}/.test(followerUname)) || (/rabbi/gi.test(followerUname))) {
          var menuButton = await followers.nth(f).locator('div[aria-label="More"][role="button"]');
          await menuButton.click();
          // Wait for the 'Remove follower' option to appear. If there isn't we scroll down.
          try {
            await page.waitForSelector('[data-testid="removeFollower"]', { timeout: 2000 });
            // Click the 'Remove follower' option
            await page.click('[data-testid="removeFollower"]');
            await page.waitForSelector('[data-testid="confirmationSheetConfirm"][role="button"]');
            await page.click('[data-testid="confirmationSheetConfirm"][role="button"]');
            console.log(`Removed follower with the Uname: ${followerUname}`);
            await page.waitForTimeout(122);
          } catch (error) {
            await page.reload();
            break;
          }
        }
      }
    }
  }
});
