const Discord = require ("discord.js");
const config = require('../config.json');

module.exports = {
	name: 'help',
    descrption: 'Help Page',
	usage: '',
	args: false,
	async execute(bot, message, args, prefix) {
			if(message.member.hasPermission("MANAGE_MESSAGES")) {
				let embed = new Discord.MessageEmbed()
		.setTitle('Help Page')
		.addField("Configuration", `\`${prefix}prefix\` Change the server's prefix`)

		.addField("Moderation", ` \`${prefix}clear <amount>\` Deletes given amount of messages. (Limited to 100 due to discord)
		\`${prefix}slowmode <time>\` Sets the channel's slowmode to the provided time.
		\`${prefix}warn <@user | userID> [reason]\` Warns the provided user for your reason.
		\`${prefix}kick <@user | userID> [reason]\` Kicks the provided user from the server.
		\`${prefix}ban <@user | userID> [reason]\` Bans the provided user from the server.
		\`${prefix}unban <userID> [reason]\` Unbans the provided user from the server.
		\`${prefix}pmute <@user | userID> [reason]\` Mutes the provided user indefinitely.
		\`${prefix}mute <@user | userID> <time> [reason]\` Tempmutes the provided user for the specified time.
		\`${prefix}unmute <@user | userID> [reason]\` unmutes the provided user.
		\`${prefix}history <@user | userID> [page]\` view previous offences of a user.
		\`${prefix}rhistory <@user | userID> <offencenumber/all>\` remove all offences or a certain offence from a user.
		\`${prefix}snipe\` Snipes the last deleted message in your channel.
		\`${prefix}say <message>\` Returns your message.`)

		.addField("Misc", ` \`${prefix}ping\` Checks the bot's ping.
		\`${prefix}uptime\` Checks the bot's uptime.
		\`${prefix}avatar [@user]\` Sends mentioned user's avatar (pfp).
		\`${prefix}suggest <suggestion>\` Suggest something!`)

		.setDescription(`Here you can find info on every command!\n${message.guild.name}'s Current prefix is \`${prefix}\`\nUse ${prefix}prefix reset to reset your server's prefix to default.\n\n[] = Optional **|** <> = Required\n`)
		.setThumbnail('https://media.discordapp.net/attachments/933574813849632848/934606101847109652/worldboss_bot.jpg')
		.setFooter(`Developed by BamBoozled#0882`)
		.setColor('#d90053')
		try {
		await message.author.send(embed)
		message.lineReply(`Check your DMs!`).catch(error =>{
		})
	} catch(e){
		message.reply(`:x: An Error occurred whilst messaging you! Please make sure your DMs are open so I can message you.`)
	}
} else {
	let embed = new Discord.MessageEmbed()
.setTitle('Help Page')

.addField("Misc", ` \`${prefix}ping\` Checks the bot's ping.
\`${prefix}uptime\` Checks the bot's uptime.
\`${prefix}avatar [@user]\` Sends mentioned user's avatar (pfp).
\`${prefix}suggest <suggestion>\` Suggest something!`)

.setDescription(`Here you can find info on the commands available to you.\n${message.guild.name}'s Current prefix is \`${prefix}\`\n\n[] = Optional **|** <> = Required\n`)
.setThumbnail('https://media.discordapp.net/attachments/933574813849632848/934606101847109652/worldboss_bot.jpg')
.setFooter(`Developed by BamBoozled#0882`)
.setColor('#d90053')
try {
await message.author.send(embed)
message.lineReply(`Check your DMs!`).catch(error =>{
})
} catch(e){
message.reply(`:x: An Error occurred whilst messaging you! Please make sure your DMs are open so I can message you.`)
}
}
    }
}
