const config = require('../config.json');
const {Discord, MessageAttachment} = require ("discord.js");
const canvacord = require("canvacord");

module.exports = {
	name: 'kiss',
  descrption: 'Returns your message',
	cooldown: 30,
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if(!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(!message.member.roles.cache.some(role => role.id === '932808823020879872')) return message.lineReply(`You require the **Contender** rank to use this command!\nCheck your current rank by using \`?rank\` in <#932828142094123009>.`);
		}
		let member;
	            if(args[0]) {
	              let mention;
	              if(message.mentions.members.first()) {
	                if(message.mentions.members.first().user.id == bot.user.id) {
	                  mention = message.mentions.members.array()[1];
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

	                    }  else return;
	                }  else return;

	            } else return;

	            if (!member) return;
	            else member = message.guild.members.cache.get(member.id);
	            if (!member) return;
							if(member.id == message.author.id) return message.lineReply("You can't kiss yourself!")
							let askkiss = await message.lineReply(`${member.user}, ${message.author} would like to kiss you.\n⬇️ **Accept** / **Deny** ⬇️`)
							askkiss.react('✅').then(() => askkiss.react('❌'));

			const filter = (reaction, user) => {
				return ['✅', '❌'].includes(reaction.emoji.name) && user.id === member.id;
			};

			askkiss.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
				.then(async collected => {
					const reaction = collected.first();

					if (reaction.emoji.name === '✅') {
						askkiss.reactions.removeAll()
						askkiss.edit(`${member.user} Accepted your kiss!`)
						message.channel.startTyping()
						let image = await canvacord.Canvas.kiss(message.author.displayAvatarURL({ dynamic: true, format: "jpg" }), member.user.displayAvatarURL({ dynamic: true, format: "jpg" }))
						await message.channel.send(`${message.author} kissed ${member} <:peepolove:948813384785231892>`, new MessageAttachment(image, "image.png"))
						message.channel.stopTyping()
					} else {
						askkiss.reactions.removeAll()
						askkiss.edit(`${member.user} doesn't want to kiss.`)
					}
				})
				.catch(collected => {
					askkiss.reactions.removeAll()
					askkiss.edit(`${member.user} didn't respond in time.`)
			    });

    }
}
