const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'coinflip',
  descrption: 'Returns your message',
	aliases: ['cointoss', 'flipcoin', 'tosscoin', 'cf'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(!message.member.roles.cache.some(role => role.id === '937561741334814810')) return message.reply(`This command is a supporter-only command. Check the \`${prefix}help\` command for more info.`);
		}

		const head_tails = [
            'HEADS',
						'TAILS'
        ]
        const result = head_tails[Math.floor(Math.random() * head_tails.length)]
				if(result == "HEADS") {
					let embed = new Discord.MessageEmbed()
					.setColor(themecolor)
					.setTitle("Heads!")
					.setDescription("You flipped a coin and it landed on heads!")
					.setImage('http://cdn.bamboozledmc.xyz/heads.png')
					message.reply({embeds: [embed], allowedMentions: { repliedUser: false }})
				} else if(result == "TAILS") {
					let embed = new Discord.MessageEmbed()
					.setColor(themecolor)
					.setTitle("Tails!")
					.setDescription("You flipped a coin and it landed on tails!")
					.setImage('http://cdn.bamboozledmc.xyz/tails.png')
					message.reply({embeds: [embed], allowedMentions: { repliedUser: false }})
				}

    }
}
