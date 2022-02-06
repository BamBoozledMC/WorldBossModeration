const Discord = require ("discord.js");
const config = require('../config.json');

module.exports = {
	name: 'clear',
	descrption: 'Deletes given amount of messages',
	aliases: ['clean', 'purge'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
	try {

	//if(message.author.id == "442702793002844170") return message.channel.send("Oh- Hey there <@442702793002844170>!\nI'ma have to deny you from using this command as you seem to be using it alot.")
    if(!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		  if(!args[0] || isNaN(args[0])) return message.lineReply("Invalid number.");
			if(args[0] > 100) return message.lineReply("You can't delete more then 100 messages at once.");
		  await message.delete()
		  await message.channel.bulkDelete(args[0], true)
		  //let msg = await message.channel.send(`<a:loading:735109207547707523> Clearing **${args[0]}** messages...`)
		  //  msg.edit(`<a:completed:735703067605073951> Successfully Cleared **${args[0]}** messages`)
		 message.channel.send(`<:shieldtick:939667770184966186> Successfully Cleared **${args[0]}** messages`)
		  .then(message => {
			  message.delete({timeout:5000})
		  });




		}catch(e){
		console.log(e.stack);
		message.channel.send(`**${e}**`)
		}
	}
}
