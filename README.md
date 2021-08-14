# surfer-agents

Collection of the most popular browsers (user-agents) and devices

## Install

```shell
nnpm i --save-dev surfer-agents
```

## Example usage

```javascript
const agentsManager = require('surfer-agents');
const agent = agentsManager.getPlaywrightAgent({isMobile: false, browser: 'chrome', os: 'windows', version: 87});

/* agent = {
  browser: 'chrome',
  defaultBrowserType: 'chromium',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  viewport: { width: 1920, height: 1200 }
}*/
```

## Update & Build

```shell
npm run build
npm run test
```
