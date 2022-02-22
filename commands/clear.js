const Discord = require ("discord.js");
const config = require('../config.json');

module.exports = {
	name: 'clear',
	descrption: 'Deletes given amount of messages',
	aliases: ['clean', 'purge'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName) {
	try {

	//if(message.author.id == "442702793002844170") return message.channel.send("Oh- Hey there <@442702793002844170>!\nI'ma have to deny you from using this command as you seem to be using it alot.")
    if(!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		const user = message.mentions.users.first();
		  const amount = !!parseInt(args[0]) ? parseInt(args[0]) : parseInt(args[1])
			if (!amount || isNaN(amount)) return message.lineReply(`**Usage:**\n\`${prefix}${commandName} <amount>\`\n**or**\n\`${prefix}${commandName} [@user] <amount>\``);
			await message.delete()
			await message.channel.messages.fetch({
				limit: 100,
			}).then((messages) => {
 				if (user) {
 				const filterBy = user ? user.id : bot.user.id;
 				messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
			} else if (!user) {
				messages = messages.array().slice(0, amount);
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
			  message.delete({timeout:5000})
		  });




		}catch(e){
		console.log(e.stack);
		message.channel.send(`**${e}**`)
		}
	}
}
