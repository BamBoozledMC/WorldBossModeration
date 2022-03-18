const config = require('../config.json');
const {Discord, MessageAttachment} = require ("discord.js");
const canvacord = require("canvacord");

module.exports = {
	name: 'jail',
  descrption: 'Returns your message',
	cooldown: 30,
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
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
							message.channel.sendTyping()
			let image = await canvacord.Canvas.jail(member.user.displayAvatarURL({ dynamic: true, format: "jpg" }), true)
			await message.channel.send({content: `${message.author} jailed ${member} <:jailpepe:948810664426741791>`, files: [image]})

    }
}
