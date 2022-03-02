const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'modstats',
  descrption: 'gets punishment history',
  aliases: [],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
    if(!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
  let member;
  let memberID;
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



            if (member) {
              memberID = member.id
              member = message.guild.members.cache.get(member.id);
            }
            if (!member) memberID = args[0];


    var varmember = member
    let dbgetuser = db.get(`moderation.modstats.${memberID}`)
		let warns = db.get(`moderation.modstats.${memberID}.warns`) ? db.get(`moderation.modstats.${memberID}.warns`) : 0
		let mutes = db.get(`moderation.modstats.${memberID}.mutes`) ? db.get(`moderation.modstats.${memberID}.mutes`) : 0
		let unmutes = db.get(`moderation.modstats.${memberID}.unmutes`) ? db.get(`moderation.modstats.${memberID}.unmutes`) : 0
		let kicks = db.get(`moderation.modstats.${memberID}.kicks`) ? db.get(`moderation.modstats.${memberID}.kicks`) : 0
		let bans = db.get(`moderation.modstats.${memberID}.bans`) ? db.get(`moderation.modstats.${memberID}.bans`) : 0
		let unbans = db.get(`moderation.modstats.${memberID}.unbans`) ? db.get(`moderation.modstats.${memberID}.unbans`) : 0

    if(!dbgetuser) return message.lineReply("There are no recorded moderation stats for that user.");

		let modstatsembed = new Discord.MessageEmbed()
		.setTitle(`Mod Stats | ${member.user.tag}`)
		.setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
		.addField("Warns:", warns)
		.addField("Mutes:", mutes)
		.addField("Unmutes:", unmutes)
		.addField("Kicks:", kicks)
		.addField("Bans:", bans)
		.addField("Unbans:", unbans)
		.addField("Total:", `${warns + mutes + unmutes + kicks + bans + unbans}`)
		.setColor("#d90053")
		.setTimestamp()

	message.channel.send(modstatsembed)



}
}
