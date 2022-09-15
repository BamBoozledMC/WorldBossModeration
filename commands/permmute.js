const Discord = require ("discord.js");
const ms = require("ms");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'permmute',
  descrption: 'Mutes mentioned user in the server',
  aliases: ['pmute', 'permanantmute'],
	usage: '',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${__filename.replace(`${__dirname}\\`, "").replace(".js", "")}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
    //!mute @user 1s/m/h/d
  try {
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
						if (member.id === message.author.id) return message.channel.send("You cannot mute yourself!");
						message.delete()
  if(member.permissions.has("ADMINISTRATOR")) return message.channel.send("I cant mute this user");
	let loading = await message.channel.send("<a:loading:939665977728176168> Give me a sec...")
  let muterole = message.guild.roles.cache.find(r => r.name === "Muted");

  if(!muterole){
    try{
      muterole = await message.guild.roles.create({
        name: "Muted",
        color: "#777777",
        permissions: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
      });
      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.permissionOverwrites.create(muterole, {
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

  if(member.roles.cache.has(muterole.id)) {
		loading.edit("This user is already muted!")
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
  await(member.roles.add(muterole.id));
    } catch(e) {
			loading.delete()
      return;
    }
  let muteembed = new Discord.MessageEmbed()
		  .setColor(themecolor)
		  .setTitle(`Mute | ${member.user.tag}`)
		  .addField("User", member.toString(), true)
      .addField("Moderator", message.author.toString(), true)
		  .addField("Reason", res)
		  .setTimestamp()
		  .setFooter(member.id)

  bot.channels.cache.get(config.logsID).send({embeds: [muteembed]});
  try {
  member.send(`You have been muted in **${message.guild.name}** for the reason: **${res}**`).catch(error => message.reply(`This user was not notified of their mute because they have blocked me or have DMs turned off.`));
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
	db.set(`moderation.punishments.${member.id}.1`, { date: formatteddate, reason: res, punisher: message.author.tag, type: 'Mute' })
	db.set(`moderation.punishments.${member.id}.muted`, 'true')
} else {
	let addoffence = dbgetuser.offenceno + 1
	db.add(`moderation.punishments.${member.id}.offenceno`, 1)
	db.set(`moderation.punishments.${member.id}.${addoffence}`, { date: formatteddate, reason: res, punisher: message.author.tag, type: 'Mute' })
	db.set(`moderation.punishments.${member.id}.muted`, 'true')
}

db.add(`moderation.modstats.${message.author.id}.mutes`, 1)

loading.edit(`<:shieldtick:939667770184966186> **${member.user.tag}** was muted.`)

      }catch(e){
        console.log(e.stack);
        }
    }
}
