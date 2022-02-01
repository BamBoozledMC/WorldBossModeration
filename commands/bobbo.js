const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'bobbo',
    descrption: 'Returns your message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if (!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		if (message.author.bot) return;

		message.channel.send("https://images-ext-2.discordapp.net/external/JYYplPhFXMOIbvNeo_aHiyYPVJAW6uccwAZkhTmJrwI/%3Fssl%3D1/https/i0.wp.com/www.sandwichtribunal.com/wp-content/uploads/2020/02/Men_At_Work_-_Down_Under_Official_Video.gif").catch(error =>{
		})
    }
}
