const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');
const hangman = require('discord-hangman');

module.exports = {
	name: 'hangman',
  descrption: 'Returns your message',
	aliases: ['hangm', 'hm'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${__filename.replace(`${__dirname}\\`, "").replace(".js", "")}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		message.reply("Hangman can only be played using slash commands.\nPlease use **/hangman** ").catch(error =>{
		})
    }
}
