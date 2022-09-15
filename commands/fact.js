const config = require('../config.json');
const Discord = require ("discord.js");
const fetch = require('node-fetch');
const db = require('quick.db');

module.exports = {
	name: 'fact',
  descrption: 'Returns your message',
	aliases: ['facts', 'getfact', 'randomfact', 'funfact'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${__filename.replace(`${__dirname}\\`, "").replace(".js", "")}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		let loading = await message.reply("<a:loading:939665977728176168> Give me a sec...")
		const getfact = await fetch('https://uselessfacts.jsph.pl/random.json?language=en')
		let fact = await getfact.json()
		let embed = new Discord.MessageEmbed()
		.setColor(themecolor)
		.setTitle(`Here is your Fact!`)
		.setURL(`${fact.permalink}`)
		.setDescription(`**${fact.text}**`)
		loading.edit({ content: " ", embeds: [embed]})
    }
}
