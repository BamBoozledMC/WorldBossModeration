const config = require('./config.json');
const Discord = require ("discord.js");
require('discord-reply');
const bot = new Discord.Client ({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const db = require('quick.db');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core-discord');
const ping = require('ping');
const talkedRecently = new Set();
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en' });
const cooldowns = new Map();

const fs = require('fs');
bot.commands = new Discord.Collection();
//bot.aliases = new Discord.Collection();



const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
	//command.aliases.array.forEach(alias => {
	//	bot.aliases.set(alias, command.name)
	//});
}

console.log(`Loading ${commandFiles.length} commands...`)

commandFiles.forEach((f, i) => {
	console.log(`Successfully loaded ${i + 1}: ${f}!`)
})

bot.on("ready", async () => {
	bot.guilds.cache.forEach( guild => {
		guild.members.cache.forEach( member => {
			let mutetime = db.get(`tempmute.${guild.id}.${member.user.id}.time`);
			if(isNaN(mutetime)) return;
			let channel = guild.channels.cache.get(db.get(`tempmute.${guild.id}.${member.user.id}.channel`));
			let timer = setInterval(async function() {
				mutetime = mutetime - 1;
        db.set(`tempmute.${guild.id}.${member.user.id}.time`, mutetime);
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
					let muterole = guild.roles.cache.find(r => r.name === "Muted")
					member.roles.remove(muterole.id).catch(error =>{
					})
					db.delete(`tempmute.${guild.id}.${member.user.id}.time`);
					db.delete(`tempmute.${guild.id}.${member.user.id}.channel`);
    				try {
    				member.send(`You have been unmuted in **${guild.name}** | Auto Unmute`)
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
			}, 1000)
		});
	});
console.log("Loaded all commands. Bot is ready to use!")
console.log("Created by BamBoozled#0882")
console.log(`Watching ${bot.users.cache.size} Users!`)

let i = 0;
let activities;
setInterval(() => {
    activities = [ `General chat`, `World Boss`, `The mods`, `!help`, 'The devs', 'Playside Studios', 'Patreon' ];
    bot.user.setActivity(`${activities[i++ % activities.length]}`, { type: "WATCHING"});
}, 15000)



});
bot.on('message', async message => {
	if (message.channel.type == "dm") return;

  const auto_mute = async (message) => {

      db.delete(`pingwarn.${message.author.id}`)
      let muterole = message.guild.roles.cache.find(r => r.name === "Muted");
      try {
    await(message.member.roles.add(muterole.id));
      } catch(e) {
        console.log(e);
        return;
      }
    let muteembed = new Discord.MessageEmbed()
        .setColor("#d90053")
        .setTitle(`Tempmute | ${message.author.tag}`)
        .addField("User", message.author, true)
        .addField("Moderator", bot.user, true)
        .addField("Time", "24h")
        .addField("Reason", "Pinging Fresh/Lazarbeam multiple times", true)
        .setTimestamp()
        .setFooter(message.author.id)
    bot.channels.cache.get(config.logsID).send(muteembed);
    try {
    message.author.send(`You have been tempmuted in **${message.guild.name}** for \`24h\` with the reason: **Pinging Fresh/Lazarbeam multiple times**`)
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

  let dbgetuser = db.get(`moderation.punishments.${message.author.id}`)

  if(!dbgetuser) {
    db.add(`moderation.punishments.${message.author.id}.offenceno`, 1)
    db.set(`moderation.punishments.${message.author.id}.1`, { date: formatteddate, reason: `24h Mute time - Pinging Fresh/Lazarbeam multiple times`, punisher: bot.user.tag, type: 'Tempmute' })
    db.set(`moderation.punishments.${message.author.id}.muted`, 'true')
  } else {
    let addoffence = dbgetuser.offenceno + 1
    db.add(`moderation.punishments.${message.author.id}.offenceno`, 1)
    db.set(`moderation.punishments.${message.author.id}.${addoffence}`, { date: formatteddate, reason: `24h Mute time - Pinging Fresh/Lazarbeam multiple times`, punisher: bot.user.tag, type: 'Tempmute' })
    db.set(`moderation.punishments.${message.author.id}.muted`, 'true')
  }
  message.channel.send(`<:shieldtick:939667770184966186> **${message.author.tag}** was automatically tempmuted.`)
  let mutetime = 86400
  let timer = setInterval(async function() {
      mutetime = mutetime - 1;
      db.set(`tempmute.${message.guild.id}.${message.author.id}.time`, mutetime);
      db.set(`tempmute.${message.guild.id}.${message.author.id}.channel`, message.channel.id);

      if(mutetime == 0) {
          clearInterval(timer);

          let unmuteembed = new Discord.MessageEmbed()
      .setColor("#d90053")
        .setTitle(`Unmute | ${message.author.tag}`)
        .addField("User", message.author, true)
        .addField("Moderator", bot.user, true)
        .addField("Reason", "Auto Unmute")
        .setTimestamp()
        .setFooter(message.author.id)
      message.member.roles.remove(muterole.id).catch(error =>{
      })
      db.delete(`tempmute.${message.guild.id}.${message.author.id}.time`);
      db.delete(`tempmute.${message.guild.id}.${message.author.id}.channel`);
      try {
      message.author.send(`You have been unmuted in **${message.guild.name}** | Auto Unmute`)
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

    let dbgetuser = db.get(`moderation.punishments.${message.author.id}`)

    if(!dbgetuser) {
       db.add(`moderation.punishments.${message.author.id}.offenceno`, 1)
        db.set(`moderation.punishments.${message.author.id}.1`, { date: formatteddate, reason: 'Automatic unmute', punisher: bot.user.tag, type: 'Unmute' })
         db.delete(`moderation.punishments.${message.author.id}.muted`)
       } else {
          let addoffence = dbgetuser.offenceno + 1
           db.add(`moderation.punishments.${message.author.id}.offenceno`, 1)
            db.set(`moderation.punishments.${message.author.id}.${addoffence}`, { date: formatteddate, reason: 'Automatic unmute', punisher: bot.user.tag, type: 'Unmute' })
             db.delete(`moderation.punishments.${message.author.id}.muted`)
           }

      }
  }, 1000);
      return;
  }

  if(message.mentions.has("199087471215116288")) {
    if (message.author.bot) return;
    if (message.member.roles.cache.some(role => role.id === '929941845004415049')) return;
    if (message.member.roles.cache.some(role => role.id === '934314188858355782')) return;
    if (db.get(`pingwarn.${message.author.id}`) == '3') {
      auto_mute(message);
      return;
    }
    if (talkedRecently.has(message.author.id)) {
      db.add(`pingwarn.${message.author.id}`, 1)
    } else {
      db.add(`pingwarn.${message.author.id}`, 1)
      talkedRecently.add(message.author.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id);
        db.delete(`pingwarn.${message.author.id}`)
    }, 60000);
    }
    message.lineReply("Hey! Please don't ping the WorldBoss's. Make sure you read the <#929941845260255273>.\n**Repeated attempts will result in moderator action.**")
  }
  if(message.mentions.has("218345611802574848")) {
    if (message.author.bot) return;
    if (message.member.roles.cache.some(role => role.id === '929941845004415049')) return;
    if (message.member.roles.cache.some(role => role.id === '932108051924783104')) return;
    if (db.get(`pingwarn.${message.author.id}`) == '3') {
      auto_mute(message);
      return;
    }
    if (talkedRecently.has(message.author.id)) {
      db.add(`pingwarn.${message.author.id}`, 1)
    } else {
      db.add(`pingwarn.${message.author.id}`, 1)
      talkedRecently.add(message.author.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id);
        db.delete(`pingwarn.${message.author.id}`)
    }, 60000);
    }
    message.lineReply("Hey! Please don't ping the WorldBoss's. Make sure you read the <#929941845260255273>.\n**Repeated attempts will result in moderator action.**")
  }
  // if(message.mentions.has("562382703190867972")) {
  //   if (message.author.bot) return;
  //   if (message.member.roles.cache.some(role => role.id === '929941845004415049')) return;
  //   if (message.member.roles.cache.some(role => role.id === '932108051924783104')) return;
  //   if (db.get(`pingwarn.${message.author.id}`) == '3') {
  //     auto_mute(message);
  //     return;
  //   }
  //   if (talkedRecently.has(message.author.id)) {
  //     db.add(`pingwarn.${message.author.id}`, 1)
  //   } else {
  //     db.add(`pingwarn.${message.author.id}`, 1)
  //     talkedRecently.add(message.author.id);
  //   setTimeout(() => {
  //       talkedRecently.delete(message.author.id);
  //       db.delete(`pingwarn.${message.author.id}`)
  //   }, 60000);
  //   }
  //   message.lineReply("Please refrain from pinging Bam.")
  // }
  let checkiflurk = db.get(`lurking.${message.author.id}`)

  if(checkiflurk) {
    message.channel.send(`**${message.author}** is no longer lurking.`).then(message => {
      message.delete({timeout:10000})
    });
    db.delete(`lurking.${message.author.id}`)
  }

  if(message.mentions.members.first()) {
    if(message.author.bot) return;
    let mentionlurk = db.get(`lurking.${message.mentions.members.first().user.id}`)
    if(mentionlurk) {
      let userislurking = new Discord.MessageEmbed()
      .setTitle(`${message.mentions.members.first().user.tag} is Lurking!`)
      .setDescription(`They have been lurking since **${mentionlurk.startedAT}**`)
      .addField(`Reason`, mentionlurk.reason)
      .setColor("#d90053")
      .setTimestamp()
      message.channel.send(userislurking).then(message => {
  			message.delete({timeout:10000})
  		});
    }
  }
  // if (message.content.includes("<:baguette1:934681856111181844> ")) {
  //   message.delete()
  // } else if (message.content.includes("<:baguette2:934681864482996224>")) {
  //   message.delete()
  // } else if (message.content.includes("<:baguette3:934681859936366653>")) {
  //   message.delete()
  // } else if (message.content.includes("�")) {
  //   message.delete()
  // } else if (message.content.includes("�")) {
  //   message.delete()
  // }

	let pref = message.guild && db.get(`prefix.${message.guild.id}`)
	let prefix;

	if (!pref) {
		prefix = `${config.prefix}`;
	} else {
		prefix = pref;
	}

	const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|${escapeRegex(prefix)})\\s*`);
if(!prefixRegex.test(message.content)) return;
const [, matchedPrefix] = message.content.match(prefixRegex);
	if (message.author.bot) return;

	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	if(!commandName && !message.content.startsWith(prefix)) return;

	if(commandName == "prefix") {
		if (!message.member.hasPermission("MANAGE_GUILD") && message.author.id != config.ownerID) return;
		let data = db.get(`prefix.${message.guild.id}`);
		if (args[0] === "reset") {
			await db.delete(`prefix.${message.guild.id}`);
			message.channel.send(`The server prefix for **${message.guild.name}** has been reset!`);
			return console.log(`The prefix for ${message.guild.name} was reset.`);
		}
		let symbol = args[0];
		let nonedefined = new Discord.MessageEmbed()
		.setTitle("Server Prefix")
		.setDescription(`${message.guild.name}'s Current prefix is \`${prefix}\`\nUse ${prefix}prefix reset to reset the server's prefix to default.`)
		.addField("Description:", "Change the server's prefix", true)
		.addField("Usage:", `${prefix}prefix [Your_custom_prefix_here]\n${prefix}prefix reset`, true)
		.addField("Example:", `${prefix}prefix -`)
		.setColor('#d90053')
		if (!symbol) return message.channel.send(nonedefined)

		db.set(`prefix.${message.guild.id}`, symbol);
		message.channel.send(`The server prefix for **${message.guild.name}** has been updated to: \`${symbol}\``)
		return console.log(`The prefix for ${message.guild.name} was updated to: ${symbol}`);
	}



	const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Discord.Collection());
    }

    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000;

    //If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
    if(time_stamps.has(message.author.id)){
        const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

        if(current_time < expiration_time){
            const time_left = (expiration_time - current_time) / 1000;

            return message.lineReply(`Please wait \`${time_left.toFixed(1)}\` second(s) before using that command again.`);
        }
    }

    //If the author's id is not in time_stamps then add them with the current time.
    time_stamps.set(message.author.id, current_time);
    //Delete the user's id once the cooldown is over.
    setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

	if (message.channel.type == "dm") return;
  try {
		command.execute(bot, message, args, prefix, commandName);
	} catch (error) {
		console.error(error);
	}
});


