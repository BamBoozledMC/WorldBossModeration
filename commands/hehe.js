const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'hehe',
  descrption: 'says hehe',
	usage: '<message>',
	cooldown: 15,
	args: true,
	async execute(bot, message, args, prefix) {
		if (message.author.bot) return;

		message.reply({ content: "hehe"}).catch(error =>{
		})
    }
}
