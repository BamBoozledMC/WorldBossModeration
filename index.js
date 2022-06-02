const config = require('./config.json');
const { Client, Intents, Collection, MessageEmbed } = require ("discord.js");
const bot = new Client({ failIfNotExists: false, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const rest = new REST({ version: '9' }).setToken(config.token);
const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core-discord');
const ping = require('ping');
const emojiRegex = require("emoji-regex");
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const passportSteam = require('passport-steam');
var SteamStrategy = passportSteam.Strategy;
var DiscordStrategy = require('passport-discord').Strategy;
const SteamAPI = require('steamapi');
const { DateTime } = require("luxon");
const talkedRecently = new Set();
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en' });
const si = require('systeminformation');
const cooldowns = new Map();
const reactionAddEvent = require("./messagereaction-add.js");
const reactionRemoveEvent = require("./messagereaction-remove.js");
const slashCommands = require("./slashcommands.js");
const vlc = require('./vlc');
const https = require('https')
const fs = require('fs');
bot.commands = new Collection();
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

vlc.connect()
// vlc.add('https://www.youtube.com/watch?v=QYh6mYIJG2Y')

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use('steam', new SteamStrategy({
    returnURL: `https://wbmoderation.com/auth/steam/return`,
    realm: `https://wbmoderation.com/`,
    apiKey: config.steamAPI_KEY,
    passReqToCallback: true,
  },
  function(req, identifier, profile, done) {
      process.nextTick(function () {
      profile.identifier = identifier;
      if (!req.user) return done(null, null);
      let accounts = { discord: req.user, steam: profile }
      req.logout()
      return done(null, accounts);
    });
  }
));

var scopes = ['identify'];
var vlcscopes = ['identify', 'guilds'];

passport.use('discord', new DiscordStrategy({
    clientID: config.botID,
    clientSecret: config.botSecret,
    callbackURL: `https://wbmoderation.com/auth/discord/callback`,
    scope: scopes
},
function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
    return done(null, profile);
    });
}));
passport.use('vlcdiscord', new DiscordStrategy({
    clientID: config.botID,
    clientSecret: config.botSecret,
    callbackURL: `https://wbmoderation.com/vlc/auth/discord/callback`,
    scope: vlcscopes,
    passReqToCallback: true,
},
function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
    req.logout()
    return done(null, profile);
    });
}));

const app = express();
app.set('view engine', 'ejs')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/media', express.static(__dirname + '/web/media'));
app.use('/dumpy', express.static(__dirname + '/dumpys'));


app.get('/', function(req,res) {
  res.sendFile(__dirname+'/web/index.html');
  req.logout();
});
app.get('/favicon.ico', function(req,res) {
  res.sendFile(__dirname+'/web/favicon.ico');
});
app.get('/projects', function(req,res) {
  res.sendFile(__dirname+'/web/projects.html');
  req.logout();
});
app.get('/vlc/controller', async function(req,res) {
  let basicinfo = req.user ? req.user : null
  let loggedin = req.user ? true : false
  let userguilds = basicinfo ? basicinfo.guilds : null
  let inguild = false
  if (basicinfo) {
    if (basicinfo.guilds.some(e => e.id == config.serverID)) {
      inguild = true
    } else inguild = false
  }
  res.render(__dirname+'/web/vlccontroller.ejs', { loggedin: loggedin, discordpfp: basicinfo ? `https://cdn.discordapp.com/avatars/${basicinfo.id}/${basicinfo.avatar}?size=2048` : null, discordname: basicinfo ? `${basicinfo.username}#${basicinfo.discriminator}` : null, inguild: inguild, })
});
app.post('/vlc/actions/*', function(request, response){
  if (request.headers.referer != 'https://wbmoderation.com/vlc/controller') return;
  let action = request.query.action
  let vidurl = request.query.url
  console.log(`VLC Player ${action} ${vidurl}`);
  if (action == "add") vlc.add(vidurl);
  if (action == "enqueue") vlc.enqueue(vidurl);
  if (action == "stop") vlc.stop();
  if (action == "playpause") vlc.pause();
  if (action == "next") vlc.next();
  if (action == "previous") vlc.prev();
  response.send("success")
});
app.get('/aodbot.png', function(req,res) {
  res.sendFile(__dirname+'/web/aodbot.PNG');
});
app.get('/bnftbot.png', function(req,res) {
  res.sendFile(__dirname+'/web/bnftbot.PNG');
});
app.get('/secret', function(req,res) {
  res.sendFile(__dirname+'/web/secret.html');
});

