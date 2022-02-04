const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en', simultaneousGames: true, requestExpireTime: 45, gameExpireTime: 45, })

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

game.on('win', data => {
	let winner;
	if(data.winner.id == 'AI' ){
		winner = data.winner.id
	} else {
		winner = data.winner.user.id
	}

	let loser;
	if(data.loser.id == 'AI' ){
		loser = data.loser.id
	} else {
		loser = data.loser.user.id
	}
	db.add(`games.tictactoe.${winner}.wins`, 1)
	db.add(`games.tictactoe.${loser}.losses`, 1)
});
game.on('tie', data => {
	let p1;
	if(data.players[0].id == 'AI' ){
		p1 = data.players[0].id
	} else {
		p1 = data.players[0].user.id
	}

	let p2;
	if(data.players[1].id == 'AI' ){
		p2 = data.players[1].id
	} else {
		p2 = data.players[1].user.id
	}
	db.add(`games.tictactoe.${p1}.ties`, 1)
	db.add(`games.tictactoe.${p2}.ties`, 1)
});
