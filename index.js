const { warn, error, debug } = require("./controllers/logger");
const { Client, Collection } = require("discord.js");
const { version } = require('./package.json');
const { readdirSync } = require("fs");
const { join } = require("path");

if (process.version.slice(1).split(".")[0] < 16) {
    error(`Please update to Node 16 or higher.`);
    process.exit(1);
}

class Bot extends Client {
    constructor() {
        super({
            intents: 32767
        });

        const locales = [];
        readdirSync(join(__dirname, 'locales'))
            .filter(file => file.endsWith('.json'))
            .forEach((file) => {
                locales.push(file.replace('.json', ''))
            });

        this.commands = new Collection();
        debug(`Successfully loaded ${locales.length} locales`);
        this.slashCommands = new Collection();
        this.config = require('./config/config.json');
        debug(`Successfully loaded config`);
        this.languages = require('i18n');
        debug(`Successfully loaded languages`);
        
        this.languages.configure({
            locales: locales,
            directory: join(__dirname, 'locales'),
            defaultLocale: 'en',
            retryInDefaultLocale: true,
            objectNotation: true,
            register: global,

            logWarnFn: function(msg) {
                warn(msg);
            },

            logErrorFn: function(msg) {
                error(msg);
            },

            missingKeyFn: function(locale, key) {
                return key;
            },

            mustacheConfig: {
                tags: ["{{", "}}"],
                disable: false
            }
        });
        this.languages.setLocale(this.config.LANGUAGE);
        debug(`Successfully set language to ${this.config.LANGUAGE}`);
        this.version = version;
    }
};

const client = new Bot();
module.exports = client;

// Initializing the project
require("./handler")(client);

client.login(process.env.TOKEN || client.config.TOKEN);
const url = `https://www.twitch.tv/jesgran`;
client.on('ready', () => {
 client.user.setActivity(`Alla prossima ❤️ | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} Membri`, { type: 'STREAMING', url: url }) //you can replace "#"

  client.on('debug', (a)=>{
  if(a.startsWith(`Hit a 429`)){
    process.kill(1)
  }
});

client.on("rateLimit", data => {
  process.kill(1)
})

client.on('rateLimited', () => {
  process.kill(1);
});

  const express = require('express');
  const app = express();
  const port = 4000 || 3000;

    app.all('/', (req, res) => {  
      res.send(`Done!`);
      res.end();
});
app.listen(port, () => debug(`Bot running on http://localhost:${port}`));
})