app.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res) {
    // The request will be redirected to Steam for authentication, so
    // this function will not be called.
  });

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/complete');
  });

  app.get('/auth/discord', passport.authenticate('discord'));
  app.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: '/' }),
   function(req, res) {
     let checkdb = db.get(`linked.users.${req.user.id}`)
     if (checkdb) {
       return res.redirect('/alreadylinked')
     }
      res.redirect('/auth/steam') // Successful auth
  });
  app.get('/vlc/auth/discord', passport.authenticate('vlcdiscord'));
  app.get('/vlc/auth/discord/callback', passport.authenticate('vlcdiscord', { failureRedirect: '/' }),
   function(req, res) {
      res.redirect('/vlc/controller') // Successful auth
  });

  app.get('/alreadylinked', async function(req,res) {
    if (!req.user) return res.redirect('/');
    res.render(__dirname+'/web/alreadylinked.ejs')
    req.logout()
  });

  app.get('/complete', async function(req,res) {
    if (!req.user) return res.redirect('/');
    let steamuser = req.user.steam
    let discorduser = req.user.discord
    let checkforreload = db.get(`linked.users.${discorduser.id}`)
    if (checkforreload) return res.redirect('/');
    db.set(`linked.users.${discorduser.id}`, { discord: discorduser.id, steam: steamuser.id })
    res.render(__dirname+'/web/complete.ejs', { discordpfp: `https://cdn.discordapp.com/avatars/${discorduser.id}/${discorduser.avatar}?size=2048`, steampfp: `${steamuser._json.avatarfull}`, discordname: `${discorduser.username}#${discorduser.discriminator}`, steamname: `${steamuser.displayName}` });
    let user = await bot.users.fetch(discorduser.id).catch(() => null);
    if (!user) {
      console.log(`${discorduser.username}#${discorduser.discriminator} was not found.`);
    } else if (user) {
      let linkembed = new MessageEmbed()
      .setTitle("Successfully Linked!")
      .setThumbnail('https://media.discordapp.net/attachments/933574813849632848/934606101847109652/worldboss_bot.jpg')
      .setDescription(`Your Steam (**${steamuser.displayName}**) & Discord (**${discorduser.username}#${discorduser.discriminator}**) account are now linked with **World Boss Moderation**\n\nTo unlink your accounts, use \`!unlink\`in <#932828142094123009> or use \`!link\` to check your linked account info.`)
      .setColor('#d90053')
  		.setFooter(`Developed by BamBoozled#0882`)
      .setTimestamp()
      user.send({embeds: [linkembed]}).catch(() => {
        console.log(`${discorduser.username}#${discorduser.discriminator} was found but could not be DMed.`);
      });
    }
    req.logout()
  });

  app.get('/discord', function(req,res) {
    res.redirect('https://discord.gg/worldboss');
  });
  app.get('/appeal', function(req,res) {
    res.redirect('https://forms.gle/5JksXxC9dCqDCob5A');
  });
  app.get('/patreon', function(req,res) {
    res.redirect('https://www.patreon.com/bamboozledlw');
  });
  app.get('/github', function(req,res) {
    res.redirect('https://github.com/BamBoozledMC/WorldBossModeration');
  });

  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}

app.listen(config.port, () => console.log(`Web server listening at http://localhost:${config.port}`));


