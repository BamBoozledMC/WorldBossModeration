const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'unban',
    descrption: 'unbans mentioned user from the server',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
    try{
if (!message.member.hasPermission("BAN_MEMBERS") && message.author.id != config.ownerID) return message.channel.send("Sorry, you don't have permissions to use this!");

        if (!args[0]) return message.channel.send(xdemb)

        let bannedMemberInfo = await message.guild.fetchBans()

        let bannedMember;
        bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bannedMemberInfo.get(args[0]) || bannedMemberInfo.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());
        if (isNaN(args[0])) return message.channel.send("Please provide a valid user ID")
        if (!bannedMember) return message.channel.send("Couldn't find the user!\nUser not banned?\nPlease provide a valid user ID")

        let reason = args.slice(1).join(" ")

        if(!reason) {
            res = "No reason given";
          }
          else {
            res = `${reason}`
          }

					message.delete()
            await message.guild.members.unban(bannedMember.user.id, reason)
                let bean = new Discord.MessageEmbed()
		  .setColor("#d90053")
		  .setTitle(`Unban | ${bannedMember.user.tag}`)
		  .addField("User", `<@${bannedMember.user.id}>`, true)
		  .addField("Moderator", message.author, true)
		  .addField("Reason", res)
		  .setTimestamp()
      .setFooter(bannedMember.user.id)
          bot.channels.cache.get(config.logsID).send(bean)

					let ts = Date.now();

					let date_ob = new Date(ts);
					let date = date_ob.getDate();
					let month = date_ob.getMonth() + 1;
					let year = date_ob.getFullYear();

					// prints date & time in YYYY-MM-DD format
					let formatteddate = year + "-" + month + "-" + date

					let dbgetuser = db.get(`moderation.punishments.${bannedMember.user.id}`)

					if(!dbgetuser) {
						db.add(`moderation.punishments.${bannedMember.user.id}.offenceno`, 1)
						db.set(`moderation.punishments.${bannedMember.user.id}.1`, { date: formatteddate, reason: res, punisher: message.author.tag, type: 'Unban' })
					} else {
						let addoffence = dbgetuser.offenceno + 1
						db.add(`moderation.punishments.${bannedMember.user.id}.offenceno`, 1)
						db.set(`moderation.punishments.${bannedMember.user.id}.${addoffence}`, { date: formatteddate, reason: res, punisher: message.author.tag, type: 'Unban' })
					}
					message.channel.send(`**${bannedMember.user.tag}** was unbanned.`)

    }catch(e){
      console.log(e.stack);
      }

    }
}
