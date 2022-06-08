const Discord = require ("discord.js");
const config = require('../config.json');

module.exports = {
	name: 'help',
	descrption: 'Help Page',
	aliases: ['cmds', 'commands'],
	usage: '',
	args: false,
	async execute(bot, message, args, prefix, commandName, themecolor) {
			if(message.member.permissions.has("MANAGE_MESSAGES")) {
				let embed = new Discord.MessageEmbed()
		.setTitle('Help Page')
		.addField("Configuration", `\`${prefix}prefix\` Change the server's prefix\n\`${prefix}themecolor\` Change the bot's theme color`)

		.addField("Moderation", ` \`${prefix}clear [@user] <amount>\` Deletes given amount of messages from a specific user or everyone. (Limited to 100 due to discord)
		\`${prefix}slowmode <time>\` Sets the channel's slowmode to the provided time.
		\`${prefix}warn <@user | userID> [reason]\` Warns the provided user for your reason.
		\`${prefix}kick <@user | userID> [reason]\` Kicks the provided user from the server.
		\`${prefix}ban <@user | userID> [reason]\` Bans the provided user from the server.
		\`${prefix}pban <@user | userID> [reason]\` Permanently bans the provided user from the server.
		\`${prefix}unban <userID> [reason]\` Unbans the provided user from the server.
		\`${prefix}mute <@user | userID> <time> [reason]\` Tempmutes the provided user for the specified time.
		\`${prefix}pmute <@user | userID> [reason]\` Mutes the provided user indefinitely.
		\`${prefix}unmute <@user | userID> [reason]\` unmutes the provided user.
		\`${prefix}history <@user | userID> [page]\` view previous offences of a user.
		\`${prefix}rhistory <@user | userID> <offencenumber/all>\` remove all offences or a certain offence from a user.`)

		.addField("Moderation - Misc", ` \`${prefix}snipe\` Snipes the last deleted message in your channel.
		\`${prefix}rule <rulenumber>\` Sends specified rule in chat.
		\`${prefix}nick <@user | userID> [nickname | "reset"]\` Get or set the nickname for a specific user.
		\`${prefix}modnick <@user | userID>\` Moderate a user's nickname.
		\`${prefix}modstats <@user | userID>\` Get a user's moderation stats.
		\`${prefix}suggestions <30_days | all_time>\` View top 10 upvoted suggestions from all time or from the past 30 days.
		\`${prefix}lock [#channel | channelID / "all"]\` Lock a specific channel or leave blank to lock current channel **or** specify "all" to lockdown the server.
		\`${prefix}unlock [#channel | channelID / "all"]\` Unlock a specific channel or leave blank to unlock current channel **or** specify "all" to unlock the server.
		\`${prefix}addlockchannel [#channel | channelID]\` Add a specific channel as a lockdown channel.
		\`${prefix}rlockchannel [#channel | channelID]\` Remove a specific channel from the lockdown channels.
		\`${prefix}lockchannels [#channel | channelID]\` Lists all lockdown channels.`)

		.addField("Fun", ` \`${prefix}fact\` Sends a random fact.
		\`${prefix}tictactoe [@user]\` Play tic tac toe against other poeple or challenge the unbeatable AI.
		\`${prefix}stats [@user]\` Check your tic tac toe stats or view someone elses.
		🔓 \`${prefix}coinflip\` Flip a coin! Heads/Tails.
		🔓 \`${prefix}dadjoke\` Sends a dadjoke.
		🔓 \`${prefix}mumjoke\` Sends a "Your mum" joke.
		🔓 \`${prefix}soundboard\` Play sound effects in your voice channel!`)

		.addField("Misc", ` \`${prefix}about\` Get info and statistics of the bot.
		\`${prefix}ping\` Checks the bot's ping.
		\`${prefix}uptime\` Checks the bot's uptime.
		\`${prefix}avatar [@user]\` Sends mentioned user's avatar (pfp).
		\`${prefix}say <message>\` Returns your message.
		\`${prefix}suggest <suggestion>\` Suggest something!
		\`${prefix}editsuggestion <edited suggestion>\` Edit your last (most recent) suggestion!
		\`${prefix}patrons\` Lists all current patrons helping to support this bot!
		\`${prefix}lurk [reason]\` :eyes: Lurk in chat. (Automatically unlurks on next message sent)
		\`${prefix}membercount\` Displays the current amount of members and bots.
		\`${prefix}enlarge <emoji>\` Enlarge an emoji.
		\`${prefix}dumpy <size> [file]\` Generate an Among us Dumpy gif with an image. File can be an attachment or link.
		\`${prefix}calculator\` Calculator with clickable buttons.`)

		.addField("Linking", ` \`${prefix}link\` Link your Discord & Steam account or check/get info on your linked accounts.
		\`${prefix}unlink\` Unlink your currently linked accounts.
		\`${prefix}linked\` Lists all linked users.`)

		.setDescription(`Here you can find info on every command!\nSince you are a staff member you have access to supporter-only commands. (Marked as 🔓)\n${message.guild.name}'s Current prefix is \`${prefix}\`\nUse ${prefix}prefix reset to reset your server's prefix to default.\nCommands marked as 🔒 are supporter-only commands and can be unlocked by supporting the bot at [patreon.com/bamboozledlw](https://www.patreon.com/bamboozledlw/)\n\n[] = Optional **|** <> = Required\n`)
		.setThumbnail('https://media.discordapp.net/attachments/933574813849632848/934606101847109652/worldboss_bot.jpg')
		.setFooter(`Developed by BamBoozled#0882`)
		.setColor(themecolor)

		if(message.member.roles.cache.some(role => role.id === '932808382593773589')) {
			embed.addField("Level exclusive commands - Grunt", `\`${prefix}hug <@user | userID>\` Give someone a hug!`)
		}
		if(message.member.roles.cache.some(role => role.id === '932808652350435349')) {
			embed.addField("Level exclusive commands - Challenger", `\`${prefix}slap <@user | userID>\` Slap someone.\n\`${prefix}jail <@user | userID>\` Put someone in jail.`)
		}
		if(message.member.roles.cache.some(role => role.id === '932808823020879872')) {
			embed.addField("Level exclusive commands - Contender", `\`${prefix}kiss <@user | userID>\` Kiss someone... :flushed:\n\`${prefix}delete <@user | userID>\` Delete someone.`)
		}
		try {
		await message.author.send({ embeds: [embed]})
		message.reply(`Check your DMs!`).catch(error =>{
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
	🔓 \`${prefix}mumjoke\` Sends a "Your mum" joke.
	🔓 \`${prefix}soundboard\` Play sound effects in your voice channel!`)
} else {
	embed.addField("Fun", ` \`${prefix}fact\` Sends a random fact.
	\`${prefix}tictactoe [@user]\` Play tic tac toe against other poeple or challenge the unbeatable AI.
	\`${prefix}stats [@user]\` Check your tic tac toe stats or view someone elses.
	🔒 ~~\`${prefix}coinflip\` Flip a coin! Heads/Tails.~~
	🔒 ~~\`${prefix}dadjoke\` Sends a dadjoke.~~
	🔒 ~~\`${prefix}mumjoke\` Sends a "Your mum" joke.~~
	🔒 ~~\`${prefix}soundboard\` Play sound effects in your voice channel!~~`)
}
embed.addField("Misc", ` \`${prefix}about\` Get info and statistics of the bot.
\`${prefix}ping\` Checks the bot's ping.
\`${prefix}uptime\` Checks the bot's uptime.
\`${prefix}avatar [@user]\` Sends mentioned user's avatar (pfp).
\`${prefix}suggest <suggestion>\` Suggest something!
\`${prefix}editsuggestion <edited suggestion>\` Edit your last (most recent) suggestion!
\`${prefix}patrons\` Lists all current patrons helping to support this bot!
\`${prefix}lurk [reason]\` :eyes: Lurk in chat. (Automatically unlurks on next message sent)
\`${prefix}membercount\` Displays the current amount of members and bots.
\`${prefix}enlarge <emoji>\` Enlarge an emoji.
\`${prefix}dumpy <size> [file]\` Generate an Among us Dumpy gif with an image. File can be an attachment or link.
\`${prefix}calculator\` Calculator with clickable buttons.`)

.addField("Linking", ` \`${prefix}link\` Link your Discord & Steam account or check/get info on your linked accounts.
\`${prefix}unlink\` Unlink your currently linked accounts.`)

if(message.member.roles.cache.some(role => role.id === '932808382593773589')) {
	embed.addField("Level exclusive commands - Grunt", `\`${prefix}hug <@user | userID>\` Give someone a hug!`)
}
if(message.member.roles.cache.some(role => role.id === '932808652350435349')) {
	embed.addField("Level exclusive commands - Challenger", `\`${prefix}slap <@user | userID>\` Slap someone.\n\`${prefix}jail <@user | userID>\` Put someone in jail.`)
}
if(message.member.roles.cache.some(role => role.id === '932808823020879872')) {
	embed.addField("Level exclusive commands - Contender", `\`${prefix}kiss <@user | userID>\` Kiss someone... :flushed:\n\`${prefix}delete <@user | userID>\` Delete someone.`)
}

if(message.member.roles.cache.some(role => role.id === '937561741334814810')) {
	embed.setDescription(`Here you can find info on the commands available to you.\nSince you are a supporter on Patreon, you get access to **EXCLUSIVE** commands! (Marked as 🔓) \n${message.guild.name}'s Current prefix is \`${prefix}\`\nCommands marked as 🔒 are supporter-only commands and can be unlocked by supporting the bot at [patreon.com/bamboozledlw](https://www.patreon.com/bamboozledlw/)\n\n[] = Optional **|** <> = Required\n`)
} else {
	embed.setDescription(`Here you can find info on the commands available to you.\n${message.guild.name}'s Current prefix is \`${prefix}\`\nCommands marked as 🔒 are supporter-only commands and can be unlocked by supporting the bot at [patreon.com/bamboozledlw](https://www.patreon.com/bamboozledlw/)\n\n[] = Optional **|** <> = Required\n`)
}
embed.setThumbnail('https://media.discordapp.net/attachments/933574813849632848/934606101847109652/worldboss_bot.jpg')
embed.setFooter(`Developed by BamBoozled#0882`)
embed.setColor(themecolor)
try {
await message.author.send({ embeds: [embed]})
message.reply(`Check your DMs!`).catch(error =>{
})
} catch(e){
message.reply(`:x: An Error occurred whilst messaging you! Please make sure your DMs are open so I can message you.`)
}
}
    }
}