bot.on("ready", async () => {
  const getguild = await bot.guilds.fetch(config.serverID);
  const getchannel = getguild.channels.cache.get(config.suggestionID);
  const getmessages = getchannel.messages.fetch()


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

					let unmuteembed = new MessageEmbed()
    				.setColor("#d90053")
		  			.setTitle(`Unmute | ${member.user.tag}`)
		  			.addField("User", member.toString(), true)
     				.addField("Moderator", bot.user.toString(), true)
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
					  bot.channels.cache.get(config.logsID).send({embeds: [unmuteembed]})
            db.delete(`moderation.punishments.${member.user.id}.muted`)

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


const slashcmds = [
	new SlashCommandBuilder()
  .setName('ping')
  .setDescription("Get bot's latency"),
	new SlashCommandBuilder()
  .setName('hello')
  .setDescription('Replies with Hello!'),
  new SlashCommandBuilder()
  .setName('slowmode')
  .setDescription('Set a channel slowmode')
  .addStringOption(option => option.setName('time').setDescription('Enter the slowmode time.')),
  new SlashCommandBuilder()
  .setName('tictactoe')
  .setDescription('Play a game of TicTacToe')
  .addUserOption(option => option.setName('opponent').setDescription('VS Another user.')),
  new SlashCommandBuilder()
  .setName('discorddate')
  .setDescription('Generate a timestamp that complies with user timezones.')
  .addStringOption(option => {
    option.setName('timezone')
    option.setDescription('Your current timezone')
    option.setRequired(true)
    option.addChoice('Queensland, Australia', 'Australia/Brisbane')
    option.addChoice('NSW, Australia', 'Australia/Sydney')
    option.addChoice('Victoria, Australia', 'Australia/Victoria')
    option.addChoice('New Zealand (NZ)', 'Pacific/Auckland')
    option.addChoice('America (US), ET (Eastern Time)', 'US/Eastern')
    option.addChoice('America (US), CT (Central Time)', 'US/Central')
    option.addChoice('London, Europe', 'Europe/London')
    option.addChoice('Paris, Europe', 'Europe/Paris')
    option.addChoice('IST (Indian Standard Time)', 'Asia/Calcutta')
    option.addChoice('UTC (Universal Time)', 'UTC')

    return option
  })
  .addIntegerOption( option => option.setName('date').setDescription('Date (day) number from 1 - 31').setRequired(true))
  .addIntegerOption( option => {
    option.setName('month')
    option.setDescription('Month number from 01 - 12')
    option.setRequired(true)
    for (let i = 1; i <= 12; i++) {
      let num = i <= 9 ? "0" + i.toString() : i
      option.addChoice(`${num}`, i)
    }
    return option
  })
  .addIntegerOption( option => option.setName('year').setDescription('Year as a 4 digit number').setRequired(true))
  .addIntegerOption( option => {
    option.setName('time_hour')
    option.setDescription('Hour number in 24 hour time from 00 - 23')
    option.setRequired(true)
    for (let i = 0; i <= 23; i++) {
      let num = i <= 9 ? "0" + i.toString() : i
      option.addChoice(`${num}`, i)
    }
    return option
  })
  .addIntegerOption( option => option.setName('time_minute').setDescription('Minute number from 00 - 59').setRequired(true)),
  new SlashCommandBuilder()
  .setName('say')
  .setDescription('Returns your message')
  .addStringOption(option => option.setName('message').setDescription('Message to send.').setRequired(true)),
  new SlashCommandBuilder()
  .setName('fortnitestats')
  .setDescription("Get the stats of someone's Fortnite account")
  .addStringOption(option => {
    option.setName('platform')
    option.setDescription('Platform the user plays on')
    option.setRequired(true)
    option.addChoice('All (Global)', 'all')
    option.addChoice('Mobile', 'touch')
    option.addChoice('PC', 'kbm')
    option.addChoice('PlayStation', 'psn')
    option.addChoice('XBOX', 'xbox')

    return option
  })
  .addStringOption( option => option.setName('username').setDescription("Username of the account you'd like to view").setRequired(true)),
  new SlashCommandBuilder()
  .setName('calculator')
  .setDescription('Calculator with clickable buttons.')
].map(command => command.toJSON());

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(config.botID, '934186244810870874'),
			{ body: slashcmds },
		);
    await rest.put(
			Routes.applicationGuildCommands(config.botID, config.serverID),
			{ body: slashcmds },
		);
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

bot.on('interactionCreate', interaction => slashCommands(interaction, bot));
bot.on('messageReactionAdd', (reaction, user) => reactionAddEvent(reaction, user, bot));
bot.on('messageReactionRemove', (reaction, user) => reactionRemoveEvent(reaction, user, bot));

bot.on('messageCreate', async message => {
  if (message.channel.type == "DM") return;
  const auto_mute = async (message) => {

      db.delete(`pingwarn.${message.author.id}`)
      let muterole = message.guild.roles.cache.find(r => r.name === "Muted");
      try {
    await(message.member.roles.add(muterole.id));
      } catch(e) {
        console.log(e);
        return;
      }
    let muteembed = new MessageEmbed()
        .setColor("#d90053")
        .setTitle(`Tempmute | ${message.author.tag}`)
        .addField("User", message.author.toString(), true)
        .addField("Moderator", bot.user.toString(), true)
        .addField("Time", "24h")
        .addField("Reason", "Pinging Fresh/Lazarbeam multiple times", true)
        .setTimestamp()
        .setFooter(message.author.id)
    bot.channels.cache.get(config.logsID).send({embeds: [muteembed]});
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

          let unmuteembed = new MessageEmbed()
      .setColor("#d90053")
        .setTitle(`Unmute | ${message.author.tag}`)
        .addField("User", message.author.toString(), true)
        .addField("Moderator", bot.user.toString(), true)
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
    bot.channels.cache.get(config.logsID).send({embeds: [unmuteembed]})
    db.delete(`moderation.punishments.${message.author.id}.muted`)

      }
  }, 1000);
      return;
  }

  if(message.mentions.has("199087471215116288")) {
    if (message.author.bot) return;
    if (message.member.roles.cache.some(role => role.id === '929941845004415049')) return;
    if (message.member.roles.cache.some(role => role.id === '932108051924783104')) return;
    if (message.member.roles.cache.some(role => role.id === '929941845004415048')) return;
    if (db.get(`pingwarn.${message.author.id}`) == '2') {
      auto_mute(message);
      return;
    }
    if (talkedRecently.has(message.author.id)) {
      await db.add(`pingwarn.${message.author.id}`, 1)
    } else {
      await db.add(`pingwarn.${message.author.id}`, 1)
      talkedRecently.add(message.author.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id);
        db.delete(`pingwarn.${message.author.id}`)
    }, 300000);
    }
    message.reply("Hey! Please don't ping the WorldBoss's. Make sure you read the <#929941845260255273>.\n**Repeated attempts will result in moderator action.**")
  }
  if(message.mentions.has("218345611802574848")) {
    if (message.author.bot) return;
    if (message.member.roles.cache.some(role => role.id === '929941845004415049')) return;
    if (message.member.roles.cache.some(role => role.id === '932108051924783104')) return;
    if (message.member.roles.cache.some(role => role.id === '929941845004415048')) return;
    if (db.get(`pingwarn.${message.author.id}`) == '2') {
      auto_mute(message);
      return;
    }
    if (talkedRecently.has(message.author.id)) {
      await db.add(`pingwarn.${message.author.id}`, 1)
    } else {
      await db.add(`pingwarn.${message.author.id}`, 1)
      talkedRecently.add(message.author.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id);
        db.delete(`pingwarn.${message.author.id}`)
    }, 300000);
    }
    message.reply("Hey! Please don't ping the WorldBoss's. Make sure you read the <#929941845260255273>.\n**Repeated attempts will result in moderator action.**")
  }
  if(message.content.includes("🍆")) {
    message.delete().catch(error =>{
		})
  }
  if(message.content.includes("🍑")) {
    message.delete().catch(error =>{
		})
  }
  if(message.content.includes("ඞ")) {
    message.delete().catch(error =>{
		})
  }
  const emotes = (str) => str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);
  let getemojis = emotes(message.content)
  if (getemojis) {
    if (getemojis.length > 5) {
      if (message.author.bot) return;
      if (message.member.roles.cache.some(role => role.id === '929941845004415049')) return;
      if (message.member.roles.cache.some(role => role.id === '932108051924783104')) return;
      if (message.member.roles.cache.some(role => role.id === '929941845004415048')) return;
      message.delete().catch(error => {})
    }
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
  //   }, 300000);
  //   }
  //   message.reply("Please refrain from pinging Bam.")
  // }
  let checkiflurk = db.get(`lurking.${message.author.id}`)

  if(checkiflurk) {
    message.channel.send(`**${message.author}** is no longer lurking.`).then(message => {
      setTimeout(() => message.delete().catch(error => {}), 10000);
    });
    if (message.author.username == checkiflurk.name) {
      await message.member.setNickname("").catch(error => {});
    } else {
      await message.member.setNickname(checkiflurk.name).catch(error => {});
    }
    db.delete(`lurking.${message.author.id}`)
  }

  if(message.mentions.members.first()) {
    if(message.author.bot) return;
    let mentionlurk = db.get(`lurking.${message.mentions.members.first().user.id}`)
    if(mentionlurk) {
      let userislurking = new MessageEmbed()
      .setTitle(`${message.mentions.members.first().user.tag} is Lurking!`)
      .setDescription(`They have been lurking since <t:${mentionlurk.startedAT}:F>`)
      .addField(`Reason`, mentionlurk.reason)
      .setColor("#d90053")
      .setTimestamp()
      message.channel.send({embeds: [userislurking]}).then(message => {
  			setTimeout(() => message.delete(), 10000);
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

  //delete messages from suggestion channel that is not a suggestion
  if (message.channel.id == config.suggestionID) {
    if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
      if(!message.content.toLowerCase().startsWith(`${prefix}suggest`) && !message.content.toLowerCase().startsWith(`${prefix}suggestion`)) {
        if(!message.content.toLowerCase().startsWith(`${prefix}editsuggestion`) && !message.content.toLowerCase().startsWith(`${prefix}editlastsuggestion`)) {
          message.delete().catch(error =>{
			    })
			    message.channel.send(`${message.author}, Use **${prefix}suggest *your suggestion*** if you wish to suggest something __or__\nUse **${prefix}editsuggestion *your edited suggestion*** to edit your last suggestion.\nMisuing this command will lead to punishments.`).then(message => {
            setTimeout(() => message.delete(), 10000);
          });
      }
    }
		}
  }


	const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|${escapeRegex(prefix)})\\s*`);
if(!prefixRegex.test(message.content)) return;
const [, matchedPrefix] = message.content.match(prefixRegex);
	if (message.author.bot) return;
	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	if(!commandName && !message.content.startsWith(prefix)) return message.channel.send(`Hi! I'm World Boss Moderation, a powerful moderation bot created and hosted by BamBoozled#0882.\nUse \`${prefix}help\` to view a list of commands.\nWebsite => <https://wbmoderation.com/>`);

	if(commandName == "prefix") {
		if (!message.member.permissions.has("MANAGE_GUILD") && message.author.id != config.ownerID) return;
		let data = db.get(`prefix.${message.guild.id}`);
		if (args[0] === "reset") {
			await db.delete(`prefix.${message.guild.id}`);
			message.channel.send(`The server prefix for **${message.guild.name}** has been reset!`);
			return console.log(`The prefix for ${message.guild.name} was reset.`);
		}
		let symbol = args[0];
		let nonedefined = new MessageEmbed()
		.setTitle("Server Prefix")
		.setDescription(`${message.guild.name}'s Current prefix is \`${prefix}\`\nUse ${prefix}prefix reset to reset the server's prefix to default.`)
		.addField("Description:", "Change the server's prefix", true)
		.addField("Usage:", `${prefix}prefix [Your_custom_prefix_here]\n${prefix}prefix reset`, true)
		.addField("Example:", `${prefix}prefix -`)
		.setColor('#d90053')
		if (!symbol) return message.channel.send({embeds: [nonedefined]})

		db.set(`prefix.${message.guild.id}`, symbol);
		message.channel.send(`The server prefix for **${message.guild.name}** has been updated to: \`${symbol}\``)
		return console.log(`The prefix for ${message.guild.name} was updated to: ${symbol}`);
	}



	const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Collection());
    }

    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000;

    //If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
    if(time_stamps.has(message.author.id)){
        const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

        if(current_time < expiration_time){
            const time_left = (expiration_time - current_time) / 1000;

            return message.reply(`Please wait \`${time_left.toFixed(1)}\` second(s) before using that command again.`).then(message => {
    					setTimeout(() => message.delete(), 3000);
    				});
        }
    }

    //If the author's id is not in time_stamps then add them with the current time.
    time_stamps.set(message.author.id, current_time);
    //Delete the user's id once the cooldown is over.
    setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

	if (message.channel.type == "DM") return;
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
			setTimeout(() => message.delete(), 30000);
		});


		let joinLog = member.guild.channels.cache.get(config.joinleavelogsID)
		let joinlogembed = new MessageEmbed()
		.setTitle('User Joined')
    .setDescription(`They are the **${memberCount}** member!`)
		.addField("User:", `${member.user.tag}\n${member}`)
		.setTimestamp()
		.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
		.setFooter(member.user.id)
		.setColor('GREEN')
    try {
      joinlogembed.addField("Discord Account created at:", `<t:${Math.round(member.user.createdAt.getTime() / 1000)}:F>`)
    } catch (e) {
    }
		joinLog.send({embeds: [joinlogembed]})
		}

    let dbgetuser = db.get(`moderation.punishments.${member.user.id}`)

    if(!dbgetuser) return;

    else if(dbgetuser.muted != 'true') return;
      let muterole = member.guild.roles.cache.find(r => r.name === "Muted")
      member.roles.add(muterole.id);

});

