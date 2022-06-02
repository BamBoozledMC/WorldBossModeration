const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'calculator',
  descrption: 'Returns your message',
	usage: '<message>',
	aliases: ['calc', 'calculate'],
	args: true,
	async execute(bot, message, args, prefix) {
		const simplydjs = require("simply-djs");
		simplydjs.calculator(message, {
  		embedColor: config.themecolor,
			credit: false
		});
    }
}
