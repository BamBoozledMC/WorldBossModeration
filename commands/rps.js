const config = require('../config.json');
const Discord = require ("discord.js");
const {rps} = require('discord-rps')

module.exports = {
	name: 'rps',
  descrption: 'Returns your message',
	aliases: ['rockpaperscissors', 'scissorspaperrock', 'spr'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		const simplydjs = require("simply-djs");
		simplydjs.rps(message, {
  		embedColor: config.themecolor, // default: #075FFF
  		credit: false
		});
    }
}
