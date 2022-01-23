const Discord = require ("discord.js");
const ms = require("ms");
const db = require('quick.db');
const config = require('../config.json');

module.exports = {
	name: 'tempmute',
  descrption: 'Mutes mentioned user in the server',
  aliases: ['tmute'],
	usage: '',
	args: false,
	async execute(bot, message, args, prefix) {
    //!mute @user 1s/m/h/d
  try {
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
  if (member.id === message.author.id) return message.channel.send("You cannot mute yourself!");
  if(member.hasPermission("ADMINISTRATOR")) return message.channel.send("I cant mute this user");
  let muterole = message.guild.roles.cache.find(r => r.name === "Muted");

  if(!muterole){
    try{
      muterole = await message.guild.roles.create({
        data: {
        name: "Muted",
        color: "#777777",
        permissions: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
        }
      });
      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.createOverwrite(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          CONNECT: false,
          SPEAK: false

        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }

  if(member.roles.cache.has(muterole.id)) return message.channel.send("This user is already muted!");
  let mutetime = args[1];
	if(!mutetime) return message.lineReply("You must provide the amount of time.")
  if(mutetime.endsWith("s")) mutetime = mutetime.slice(0, -1);
  else if(mutetime.endsWith("m")) mutetime = mutetime.slice(0, -1) * 60;
  else if(mutetime.endsWith("h")) mutetime = mutetime.slice(0, -1) * 3600;
  else if(mutetime.endsWith("d")) mutetime = mutetime.slice(0, -1) * 3600 * 24;

  if(!mutetime || isNaN(mutetime)) return message.channel.send("Please include a valid time!");

  let reason = args.slice(2).join(" ");
		if(!reason) {
		  res = "No reason given";
		}
		else {
		  res = `${reason}`
		}

    try {
  await(member.roles.add(muterole.id));
    } catch(e) {
      return;
    }
  let muteembed = new Discord.MessageEmbed()
		  .setColor("#d90053")
		  .setTitle(`Tempmute | ${member.user.tag}`)
		  .addField("User", member, true)
      .addField("Moderator", message.author, true)
      .addField("Time", args[1])
		  .addField("Reason", res, true)
		  .setTimestamp()
		  .setFooter(member.id)
  bot.channels.cache.get(config.logsID).send(muteembed);
  try {
  member.send(`You have been tempmuted in **${message.guild.name}** for \`${args[1]}\` with the reason: **${res}**`)
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
	db.set(`moderation.punishments.${member.id}.1`, { date: formatteddate, reason: `${args[1]} Mute time - ${res}`, punisher: message.author.tag, type: 'Tempmute' })
	db.set(`moderation.punishments.${member.id}.muted`, 'true')
} else {
	let addoffence = dbgetuser.offenceno + 1
	db.add(`moderation.punishments.${member.id}.offenceno`, 1)
	db.set(`moderation.punishments.${member.id}.${addoffence}`, { date: formatteddate, reason: `${args[1]} Mute time - ${res}`, punisher: message.author.tag, type: 'Tempmute' })
	db.set(`moderation.punishments.${member.id}.muted`, 'true')
}
message.channel.send(`**${member.user.tag}** was tempmuted.`)

let timer = setInterval(async function() {
    mutetime = mutetime - 1;
    db.set(`tempmute.${message.guild.id}.${member.user.id}.time`, mutetime);
    db.set(`tempmute.${message.guild.id}.${member.user.id}.channel`, message.channel.id);

    if(mutetime == 0) {
        clearInterval(timer);

        let unmuteembed = new Discord.MessageEmbed()
    .setColor("#d90053")
		  .setTitle(`Unmute | ${member.user.tag}`)
		  .addField("User", member, true)
      .addField("Moderator", bot.user, true)
		  .addField("Reason", "Auto Unmute")
		  .setTimestamp()
		  .setFooter(member.id)
    member.roles.remove(muterole.id);
    db.delete(`tempmute.${message.guild.id}.${member.user.id}.time`);
    db.delete(`tempmute.${message.guild.id}.${member.user.id}.channel`);
    try {
    member.send(`You have been unmuted in **${message.guild.name}** | Auto Unmute`)
  }catch(e){
    console.log(e.stack);
  }
	bot.channels.cache.get(config.logsID).send(unmuteembed)

	let ts = Date.now();

	let date_ob = new Date(ts);
	let date = date_ob.getDate();
	let month = date_ob.getMonth() + 1;
	let year = date_ob.getFullYear();

	// prints date & time in YYYY-MM-DD format
	let formatteddate = year + "-" + month + "-" + date

	let dbgetuser = db.get(`moderation.punishments.${member.user.id}`)

	if(!dbgetuser) {
		 db.add(`moderation.punishments.${member.user.id}.offenceno`, 1)
			db.set(`moderation.punishments.${member.user.id}.1`, { date: formatteddate, reason: 'Automatic unmute', punisher: bot.user.tag, type: 'Unmute' })
			 db.delete(`moderation.punishments.${member.user.id}.muted`)
		 } else {
				let addoffence = dbgetuser.offenceno + 1
				 db.add(`moderation.punishments.${member.user.id}.offenceno`, 1)
					db.set(`moderation.punishments.${member.user.id}.${addoffence}`, { date: formatteddate, reason: 'Automatic unmute', punisher: bot.user.tag, type: 'Unmute' })
					 db.delete(`moderation.punishments.${member.user.id}.muted`)
				 }

    }
}, 1000);


  message.delete();
      }catch(e){
        console.log(e.stack);
        if(!message.guild.me.hasPermission("MANAGE_ROLES" || "MANAGE_MESSAGES")) return message.channel.send(":x: I do not have enough permissions to do this!\nPlease make sure i have the \"MANAGE_ROLES\" and \"MANAGE_MESSAGES\" permissions.")
        }
    }
}
