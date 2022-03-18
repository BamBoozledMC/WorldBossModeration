const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'stats',
    descrption: 'gets users avatar',
    aliases: ['stat', 'statsai', 'aistats', 'aistat'],
    usage: '',
	args: true,
	async execute(bot, message, args, prefix, commandName) {
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(message.channel.id == config.generalID) return;
		}
		const ai_stats = () => {
			let otherswins;
			let otherslosses;
			let othersties;

			if (db.get(`games.tictactoe.AI.wins`)) {
				otherswins = db.get(`games.tictactoe.AI.wins`)
			} else {
				otherswins = '0'
			}
			if (db.get(`games.tictactoe.AI.losses`)) {
				otherslosses = db.get(`games.tictactoe.AI.losses`)
			} else {
				otherslosses = '0'
			}
			if (db.get(`games.tictactoe.AI.ties`)) {
				othersties = db.get(`games.tictactoe.AI.ties`)
			} else {
				othersties = '0'
			}
			let mentionedavatar = new Discord.MessageEmbed()
	.setTitle(`AI's Tic Tac Toe stats`)
	.setThumbnail(`https://cs.anu.edu.au/courses/comp3620/ai-main-img.jpg`)
	.addField("Wins", otherswins.toString(), true)
	.addField("Losses", otherslosses.toString(), true)
	.addField("Ties", othersties.toString())
	.setColor('#d90053')
	    return message.channel.send({embeds: [mentionedavatar]})
	}
		if(commandName == 'aistats' || commandName == 'aistat') return ai_stats();
		if(commandName == 'statsai') return ai_stats();

        if (args[0]) {
        let member;
        if(args[0]) {
          let mention;
          if(message.mentions.members.first()) {
            if(message.mentions.members.first().user.id == bot.user.id) {
              mention = [...message.mentions.members.values()][1];
            } else {
              mention = message.mentions.members.first();
            }
          }

            if(!mention) {

                if(isNaN(args[0])) member = bot.users.cache.find(u => u.tag == args[0]);
                else member = bot.users.cache.get(args[0]);

            } else if(mention) {

                if(!args[0].startsWith('<@') || !args[0].endsWith('>')) member = bot.users.cache.find(u => u.tag == args[0]);
                else if(args[0].startsWith('<@') && args[0].endsWith('>')) {

                    mention = args[0].slice(2, -1)
                    if(mention.startsWith('!')) mention = mention.slice(1);

                    member = bot.users.cache.get(mention);

                }  else return message.channel.send(`t`);
            }  else return message.channel.send(`t`);

        } else return message.channel.send(`e`);

        if (!member) return message.channel.send(`Couldn't find the user! Please make sure you supply a mention or userID.`);
        else member = message.guild.members.cache.get(member.id);
        if (!member) return message.channel.send(`q`);
    if (!member) {
        return message.reply('Make sure to mention a user!')
    }
		let otherswins;
		let otherslosses;
		let othersties;

		if (db.get(`games.tictactoe.${member.user.id}.wins`)) {
			otherswins = db.get(`games.tictactoe.${member.user.id}.wins`)
		} else {
			otherswins = '0'
		}
		if (db.get(`games.tictactoe.${member.user.id}.losses`)) {
			otherslosses = db.get(`games.tictactoe.${member.user.id}.losses`)
		} else {
			otherslosses = '0'
		}
		if (db.get(`games.tictactoe.${member.user.id}.ties`)) {
			othersties = db.get(`games.tictactoe.${member.user.id}.ties`)
		} else {
			othersties = '0'
		}
    let mentionedavatar = new Discord.MessageEmbed()
.setTitle(`${member.user.username}'s Tic Tac Toe stats`)
.setThumbnail(`${member.user.displayAvatarURL({ dynamic: true, size: 1024 })}`)
.addField("Wins", otherswins.toString(), true)
.addField("Losses", otherslosses.toString(), true)
.addField("Ties", othersties.toString())
.setColor('#d90053')
    return message.channel.send({embeds: [mentionedavatar]})
}
let wins;
let losses;
let ties;

if (db.get(`games.tictactoe.${message.author.id}.wins`)) {
	wins = db.get(`games.tictactoe.${message.author.id}.wins`)
} else {
	wins = '0'
}
if (db.get(`games.tictactoe.${message.author.id}.losses`)) {
	losses = db.get(`games.tictactoe.${message.author.id}.losses`)
} else {
	losses = '0'
}
if (db.get(`games.tictactoe.${message.author.id}.ties`)) {
  ties = db.get(`games.tictactoe.${message.author.id}.ties`)
} else {
	ties = '0'
}
let executeravatar = new Discord.MessageEmbed()
.setTitle(`Your Tic Tac Toe stats`)
.setThumbnail(`${message.author.displayAvatarURL({ dynamic: true, size: 1024 })}`)
.addField("Wins", wins.toString(), true)
.addField("Losses", losses.toString(), true)
.addField("Ties", ties.toString())
.setColor('#d90053')
return message.channel.send({embeds: [executeravatar]})
}
}
