const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'warn',
    descrption: 'warns mentioned user for the provided reason',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
    if(!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
  let reason = args.slice(1).join(' ');

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
  if (!reason) return message.lineReply('Please provide a reason.');
	if(member.id == message.author.id) return message.lineReply("You can't warn yourself!")
	message.delete()
let loading = await message.channel.send("<a:loading:939665977728176168> Give me a sec...")
  member.send(`You have been warned in **${message.guild.name}** for the reason: **${reason}**`);


  let warn = new Discord.MessageEmbed()
  .setColor("#d90053")
  .setTitle(`Warn | ${member.user.tag}`)
  .addField("User", member, true)
  .addField("Moderator", message.author, true)
  .addField("Reason", reason)
  .setTimestamp()
  .setFooter(member.id)

    bot.channels.cache.get(config.logsID).send(warn)

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
			db.set(`moderation.punishments.${member.id}.1`, { date: formatteddate, reason: reason, punisher: message.author.tag, type: 'Warn' })
		} else {
			let addoffence = dbgetuser.offenceno + 1
			db.add(`moderation.punishments.${member.id}.offenceno`, 1)
			db.set(`moderation.punishments.${member.id}.${addoffence}`, { date: formatteddate, reason: reason, punisher: message.author.tag, type: 'Warn' })
		}

		db.add(`moderation.modstats.${message.author.id}.warns`, 1)

		loading.edit(`<:shieldtick:939667770184966186> **${member.user.tag}** was warned.`)

}
}
