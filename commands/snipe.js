const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'snipe',
    descrption: 'Shows last deleted message',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${commandName}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
        const msg = bot.snipes.get(message.channel.id)
        if(!msg) return message.channel.send("I couldn't find any messages to snipe!");
        const snipedmsg = new Discord.MessageEmbed()
        .setColor(themecolor)
        .setAuthor(`${msg.author} ==>`, msg.icon)
        .setDescription(msg.content)
        .setTimestamp()
        .setFooter(`Command called by ${message.author.tag}`)
        if(msg.image)snipedmsg.setImage(msg.image)

        message.channel.send({embeds: [snipedmsg]})
    }
}