bot.on('guildMemberAdd', member => {

	if(member.guild.id == "929941845004415046") {
    let botCount = member.guild.members.cache.filter(m => m.user.bot).size;
    let memberCount = `${member.guild.memberCount - botCount}`
    if(memberCount.endsWith("1")) memberCount = memberCount + "st";
    else if(memberCount.endsWith("2")) memberCount = memberCount + "nd";
    else if(memberCount.endsWith("3")) memberCount = memberCount + "rd";
    else memberCount = memberCount + "th";
		let welcomeChannel = member.guild.channels.cache.get(config.welcomeID)
		welcomeChannel.send(`Welcome to the **Official World Boss Discord** ${member}**!**\nYou are the **${memberCount}** member!`).then(message => {
			message.delete({timeout:30000})
		});


		let joinLog = member.guild.channels.cache.get(config.joinleavelogsID)
		let joinlogembed = new Discord.MessageEmbed()
		.setTitle('User Joined')
    .setDescription(`They are the **${memberCount}** member!`)
		.addField("User:", `${member.user.tag}\n${member}`)
		.addField("Discord Account created at:", `${member.user.createdAt}`)
		.setTimestamp()
		.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
		.setFooter(member.user.id)
		.setColor('GREEN')
		joinLog.send(joinlogembed)
		}

    let dbgetuser = db.get(`moderation.punishments.${member.user.id}`)

    if(!dbgetuser) return;

    else if(dbgetuser.muted != 'true') return;
      let muterole = member.guild.roles.cache.find(r => r.name === "Muted")
      member.roles.add(muterole.id);

});

