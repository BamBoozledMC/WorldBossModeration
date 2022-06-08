const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'removeallreactions',
  descrption: 'Removes all upvotes and downvotes a user has made',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
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

				 	  let getsuggestions = db.get(`suggestions`)
						Object.keys(getsuggestions).forEach(async function (key){
							let suggestions = getsuggestions[key]
							let fetchmsg = await message.guild.channels.cache.get(config.suggestionID).messages.fetch(suggestions.msgID).then(message => {
					      message.reactions.cache.find(reaction => reaction.emoji.id == "934930260070371389").users.remove(member.id);
								message.reactions.cache.find(reaction => reaction.emoji.id == "934930252713586688").users.remove(member.id);
					    }).catch(err => {
					      console.log(err);
					    });
						});

    }
}
