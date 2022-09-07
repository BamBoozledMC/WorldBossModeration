const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'avatar',
    descrption: 'gets users avatar',
    aliases: ['pfp', 'av'],
    usage: '',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${commandName}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(message.channel.id == config.generalID) return;
		}
        if (args[0]) {
        let member;
        if(args[0]) {
          let mention;
          if(message.mentions.members.first()) {
            if(message.mentions.members.first().user.id == bot.user.id) {
              mention = [...message.mentions.members.values()][1];
            } else {
              mention = message.mentions.members.first();
            }
          }

            if(!mention) {

                if(isNaN(args[0])) member = bot.users.cache.find(u => u.tag == args[0]);
                else member = bot.users.cache.get(args[0]);

            } else if(mention) {

                if(!args[0].startsWith('<@') || !args[0].endsWith('>')) member = bot.users.cache.find(u => u.tag == args[0]);
                else if(args[0].startsWith('<@') && args[0].endsWith('>')) {

                    mention = args[0].slice(2, -1)
                    if(mention.startsWith('!')) mention = mention.slice(1);

                    member = bot.users.cache.get(mention);

                }  else return message.channel.send(`t`);
            }  else return message.channel.send(`t`);

        } else return message.channel.send(`e`);

        if (!member) return message.channel.send(`Couldn't find the user! Please make sure you supply a mention or userID.`);
        else member = message.guild.members.cache.get(member.id);
        if (!member) return message.channel.send(`q`);
    if (!member) {
        return message.reply('Make sure to mention a user!')
    }
		let customavatar;
		if(member.user.displayAvatarURL({ dynamic: true }) == member.displayAvatarURL({ dynamic: true })) {
			customavatar = false
		} else {
			customavatar = true
		}
    let mentionedavatar = new Discord.MessageEmbed()
.setTitle(`${member.user.username}'s${customavatar ? " Server" : ""} Avatar`)
.setDescription(`**Links:**\n[webp](${member.displayAvatarURL({ dynamic: true, size: 4096, format: 'webp' })}) | [png](${member.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}) | [jpg](${member.displayAvatarURL({ dynamic: true, size: 4096, format: 'jpg' })})`)
.setImage(`${member.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}`)
.setColor(themecolor)
let mentionedavataruser = new Discord.MessageEmbed()
.setTitle(`${member.user.username}'s User Avatar`)
.setDescription(`**Links:**\n[webp](${member.user.displayAvatarURL({ dynamic: true, size: 4096, format: 'webp' })}) | [png](${member.user.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}) | [jpg](${member.user.displayAvatarURL({ dynamic: true, size: 4096, format: 'jpg' })})`)
.setImage(`${member.user.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}`)
.setColor(themecolor)
    return customavatar ? message.channel.send({embeds: [mentionedavatar, mentionedavataruser]}) : message.channel.send({embeds: [mentionedavatar]})
}
let customavatar;
if(message.author.displayAvatarURL({ dynamic: true }) == message.member.displayAvatarURL({ dynamic: true })) {
	customavatar = false
} else {
	customavatar = true
}
let executeravatar = new Discord.MessageEmbed()
.setTitle(`Your${customavatar ? " Server" : ""} Avatar`)
.setDescription(`**Links:**\n[webp](${message.member.displayAvatarURL({ dynamic: true, size: 4096, format: 'webp' })}) | [png](${message.member.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}) | [jpg](${message.member.displayAvatarURL({ dynamic: true, size: 4096, format: 'jpg' })})`)
.setImage(`${message.member.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}`)
.setColor(themecolor)
let executeravataruser = new Discord.MessageEmbed()
.setTitle(`Your User Avatar`)
.setDescription(`**Links:**\n[webp](${message.author.displayAvatarURL({ dynamic: true, size: 4096, format: 'webp' })}) | [png](${message.author.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}) | [jpg](${message.author.displayAvatarURL({ dynamic: true, size: 4096, format: 'jpg' })})`)
.setImage(`${message.author.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}`)
.setColor(themecolor)
return customavatar ? message.channel.send({embeds: [executeravatar, executeravataruser]}) : message.channel.send({embeds: [executeravatar]})
}
}
