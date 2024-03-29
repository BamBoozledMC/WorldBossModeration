const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'rule',
  descrption: 'Returns your message',
	aliases: ['r'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${__filename.replace(`${__dirname}\\`, "").replace(".js", "")}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		if (!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		let num = args[0]
		if(!num) {
			let errMSG = await message.reply('Please include the rule number')
			return setTimeout(() => errMSG.delete().catch(error => {}), 3000);
		} else if(isNaN(num)) {
			let errMSG = await message.reply('Not a number')
			return setTimeout(() => errMSG.delete().catch(error => {}), 3000);
		} else if(num == '1') {
			message.channel.send("1️⃣ Treat Everyone with respect. Absolutely no racism, sexism, or hate speech will be tolerated.")
		} else if(num == '2') {
		message.channel.send("2️⃣ No spam or self-promotion. (server invites, spam, etc.)")
		} else if(num == '3') {
		message.channel.send("3️⃣ No NSFW or obscene content. This includes text, images, or links featuring nudity, sex, intense violence, or other graphically disturbing content.")
  	} else if(num == '4') {
		message.channel.send("4️⃣ Do not impersonate LazarBeam, Fresh, or any other staff/community members. This includes profile pictures, names, etc. (if original)")
		} else if (num == '5') {
		message.channel.send("5️⃣ Conversations regarding private or personal info is not allowed. This includes age, IRL names, phone numbers, addresses, etc.")
		} else if (num == '6') {
		message.channel.send("6️⃣ Do not be disruptive in voice chats. Being loud, obnoxious, blasting music in the background, or any other form of distraction will get you muted both in text and voice chats.")
		} else if (num == '7') {
		message.channel.send("7️⃣ Do not bypass the filter that is in place. If your message is deleted as soon as you send it, that means it contained a blacklisted word.")
		} else if (num == '8') {
		message.channel.send("8️⃣ Currently, this server only supports the English language. Other languages cannot be moderated so please keep all chat to English. Please also ensure that your name is pingable using the English language alphabet.")
		} else if (num == '9') {
		message.channel.send("9️⃣ Staff Members have the final say. Do not argue with them")
		} else if (num == '10') {
		message.channel.send("1️⃣0️⃣ Don't act in a way that will make the community a worse place to be, at the mods' discretion.")
		} else if (num == '11') {
		message.channel.send("1️⃣1️⃣ Have active discussions about the game and feel free to disagree with things that we share, but please try to keep the conversation constructive rather than attacking.")
		} else if (num == '12') {
		message.channel.send("1️⃣2️⃣ Nicknames, profile pictures or bio descriptions that indicate any form of: harassment, abuse, hate speech, racist remarks, sexual contexts and slurs, promoting real life consumption of alcohol, narcotic drugs, or other intoxicants and downright disrespect will not be tolerated. Please follow requests from the moderation team/staff to change nicknames visible on the server and/or profile picture that will not violate rules mentioned above.")
		}

    }
}
