const https = require('https');
const fs = require('fs');
const JSDOM = require('jsdom').JSDOM;

class AgentsBuilder {
  #cacheDays = 30
  cachedDir = '.cache'
  popularUserAgentsFilePath = 'json/agents.json'

  setCachedDays(days) {
    this.#cacheDays = days
  }

  async build(urls) {
    // @note Most popular Chrome user agent
    urls = urls || [
      'https://developers.whatismybrowser.com/useragents/explore/software_name/chrome/',
      'https://developers.whatismybrowser.com/useragents/explore/software_name/chrome/2',
      'https://developers.whatismybrowser.com/useragents/explore/software_name/chrome/3',
    ];

    let agentsList = [];
    for (const url of urls) {
      const filepath = await this.download(url);
      let agents = this.parse(filepath);
      console.log(url, '=>', filepath, ':', agents.length);
      agentsList = agentsList.concat(agents);
    }

    agentsList = [...new Map(agentsList.map(item => [item.userAgent, item])).values()]; // unique
    agentsList.sort((a, b) => (a.version > b.version) ? -1 : 1);
    //agents = agents.filter(item => item.os === 'windows');

    fs.writeFileSync(this.popularUserAgentsFilePath, JSON.stringify(agentsList, null, 2));

    console.log('Builded', agentsList.length, 'unique agents');
  }

  async download(url) {
    url = url || 'https://developers.whatismybrowser.com/useragents/explore/software_name/chrome/'; // @note Most popular Chrome user agent
    const cachedFilePath = this.#getFilePathByUrl(url);

    return new Promise((resolve, reject) => {
      if (this.#isCacheActual(cachedFilePath)) {
        resolve(cachedFilePath);
        return;
      }

      https.get(url, (resp) => {
        let content = '';

        resp.on('data', (chunk) => { content += chunk; });

        resp.on('end', () => {
          fs.writeFileSync(cachedFilePath, content); // JSON.parse(content).explanation
          resolve(cachedFilePath);
        });
      }).on('error', (err) => {
        reject(`Fail update. HTTP Error: ` + err.message);
      });
    });
  }

  #getFilePathByUrl(url) {
    const filename = url.replace(new RegExp('^http.?://'), '').replace(new RegExp('[^a-z0-9\._-]+', 'gi'), '-') + '.html';
    return `${this.cachedDir}/${filename}`;
  }

  #isCacheActual(filepath) {
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      const modifiedDaysAgo = (new Date().getTime() - stats.mtime) / 1000 / 60 / 60 / 24;
      if (modifiedDaysAgo <= this.#cacheDays) return true;
    }

    return false;
  }

  parse(filepath) {
    const content = fs.readFileSync(filepath, 'utf8');
    const dom = new JSDOM(content);
    const window = dom.window;
    const trs = window.document.querySelectorAll('.table-useragents tbody tr');

    let agents = [];

    for (const tr of trs) {
      //console.log(tr.outerHTML);

      let agent = {
        browser: 'chrome',
        userAgent: tr.querySelector('td:nth-child(1)').textContent.trim(),
        version: tr.querySelector('td:nth-child(2)').textContent.trim(),
        os: tr.querySelector('td:nth-child(3)').textContent.toLowerCase().trim(),     // windows | linux | openbsd
        hwType: tr.querySelector('td:nth-child(4)').textContent.toLowerCase().trim(), // computer | mobile | server | large-screen | mobile - phone
        isMobile: undefined,
      };

      agent.isMobile = (agent.hwType === 'mobile' || agent.hwType === 'mobile - phone'); //

      agents.push(agent);
    }

    return agents;
  }
}

module.exports = AgentsBuilder;
