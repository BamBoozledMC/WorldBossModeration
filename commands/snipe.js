const config = require('../config.json');
const Discord = require ("discord.js");

module.exports = {
	name: 'snipe',
    descrption: 'Shows last deleted message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
        const msg = bot.snipes.get(message.channel.id)
        if(!msg) return message.channel.send("I couldn't find any messages to snipe!");
        const snipedmsg = new Discord.MessageEmbed()
        .setColor('#d90053')
        .setAuthor(`${msg.author} ==>`, msg.icon)
        .setDescription(msg.content)
        .setTimestamp()
        .setFooter(`Command called by ${message.author.tag}`)
        if(msg.image)snipedmsg.setImage(msg.image)

        message.channel.send({embeds: [snipedmsg]})
    }
}
