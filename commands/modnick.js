const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'modnick',
  descrption: 'Change a users nickname',
	aliases: ['modnickname'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
    if(!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
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

                    }  else return;
                }  else return;

            } else return;

            if (!member) return;
            else member = message.guild.members.cache.get(member.id);
            if (!member) return;
	message.delete()
let loading = await message.channel.send("<a:loading:939665977728176168> Give me a sec...")
let generatecode = Math.random().toString(16).substr(2, 8);
let nick = `Moderated Nickname #${generatecode}`

	await member.setNickname(nick)

	let nickembed = new Discord.MessageEmbed()
  .setColor("#d90053")
  .setTitle(`Nickname moderated | ${member.user.tag}`)
  .addField("User", member, true)
  .addField("Moderator", message.author, true)
  .addField(`New nickname`, `${nick}\n**ID:** \`#${generatecode}\``)
  .setTimestamp()
  .setFooter(member.id)

    bot.channels.cache.get(config.logsID).send(nickembed)

		loading.edit(`<:shieldtick:939667770184966186> **${member.user.tag}**'s nickname has been Moderated. ID: \`#${generatecode}\``)

}
}
