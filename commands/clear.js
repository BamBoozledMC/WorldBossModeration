const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'clear',
	descrption: 'Deletes given amount of messages',
	aliases: ['clean', 'purge'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${__filename.replace(`${__dirname}\\`, "").replace(".js", "")}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
	try {

	//if(message.author.id == "442702793002844170") return message.channel.send("Oh- Hey there <@442702793002844170>!\nI'ma have to deny you from using this command as you seem to be using it alot.")
    if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		const user = message.mentions.users.first();
		  const amount = !!parseInt(args[0]) ? parseInt(args[0]) : parseInt(args[1])
			if (!amount || isNaN(amount)) return message.reply(`**Usage:**\n\`${prefix}${commandName} <amount>\`\n**or**\n\`${prefix}${commandName} [@user] <amount>\``);
			await message.delete()
			await message.channel.messages.fetch({
				limit: 100,
			}).then((messages) => {
 				if (user) {
 				const filterBy = user ? user.id : bot.user.id;
 				messages = [...messages.filter(m => m.author.id === filterBy).values()].slice(0, amount);
			} else if (!user) {
				messages = [...messages.values()].slice(0, amount);
			}
		   message.channel.bulkDelete(messages, true)
			});
		  //let msg = await message.channel.send(`<a:loading:735109207547707523> Clearing **${args[0]}** messages...`)
		  //  msg.edit(`<a:completed:735703067605073951> Successfully Cleared **${args[0]}** messages`)
			let successmsg;
			if (user) {
				successmsg = `**${amount}** of **${user.tag}**'s messages.`
			} else {
				successmsg = `**${amount}** messages.`
			}
		 message.channel.send(`<:shieldtick:939667770184966186> Successfully Purged ${successmsg}`)
		  .then(message => {
			setTimeout(() => message.delete().catch(error => {}), 5000);
		  });




		}catch(e){
		console.log(e.stack);
		message.channel.send(`**${e}**`)
		}
	}
}
