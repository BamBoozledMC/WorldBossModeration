const Discord = require ("discord.js");
const ms = require("ms");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'unmute',
    descrption: 'Unmutes mentioned user in the server',
	usage: '',
	args: false,
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
        if(!member) return;
				message.delete()
				let loading = await message.channel.send("<a:loading:939665977728176168> Give me a sec...")
        let role = message.guild.roles.cache.find(r => r.name === "Muted")

        if(!role || !member.roles.cache.has(role.id)) {
					loading.edit("This user is not muted!");
					return;
				}

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
			loading.delete()
      return;
    }
        let unmuteembed = new Discord.MessageEmbed()
    .setColor(themecolor)
		  .setTitle(`Unmute | ${member.user.tag}`)
		  .addField("User", member.toString(), true)
      .addField("Moderator", message.author.toString(), true)
		  .addField("Reason", res)
		  .setTimestamp()
		  .setFooter(member.id)

        bot.channels.cache.get(config.logsID).send({embeds: [unmuteembed]});

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

			db.add(`moderation.modstats.${message.author.id}.unmutes`, 1)

			loading.edit(`<:shieldtick:939667770184966186> **${member.user.tag}** was unmuted.`)

     }
    }
