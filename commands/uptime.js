const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'uptime',
	description: 'Checks the bot\'s uptime',
	usage: '!uptime',
    aliases: ['up'],
	args: false,
	async execute(bot, message, args, prefix, commandName, themecolor) {
	let totalSeconds = (bot.uptime / 1000);
let days = Math.floor(totalSeconds / 86400);
totalSeconds %= 86400;
let hours = Math.floor(totalSeconds / 3600);
totalSeconds %= 3600;
let minutes = Math.floor(totalSeconds / 60);
let seconds = Math.floor(totalSeconds % 60);

let uptime = `**${days}** Days, **${hours}** Hours, **${minutes}** Minutes and **${seconds}** Seconds!`;
message.channel.send(`I have been online for: ${uptime}`)
  }
}