bot.on('guildMemberRemove', member => {
  let dbget = db.get(`linked.users.${member.user.id}`)
  let checkiflurk = db.get(`lurking.${member.user.id}`)

  if(checkiflurk) {
    db.delete(`lurking.${member.user.id}`)
  }
  if (dbget) {
    db.delete(`linked.users.${member.user.id}`)
  }
	if(member.guild.id == "929941845004415046") {
		let leaveLog = member.guild.channels.cache.get(config.joinleavelogsID)
		let leavelogembed = new MessageEmbed()
		.setTitle('User Left')
		.addField("User:", `${member.user.tag}\n${member}`)
		.setTimestamp()
		.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
		.setFooter(member.user.id)
		.setColor('RED')
    try {
    leavelogembed.addField("Discord Account created at:", `<t:${Math.round(member.user.createdAt.getTime() / 1000)}:F>`)
    leavelogembed.addField('Joined Server at:', `<t:${Math.round(member.joinedAt.getTime() / 1000)}:F>`)
  } catch (e) {
  }
		leaveLog.send({embeds: [leavelogembed]})
		}
});

bot.snipes = new Map()
bot.on('messageDelete', function(message, channel) {
  let checkifsuggestion = db.get(`suggestions.${message.id}`)
  if (checkifsuggestion) {
    db.delete(`suggestions.${message.id}`)
    console.log(message.id);
  }

	if(!message.author || !message.content && !message.attachments.size > 0 ) return;
	bot.snipes.set(message.channel.id, {
		content:message.content,
		author:message.author.tag,
		icon:message.author.avatarURL(),
		image:message.attachments.first() ? message.attachments.first().proxyURL : null
	})
  if (message.attachments.first()) {
    let atta = message.attachments.map(attachment => attachment.toJSON())
    Object.keys(atta).forEach( async function (key){
			let attachment = atta[key]
      let url = attachment.attachment
      let filename = url.replace('https://cdn.discordapp.com/attachments/', '')
      filename = filename.replaceAll('/', '-')
      let filelink = `https://wbmoderation.com/media/attachments/${filename}`
      if (!filename.endsWith('.exe')) {
        https.get(url, resp => {
          resp.pipe(fs.createWriteStream(`./web/media/attachments/${filename}`));
          resp.on('end', () => {
            let deletedattach = new MessageEmbed()
            .setColor("RED")
            .setAuthor(`${message.author.tag}`, message.author.avatarURL())
            .setTitle(`Attachment deleted in #${message.channel.name}`)
            .addField(`${attachment.name}`, `[Attachment Link](${filelink}) - Helpful if content below fails to load.\nNote: Videos will not load in embeds, use the link above to view videos.`)
            .setImage(`${filelink}`)
            .setFooter(`ID: ${message.author.id}`)
            .setTimestamp()
            bot.channels.cache.get(config.logsID).send({embeds: [deletedattach]})
          })
        })
    }
    });
  }
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
