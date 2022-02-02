const config = require('../config.json');
const Discord = require ("discord.js");
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en' })

module.exports = {
	name: 'tictactoe',
  descrption: 'Returns your message',
	aliases: ['ttt'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		game.handleMessage(message);
    }
}
