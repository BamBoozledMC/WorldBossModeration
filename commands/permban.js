const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'ban',
  descrption: 'bans mentioned user from the server',
	aliases: ['pban'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
        if (!message.member.hasPermission("BAN_MEMBERS") && message.author.id != config.ownerID) return;
		// if(!message.guild.me.hasPermission("SEND_MESSAGES")) return message.author.send(":x: I do not have permission to send messages in this channel!\nPlease make sure i have the \"SEND_MESSAGES\" permission in the channel overrides/permissions")
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
		if(!member.bannable) return message.channel.send("I cannot ban this user!");
		if(member.id == message.author.id) return message.lineReply("You can't ban yourself!")
		let loading = await message.channel.send("<a:loading:939665977728176168> Give me a sec...")

          let reason = args.slice(1).join(" ");
		if(!reason) {
		  res = "No reason given\n\nThis ban is __permanent__ and can not be appealed.";
		}
		else {
		  res = `${reason}\n\nThis ban is __permanent__ and can not be appealed.`
		}

	  await member.send(`You have been permanently banned from **${message.guild.name}** for the reason: **${res}**`).catch(error => message.reply(`This user was not notified of their ban because they have blocked me or have DMs turned off.`));
		await member.ban()
		  .catch(error => message.reply(`Sorry, I couldn't ban because of : ${error}`));

		  let bean = new Discord.MessageEmbed()
		  .setColor("#d90053")
		  .setTitle(`Permanent Ban | ${member.user.tag}`)
		  .addField("User", member, true)
		  .addField("Moderator", message.author, true)
		  .addField("Reason", res)
		  .setTimestamp()
		  .setFooter(member.id)

		  bot.channels.cache.get(config.logsID).send(bean)

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
				db.set(`moderation.punishments.${member.id}.1`, { date: formatteddate, reason: res, punisher: message.author.tag, type: 'Permanent Ban' })
			} else {
				let addoffence = dbgetuser.offenceno + 1
				db.add(`moderation.punishments.${member.id}.offenceno`, 1)
				db.set(`moderation.punishments.${member.id}.${addoffence}`, { date: formatteddate, reason: res, punisher: message.author.tag, type: 'Permanent Ban' })
			}

			db.add(`moderation.modstats.${message.author.id}.bans`, 1)

			loading.edit(`<:shieldtick:939667770184966186> **${member.user.tag}** was permanently banned. (Unappealable)`)
    }
}
