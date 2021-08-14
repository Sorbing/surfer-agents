const agentsManager = require('../index');

//const agents = agentsManager.findAgents({isMobile: undefined, browser: undefined, os: undefined, version: 85});
//console.log(agents);

const agent = agentsManager.getPlaywrightAgent({isMobile: false, browser: 'chrome', os: 'windows', version: 87});
console.log(agent);