bot.on('guildMemberRemove', member => {
	if(member.guild.id == "929941845004415046") {
		let leaveLog = member.guild.channels.cache.get(config.joinleavelogsID)
		let leavelogembed = new Discord.MessageEmbed()
		.setTitle('User Left')
		.addField("User:", `${member.user.tag}\n${member}`)
		.addField("Discord Account created at:", `${member.user.createdAt}`)
		.addField('Joined Server at:', `${member.joinedAt}`)
		.setTimestamp()
		.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
		.setFooter(member.user.id)
		.setColor('RED')
		leaveLog.send(leavelogembed)
		}
});

bot.snipes = new Map()
bot.on('messageDelete', function(message, channel) {
	if(!message.author || !message.content && !message.attachments.size > 0 ) return;
	bot.snipes.set(message.channel.id, {
		content:message.content,
		author:message.author.tag,
		icon:message.author.avatarURL(),
		image:message.attachments.first() ? message.attachments.first().proxyURL : null
	})
});

// game.on('win', data => {
// db.add(`games.tictactoe.${data.winner.id}.wins`, 1)
// db.add(`games.tictactoe.${data.loser.id}.losses`, 1)
// });
// game.on('tie', data => {
//   console.log(data);
// db.add(`games.tictactoe.${data.players[0].id}.ties`, 1)
// db.add(`games.tictactoe.${data.players[1].id}.ties`, 1)
// });


bot.login(config.token)
