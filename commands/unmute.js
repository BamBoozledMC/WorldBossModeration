const Discord = require ("discord.js");
const ms = require("ms");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'unmute',
    descrption: 'Unmutes mentioned user in the server',
	usage: '',
	args: false,
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

            }  else return message.channel.send(xdemb);
        }  else return message.channel.send(xdemb);

    } else return message.channel.send(xdemb);

    if (!member) return message.channel.send(xdemb);
    else member = message.guild.members.cache.get(member.id);
    if (!member) return message.channel.send(xdemb);
        if(!member) return message.channel.send(xdemb);

        let role = message.guild.roles.cache.find(r => r.name === "Muted")

        if(!role || !member.roles.cache.has(role.id)) return message.channel.send("This user is not muted!");

        let reason = args.slice(1).join(" ");
		if(!reason) {
		  res = "No reason given";
		}
		else {
		  res = `${reason}`
		}

    try {
        await member.roles.remove(role);
    } catch(e) {
      return;
    }
        let unmuteembed = new Discord.MessageEmbed()
    .setColor("#d90053")
		  .setTitle(`Unmute | ${member.user.tag}`)
		  .addField("User", member, true)
      .addField("Moderator", message.author, true)
		  .addField("Reason", res)
		  .setTimestamp()
		  .setFooter(member.id)

        bot.channels.cache.get(config.logsID).send(unmuteembed);

        try {
        member.send(`You have been unmuted in **${message.guild.name}** for the reason: **${res}**`)
      }catch(e){
        console.log(e.stack);
      }

			let ts = Date.now();

			let date_ob = new Date(ts);
			let date = date_ob.getDate();
			let month = date_ob.getMonth() + 1;
			let year = date_ob.getFullYear();

			// prints date & time in YYYY-MM-DD format
			let formatteddate = year + "-" + month + "-" + date

			let dbgetuser = db.get(`moderation.punishments.${member.id}`)

			if(!dbgetuser) {
				db.add(`moderation.punishments.${member.id}.offenceno`, 1)
				db.set(`moderation.punishments.${member.id}.1`, { date: formatteddate, reason: res, punisher: message.author.tag, type: 'Unmute' })
				db.delete(`moderation.punishments.${member.id}.muted`)
			} else {
				let addoffence = dbgetuser.offenceno + 1
				db.add(`moderation.punishments.${member.id}.offenceno`, 1)
				db.set(`moderation.punishments.${member.id}.${addoffence}`, { date: formatteddate, reason: res, punisher: message.author.tag, type: 'Unmute' })
				db.delete(`moderation.punishments.${member.id}.muted`)
			}
			message.channel.send(`**${member.user.tag}** was unmuted.`)

        message.delete();

     }
    }
