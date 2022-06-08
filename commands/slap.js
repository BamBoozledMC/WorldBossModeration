const config = require('../config.json');
const {Discord, MessageAttachment} = require ("discord.js");
const canvacord = require("canvacord");

module.exports = {
	name: 'slap',
  descrption: 'Returns your message',
	cooldown: 30,
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(!message.member.roles.cache.some(role => role.id === '932808652350435349')) return message.reply(`You require the **Challenger** rank to use this command!\nCheck your current rank by using \`?rank\` in <#932828142094123009>.`);
		}
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
							if(member.id == message.author.id) return message.reply("You can't slap yourself!")
							message.channel.sendTyping()
			let image = await canvacord.Canvas.slap(message.author.displayAvatarURL({ dynamic: true, format: "jpg" }), member.user.displayAvatarURL({ dynamic: true, format: "jpg" }))
			await message.channel.send({content: `${message.author} slapped ${member} <:ayo:934399652655165490>`, files: [image]})

    }
}
