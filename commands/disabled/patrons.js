const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'patrons',
  descrption: 'Lists all patrons',
	aliases: ['supporters', 'donaters', 'donators', 'donors'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(message.channel.id == config.generalID) return;
		}

		let gettier1 = message.guild.roles.cache.get('937304547003625512').members.map(m=>m.user);
		let gettier2 = message.guild.roles.cache.get('937561741334814810').members.map(m=>m.user);
		let formatT1 = gettier1.join("\n")
		let formatT2 = gettier2.join("\n")

		const patrons = new Discord.MessageEmbed()
		.setColor(themecolor)
		.setTitle("Patrons/Supporters")
		.setDescription("A massive thank you to everyone who is supporting this project!")
		.setFooter(`Wanna help support the bot too? Head to https://www.patreon.com/bamboozledlw`)

			if(!formatT1) {
				patrons.addField("Tier 1 Patrons", "There are no patrons for this tier.")
			} else {
				patrons.addField(`Tier 1 Patrons`, `${formatT1}`)
			}

			if(!formatT2) {
				patrons.addField("Tier 2 Patrons", "There are no patrons for this tier.")
			} else {
				patrons.addField(`Tier 2 Patrons`, `${formatT2}`)
			}

		message.channel.send({embeds: [patrons]})
    }
}
