const config = require('../config.json');
const Discord = require ("discord.js");
const fetch = require('node-fetch');

module.exports = {
	name: 'dadjoke',
  descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		// if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
		// 	if(!message.member.roles.cache.some(role => role.id === '937561741334814810')) return message.reply(`This command is a supporter-only command. Check the \`${prefix}help\` command for more info.`);
		// }
		let loading = await message.reply("<a:loading:939665977728176168> Give me a sec...")
		const getdadjoke = await fetch('https://icanhazdadjoke.com/', {
			method: 'GET',
			headers: {'Accept': 'application/json'},
		})
		let dadjoke = await getdadjoke.json()
		let embed = new Discord.MessageEmbed()
		.setColor(themecolor)
		.setTitle(`Here is your Dad joke`)
		.setURL(`https://icanhazdadjoke.com/j/${dadjoke.id}`)
		.setDescription(`**${dadjoke.joke}**`)
		loading.edit({ content: " ", embeds: [embed]})
    }
}
