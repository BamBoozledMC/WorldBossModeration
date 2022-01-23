const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'avatar',
    descrption: 'gets users avatar',
    aliases: ['pfp'],
    usage: '',
	args: true,
	async execute(bot, message, args, prefix) {
		if(message.channel.id == config.generalID) return;
        if (args[0]) {
        let member;
        if(args[0]) {
          let mention;
          if(message.mentions.members.first()) {
            if(message.mentions.members.first().user.id == bot.user.id) {
              mention = message.mentions.members.array()[1];
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
    let mentionedavatar = new Discord.MessageEmbed()
.setTitle(`${member.user.username}'s Avatar`)
.setImage(`${member.user.displayAvatarURL({ dynamic: true, size: 1024 })}`)
.setColor('#d90053')
    return message.channel.send(mentionedavatar)
}
let executeravatar = new Discord.MessageEmbed()
.setTitle(`Your Avatar`)
.setImage(`${message.author.displayAvatarURL({ dynamic: true, size: 1024 })}`)
.setColor('#d90053')
return message.channel.send(executeravatar)
}
}
