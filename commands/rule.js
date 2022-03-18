const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'rule',
  descrption: 'Returns your message',
	aliases: ['r'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
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
		message.channel.send("6️⃣ Do not be disruptive in voice chats. Being loud, obnoxious, blasting music in the background, or any other form of distraction will get you muted both in text and vc.")
		} else if (num == '7') {
		message.channel.send("7️⃣ Do not bypass the filter that is in place. If your message is deleted as soon as you send it, that means it contained a blacklisted word.")
		} else if (num == '8') {
		message.channel.send("8️⃣ Currently, this server only supports the English language. Other languages can not be moderated so please refrain from speaking them.")
		} else if (num == '9') {
		message.channel.send("9️⃣ Staff Members have the final say. Do not argue with them")
		}

    }
}
