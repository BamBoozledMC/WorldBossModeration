const config = require('../config.json');
const Discord = require ("discord.js");
const {rps} = require('discord-rps')
const db = require('quick.db');

module.exports = {
	name: 'rps',
  descrption: 'Returns your message',
	aliases: ['rockpaperscissors', 'scissorspaperrock', 'spr'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${__filename.replace(`${__dirname}\\`, "").replace(".js", "")}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		const simplydjs = require("simply-djs");
		simplydjs.rps(message, {
  		embedColor: config.themecolor, // default: #075FFF
  		credit: false
		});
    }
}
