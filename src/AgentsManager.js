let agents = require('../json/agents.json');
const viewports = require('../json/viewports.json');

class AgentsManager {
  getPlaywrightAgent(filters) {
    agents = this.findAgents(filters);
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const viewport = viewports[Math.floor(Math.random() * viewports.length)];

    let surfer = {
      browser: agent.browser, // chrome
      defaultBrowserType: 'chromium', // chromium | firefox | webkit
      userAgent: agent.userAgent,
      deviceScaleFactor: 1, // 3
      isMobile: agent.isMobile,
      hasTouch: agent.isMobile,
      viewport,
    }

    return surfer;
  }

  findAgents(filters = {isMobile: undefined, browser: undefined, os: undefined, version: undefined}) {
    return !filters ? agents : agents.filter(agent => {
      let y = true;
      for (const [key, val] of Object.entries(filters)) {
        if (val !== undefined && val !== null) {
          // noinspection EqualityComparisonWithCoercionJS
          y = (key === 'version') ? (agent.version >= val) : (agent[key] == val);
          if (!y) break;
        }
      }
      return y;
    });
  }
}

module.exports = AgentsManager;
