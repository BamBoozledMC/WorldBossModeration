const config = require('../config.json');
const Discord = require ("discord.js");
const canvacord = require("canvacord");

module.exports = {
	name: 'kiss',
  descrption: 'Returns your message',
	cooldown: 30,
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(!message.member.roles.cache.some(role => role.id === '932808823020879872')) return message.reply(`You require the **Contender** rank to use this command!\nCheck your current rank by using \`?rank\` in <#932828142094123009>.`);
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
							if(member.id == message.author.id) return message.reply("You can't kiss yourself!")
			const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('accept')
					.setLabel('Accept')
					.setStyle('SUCCESS'),
					
				new Discord.MessageButton()
					.setCustomId('deny')
					.setLabel('Deny')
					.setStyle('DANGER'),
			);
			let askkiss = await message.reply({content: `${member.user}, ${message.author} would like to kiss you.`, components: [row] })

			const filter = i => ['accept', 'deny'].includes(i.customId) && i.user.id === member.id;

			const collector = askkiss.createMessageComponentCollector({ filter, max: 1, time: 15000 });

			collector.on('collect', async i => {
				if (i.customId === 'accept') {
					await i.deferUpdate()
						let image = await canvacord.Canvas.kiss(message.author.displayAvatarURL({ dynamic: true, format: "jpg" }), member.user.displayAvatarURL({ dynamic: true, format: "jpg" }))
						await i.editReply({content: `${message.author} kissed ${member} <:peepolove:948813384785231892>`, components: [], files: [image]})
				} else if (i.customId === 'deny') {
					await i.update({ content: `${member.user} doesn't want to kiss.`, components: [] });
				}
			})
			collector.on('end', async i => {
				if (i.size === 0) await askkiss.edit({ content: `${member.user} didn't respond in time.`, components: [] });
			});

    }
}
