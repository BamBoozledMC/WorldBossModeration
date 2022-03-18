const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'dm',
  descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if (message.author.id != config.ownerID) return;
		if (message.author.bot) return;
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

	                    }  else return;
	                }  else return;

	            } else return;

	            if (!member) return;
	            else member = message.guild.members.cache.get(member.id);
	            if (!member) return;

							message.delete()
			mentionMessage = args.slice(1).join(" ");
			try {
            member.send(mentionMessage);
			message.channel.send(`:thumbsup: Successfully DM'd **${member.user.username}**!`)
			.then(message => {
				setTimeout(() => message.delete().catch(error => {}), 5000);
			});
		} catch(e){
			console.log(e)
			message.reply(`:x: An Error occurred whilst messaging that user!\nAre their DMs closed? Did they block me?`)
		}

    }
}
