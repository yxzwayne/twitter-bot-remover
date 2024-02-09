# Remove twitter bot followers

with a somewhat automated method, of course.

This only liberates you from clicking each bot follower, but you still gotta clone this, maybe also install nvm/npm and a chromium (god forbid), whatever.

## Functionality

It logs onto your account, goes into the followers page/tab (not "Verified Followers" if that matters!!!) and removes as many bot followers meeting a custom criteria as before a bug hits. Right now there shouldn't be any bugs but oh well.

### Custom criteria?

If you go into [tests/rmbots.spec.js](tests/rmbots.spec.js) where the "test" actually is, the criteria or condition is specified with
- `if (/\d{5,}/.test(followerUname)) {`

This is to say we check for 5 or more consecutive numbers in the follower username. You can modify this to your choice.

## Installation

- clone this repo,
- cd into this repo,
- `npm install`
- `npx playwright install chrome`
- create a `config.json` file in the project root directory and use the following format:

```
{
  "username": YOUR_UNAME_HERE,
  "password": YOUR_PW_HERE
}
```

From here on, you can either
- run the test in a supported IDE (i.e. VSCode with Playwright plugin),
- `npx playwright test --project=LocalChrome`

whichever works best for you.

Then just grab a drink and watch.
