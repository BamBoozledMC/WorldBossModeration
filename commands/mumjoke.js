const config = require('../config.json');
const Discord = require ("discord.js");
const fetch = require('node-fetch');

module.exports = {
	name: 'mumjoke',
  descrption: 'Returns your message',
	aliases: ['momjoke'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(!message.member.roles.cache.some(role => role.id === '937561741334814810')) return message.reply(`This command is a supporter-only command. Check the \`${prefix}help\` command for more info.`);
		}
		let loading = await message.reply("<a:loading:939665977728176168> Give me a sec...")
		const getmumjoke = await fetch('https://yomomma-api.herokuapp.com/jokes', {
			method: 'GET',
		})
		let mumjoke = await getmumjoke.json()
		if (mumjoke.error) {
			let embed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle(`Error`)
			.setDescription(`**${mumjoke.error}**\n\nPlease try again in a few seconds.`)
			return loading.edit({content: " ", embeds: [embed]})
		}
		let embed = new Discord.MessageEmbed()
		.setColor("#d90053")
		.setTitle(`Here is your "Your Mum" joke`)
		.setDescription(`**${mumjoke.joke}**`)
		loading.edit({content: " ", embeds: [embed]})
    }
}
