const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'deletehistory',
  descrption: 'gets punishment history',
  aliases: ['deletepunishments', 'deletewarns', 'removepunishments', 'removewarns', 'removehistory', 'deletepunishment', 'deletewarn', 'removepunishment', 'removewarn', 'rwarn', 'rwarns', 'rhistory', 'rpunishment', 'rpunishments', 'roffence', 'roffences', 'removeoffence', 'rlog', 'rlogs'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
    if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
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

                    }  else return;
                }  else return;

            } else return;

            if (!member) return;
            else member = message.guild.members.cache.get(member.id);
            if (!member) return;

    var dbgetuser = db.get(`moderation.punishments.${member.id}`)

    if(!dbgetuser) return message.reply("There are no recorded punishments for that user.");

		if(!args[1]) return message.reply('Invalid offence number,\nPlease provide the number of an offence you wish to remove or "all" to clear all offences');
		if(!isNaN(args[1])) {
    let tryget = db.get(`moderation.punishments.${member.id}.${args[1]}`)
		if(!tryget) return message.reply('Invalid offence number,\nPlease provide the number of an offence you wish to remove or "all" to clear all offences');
		await db.delete(`moderation.punishments.${member.id}.${args[1]}`)
		message.reply(`<:shieldtick:939667770184966186> Deleted **${member.user.tag}'s** ${args[1]} Offence.`)
	} else if(args[1].toLowerCase() == "all") {
		await db.delete(`moderation.punishments.${member.id}`)
		db.delete(`moderation.punishments.${member.id}.offenceno`)
		message.reply(`<:shieldtick:939667770184966186> Deleted all of **${member.user.tag}'s** Offences.`)
	} else {
		return message.reply('Invalid offence number,\nPlease provide the number of an offence you wish to remove or "all" to clear all offences');
	}

    // for(i = 1; i <= dbgetuser.offenceno; i++) {
    //   let eee = '1'
    //   console.log(dbgetuser.eee.date)
    //   let date = db.get(`moderation.punishments.${member.id}.${i}`)
    //   let reason = dbgetuser.i.reason
    //   let punisher = dbgetuser.i.punisher
    //   let type = dbgetuser.i.type
    //   history.addField(`${i}. ${type} | ${date}`, `Reason: ${reason}\nIssued by: ${punisher}`);
    // }


}
}
