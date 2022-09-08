const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'faq',
  descrption: 'Returns your message',
	aliases: ['game'],
	usage: '<message>',
	cooldown: 10,
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${commandName}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});

		let info = new Discord.MessageEmbed()
		.setTitle("World Boss on Steam")
		.setURL("https://store.steampowered.com/app/1628620/World_Boss/")
		.setThumbnail(message.guild.iconURL())
		.setDescription(`Join Fresh and LazarBeam in the battle for the World Boss crown in this fast-paced casual FPS.\n\n16 players duke it out in semi-persistent lobbies as they level up, select custom arsenals of weapons and perks, and climb the leaderboard to become “World Boss”.\n\nWith a focus on skill and experimentation, this unique mix of io-inspired gameplay and roguelike progression is a lightweight and accessible multiplayer experience for all ages.\n\nHow long can you hold the crown?\n\nA new title from PlaySide Studios, creators of Age of Darkness: Final Stand, partnering with some of the world’s most well-loved content creators.`)
		.setColor(themecolor)
		message.channel.send({ content: "For more info please check <#932748202397028383>", embeds: [info]}).catch(error =>{
		})
    }
}
