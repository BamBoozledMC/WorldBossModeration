const Discord = require ("discord.js");
const config = require('../config.json');

module.exports = {
	name: 'help',
	descrption: 'Help Page',
	aliases: ['cmds', 'commands'],
	usage: '',
	args: false,
	async execute(bot, message, args, prefix) {
			if(message.member.hasPermission("MANAGE_MESSAGES")) {
				let embed = new Discord.MessageEmbed()
		.setTitle('Help Page')
		.addField("Configuration", `\`${prefix}prefix\` Change the server's prefix`)

		.addField("Moderation", ` \`${prefix}clear [@user] <amount>\` Deletes given amount of messages from a specific user or everyone. (Limited to 100 due to discord)
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
		\`${prefix}nick <@user | userID> [nickname | "reset"]\` Get or set the nickname for a specific user.`)

		.addField("Moderation - Misc", ` \`${prefix}snipe\` Snipes the last deleted message in your channel.
		\`${prefix}rule <rulenumber>\` Sends specified rule in chat.
		\`${prefix}modstats <@user | userID>\` Get a user's moderation stats.`)

		.addField("Fun", ` \`${prefix}fact\` Sends a random fact.
		\`${prefix}tictactoe [@user]\` Play tic tac toe against other poeple or challenge the unbeatable AI.
		\`${prefix}stats [@user]\` Check your tic tac toe stats or view someone elses.
		🔓 \`${prefix}coinflip\` Flip a coin! Heads/Tails.
		🔓 \`${prefix}dadjoke\` Sends a dadjoke.
		🔓 \`${prefix}soundboard\` Play sound effects in your voice channel!`)

		.addField("Misc", ` \`${prefix}ping\` Checks the bot's ping.
		\`${prefix}uptime\` Checks the bot's uptime.
		\`${prefix}avatar [@user]\` Sends mentioned user's avatar (pfp).
		\`${prefix}say <message>\` Returns your message.
		\`${prefix}suggest <suggestion>\` Suggest something!
		\`${prefix}patrons\` Lists all current patrons helping to support this bot!
		\`${prefix}lurk [reason]\` :eyes: Lurk in chat. (Automatically unlurks on next message sent)
		\`${prefix}membercount\` Displays the current amount of members and bots.`)

		.setDescription(`Here you can find info on every command!\nSince you are a staff member you have access to supporter-only commands. (Marked as 🔓)\n${message.guild.name}'s Current prefix is \`${prefix}\`\nUse ${prefix}prefix reset to reset your server's prefix to default.\nCommands marked as 🔒 are supporter-only commands and can be unlocked by supporting the bot at [patreon.com/bamboozledlw](https://www.patreon.com/bamboozledlw/)\n\n[] = Optional **|** <> = Required\n`)
		.setThumbnail('https://media.discordapp.net/attachments/933574813849632848/934606101847109652/worldboss_bot.jpg')
		.setFooter(`Developed by BamBoozled#0882`)
		.setColor('#d90053')

		if(message.member.roles.cache.some(role => role.id === '932808382593773589')) {
			embed.addField("Level exclusive commands - Grunt", `\`${prefix}hug <@user | userID>\` Give someone a hug!`)
		}
		if(message.member.roles.cache.some(role => role.id === '932808652350435349')) {
			embed.addField("Level exclusive commands - Challenger", `\`${prefix}slap <@user | userID>\` Slap someone.\n\`${prefix}jail <@user | userID>\` Put someone in jail.`)
		}
		if(message.member.roles.cache.some(role => role.id === '932808823020879872')) {
			embed.addField("Level exclusive commands - Contender", `\`${prefix}kiss <@user | userID>\` Kiss someone... :flushed:`)
		}
		try {
		await message.author.send(embed)
		message.lineReply(`Check your DMs!`).catch(error =>{
		})
	} catch(e){
		message.reply(`:x: An Error occurred whilst messaging you! Please make sure your DMs are open so I can message you.`)
		console.log(e)
	}
} else {
	let embed = new Discord.MessageEmbed()
.setTitle('Help Page')
if(message.member.roles.cache.some(role => role.id === '937561741334814810')) {
	embed.addField("Fun", ` \`${prefix}fact\` Sends a random fact.
	\`${prefix}tictactoe [@user]\` Play tic tac toe against other poeple or challenge the unbeatable AI.
	\`${prefix}stats [@user]\` Check your tic tac toe stats or view someone elses.
	🔓 \`${prefix}coinflip\` Flip a coin! Heads/Tails.
	🔓 \`${prefix}dadjoke\` Sends a dadjoke.
	🔓 \`${prefix}soundboard\` Play sound effects in your voice channel!`)
} else {
	embed.addField("Fun", ` \`${prefix}fact\` Sends a random fact.
	\`${prefix}tictactoe [@user]\` Play tic tac toe against other poeple or challenge the unbeatable AI.
	\`${prefix}stats [@user]\` Check your tic tac toe stats or view someone elses.
	🔒 ~~\`${prefix}coinflip\` Flip a coin! Heads/Tails.~~
	🔒 ~~\`${prefix}dadjoke\` Sends a dadjoke.~~
	🔒 ~~\`${prefix}soundboard\` Play sound effects in your voice channel!~~`)
}
embed.addField("Misc", ` \`${prefix}ping\` Checks the bot's ping.
\`${prefix}uptime\` Checks the bot's uptime.
\`${prefix}avatar [@user]\` Sends mentioned user's avatar (pfp).
\`${prefix}suggest <suggestion>\` Suggest something!
\`${prefix}patrons\` Lists all current patrons helping to support this bot!
\`${prefix}lurk [reason]\` :eyes: Lurk in chat. (Automatically unlurks on next message sent)
\`${prefix}membercount\` Displays the current amount of members and bots.`)

if(message.member.roles.cache.some(role => role.id === '932808382593773589')) {
	embed.addField("Level exclusive commands - Grunt", `\`${prefix}hug <@user | userID>\` Give someone a hug!`)
}
if(message.member.roles.cache.some(role => role.id === '932808652350435349')) {
	embed.addField("Level exclusive commands - Challenger", `\`${prefix}slap <@user | userID>\` Slap someone.\n\`${prefix}jail <@user | userID>\` Put someone in jail.`)
}
if(message.member.roles.cache.some(role => role.id === '932808823020879872')) {
	embed.addField("Level exclusive commands - Contender", `\`${prefix}kiss <@user | userID>\` Kiss someone... :flushed:`)
}

if(message.member.roles.cache.some(role => role.id === '937561741334814810')) {
	embed.setDescription(`Here you can find info on the commands available to you.\nSince you are a supporter on Patreon, you get access to **EXCLUSIVE** commands! (Marked as 🔓) \n${message.guild.name}'s Current prefix is \`${prefix}\`\nCommands marked as 🔒 are supporter-only commands and can be unlocked by supporting the bot at [patreon.com/bamboozledlw](https://www.patreon.com/bamboozledlw/)\n\n[] = Optional **|** <> = Required\n`)
} else {
	embed.setDescription(`Here you can find info on the commands available to you.\n${message.guild.name}'s Current prefix is \`${prefix}\`\nCommands marked as 🔒 are supporter-only commands and can be unlocked by supporting the bot at [patreon.com/bamboozledlw](https://www.patreon.com/bamboozledlw/)\n\n[] = Optional **|** <> = Required\n`)
}
embed.setThumbnail('https://media.discordapp.net/attachments/933574813849632848/934606101847109652/worldboss_bot.jpg')
embed.setFooter(`Developed by BamBoozled#0882`)
embed.setColor('#d90053')
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
