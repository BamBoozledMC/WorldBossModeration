const config = require('./config.json');
const { Client, Intents, Collection, MessageEmbed } = require ("discord.js");
const bot = new Client({ failIfNotExists: false, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const rest = new REST({ version: '9' }).setToken(config.token);
const { SlashCommandBuilder, ContextMenuCommandBuilder  } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v9');
const db = require('quick.db');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core-discord');
const ping = require('ping');
const emojiRegex = require("emoji-regex");
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const passport = require('passport');
const session = require('express-session');
const passportSteam = require('passport-steam');
var SteamStrategy = passportSteam.Strategy;
var DiscordStrategy = require('passport-discord').Strategy;
const SteamAPI = require('steamapi');
const { DateTime, Interval } = require("luxon");
const talkedRecently = new Set();
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en' });
const si = require('systeminformation');
const cooldowns = new Map();
const reactionAddEvent = require("./messagereaction-add.js");
const reactionRemoveEvent = require("./messagereaction-remove.js");
const slashCommands = require("./slashcommands.js");
const contextCommands = require("./contextcommands.js");
const vlc = require('./vlc');
const Moralis = require('moralis/node');
const ObjectsToCsv = require('objects-to-csv');
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

//vlc.connect()
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
var dashboardscopes = ['identify', 'guilds'];

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
passport.use('beansdiscord', new DiscordStrategy({
    clientID: config.botID,
    clientSecret: config.botSecret,
    callbackURL: `https://wbmoderation.com/beansnft/auth/discord/callback`,
    scope: scopes,
    passReqToCallback: true,
},
function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
    req.logout()
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
passport.use('discorddashboard', new DiscordStrategy({
    clientID: config.botID,
    clientSecret: config.botSecret,
    callbackURL: `https://wbmoderation.com/dashboard/auth/discord/callback`,
    scope: dashboardscopes,
    passReqToCallback: true,
},
function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
    req.logout()
    return done(null, profile);
    });
}));

function saveOriginalUrl(req, res, next) {
    req.session.returnTo = req.originalUrl;
    return next();
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.set('view engine', 'ejs')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/media', express.static(__dirname + '/web/media'));
app.use('/embedbuilder', express.static(__dirname + '/web/embedbuilder'));
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
  res.render(__dirname+'/web/vlccontroller.ejs', { loggedin: loggedin, discordpfp: basicinfo ? basicinfo.avatar ? `https://cdn.discordapp.com/avatars/${basicinfo.id}/${basicinfo.avatar}?size=2048` : `https://wbmoderation.com/media/defaultpfp.jpg` : null, discordname: basicinfo ? `${basicinfo.username}#${basicinfo.discriminator}` : null, inguild: inguild, })
});
app.get('/dashboard', saveOriginalUrl, async function(req,res) {
  let basicinfo = req.user ? req.user : null
  let loggedin = req.user ? true : false
  let userguilds = basicinfo ? basicinfo.guilds : null
  let inguild = false
  let wbicon = null
  let wbname = null
  let hasaccess = false
  let redirectlogin = req.query.r ? req.query.r : null
  if (basicinfo) {
    if (basicinfo.guilds.some(e => e.id == config.serverID)) {
      inguild = true
      wbicon = bot.guilds.cache.get(config.serverID).iconURL()
      wbname = bot.guilds.cache.get(config.serverID).name
      if (bot.guilds.cache.get(config.serverID).members.cache.get(basicinfo.id).permissions.has("MANAGE_GUILD") || basicinfo.id == config.ownerID) hasaccess = true
    } else inguild = false
  }
  if (hasaccess && redirectlogin) return res.redirect(`${redirectlogin}`)
  res.render(__dirname+'/web/dashboard.ejs', { loggedin: loggedin, discordpfp: basicinfo ? basicinfo.avatar ? `https://cdn.discordapp.com/avatars/${basicinfo.id}/${basicinfo.avatar}?size=2048` : `https://wbmoderation.com/media/defaultpfp.jpg` : null, discordname: basicinfo ? `${basicinfo.username}#${basicinfo.discriminator}` : null, inguild: inguild, hasaccess: hasaccess, wbname: wbname, wbicon: wbicon, })
});
app.get('/dashboard/server/*', async function(req,res) {
  let server;
  let subpage;
  if (req.params[0].includes("/")) {
    let str = req.params[0]
    let n = str.split('/')
    subpage = n[1]
    server = n[0]
  } else {
    server = req.params[0]
    subpage = null
  }
  if(!bot.guilds.cache.get(server)) return res.redirect("/dashboard");
  if (!req.user) return res.redirect(`/dashboard?r=${req.originalUrl}`);
  let basicinfo = req.user
  if (!bot.guilds.cache.get(server).members.cache.get(basicinfo.id).permissions.has("MANAGE_GUILD") && basicinfo.id != config.ownerID) return res.redirect('/dashboard');
  let guild = bot.guilds.cache.get(server)

  if (!subpage) {
  res.render(__dirname+'/web/manageguild.ejs', { discordpfp: basicinfo ? basicinfo.avatar ? `https://cdn.discordapp.com/avatars/${basicinfo.id}/${basicinfo.avatar}?size=2048` : `https://wbmoderation.com/media/defaultpfp.jpg` : null, discordname: basicinfo ? `${basicinfo.username}#${basicinfo.discriminator}` : null, guild: guild, bot: bot, })
  } else if (subpage == 'configuration') {
    let colortheme = db.get(`color.${guild.id}`) ? db.get(`color.${guild.id}`) : config.themecolor
    let resetcolordisabled = db.get(`color.${guild.id}`) ? true : false
    let prefix = db.get(`prefix.${guild.id}`) ? db.get(`prefix.${guild.id}`) : config.prefix
    let resetprefixdisabled = db.get(`prefix.${guild.id}`) ? true : false
    let getdisabledcmds = db.get(`commands.${guild.id}`)
    let disabledcmds = []
    for(let file of commandFiles){
      file = file.replace(".js", "")
      disabledcmds.push({ cmd: file, disabled: getdisabledcmds ? (getdisabledcmds[file] ? (getdisabledcmds[file].disabled ? getdisabledcmds[file].disabled : false) : false) : false })
    }
    disabledcmds = disabledcmds.reduce(
      (obj, item) => Object.assign(obj, { [item.cmd]: item.disabled }), {});
    res.render(__dirname+'/web/manageguild_config.ejs', { discordpfp: basicinfo ? basicinfo.avatar ? `https://cdn.discordapp.com/avatars/${basicinfo.id}/${basicinfo.avatar}?size=2048` : `https://wbmoderation.com/media/defaultpfp.jpg` : null, discordname: basicinfo ? `${basicinfo.username}#${basicinfo.discriminator}` : null, guild: guild, bot: bot, prefix: prefix, themecolor: colortheme, resetprefixdisabled: resetprefixdisabled, resetcolordisabled: resetcolordisabled, disabledcmds: disabledcmds,  })
  } else if (subpage == 'embedmanager') {
    let existingembeds = db.get(`embeds.${guild.id}`) ? db.get(`embeds.${guild.id}`) : null
    let guildchannels = [];
    guild.channels.cache.forEach((channel)=>{
      if (guild.me.permissionsIn(channel).has("VIEW_CHANNEL") && guild.me.permissionsIn(channel).has("SEND_MESSAGES")) {
        if (channel.type == "GUILD_TEXT") {
          guildchannels.push({ channelID: channel.id, channelNAME: channel.name })
        }
      }
    })
    guildchannels = guildchannels.reduce(
      (obj, item) => Object.assign(obj, { [item.channelID]: item.channelNAME }), {});

    res.render(__dirname+'/web/manageguild_misc-embedmanager.ejs', { discordpfp: basicinfo ? basicinfo.avatar ? `https://cdn.discordapp.com/avatars/${basicinfo.id}/${basicinfo.avatar}?size=2048` : `https://wbmoderation.com/media/defaultpfp.jpg` : null, discordname: basicinfo ? `${basicinfo.username}#${basicinfo.discriminator}` : null, guild: guild, bot: bot, channels: guildchannels, existingembeds: existingembeds, })
  } else if (subpage == 'rolemanager') {
    let access = [
      `${config.ownerID}`,
      `123697101078003712`,
      `250824078636613632`
    ]
    if (!access.includes(`${basicinfo.id}`)) return res.redirect(`/dashboard/server/${guild.id}`)

    res.render(__dirname+'/web/manageguild_misc-rolemanager.ejs', { discordpfp: basicinfo ? basicinfo.avatar ? `https://cdn.discordapp.com/avatars/${basicinfo.id}/${basicinfo.avatar}?size=2048` : `https://wbmoderation.com/media/defaultpfp.jpg` : null, discordname: basicinfo ? `${basicinfo.username}#${basicinfo.discriminator}` : null, guild: guild, bot: bot,  })
  } else {
    res.redirect(`/dashboard/server/${guild.id}`)
  }
});
app.get('/beansnft', async function(req,res) {
  let access = [
    `${config.ownerID}`,
    `123697101078003712`
  ]
  if (!req.user) return res.render(__dirname+'/beansnft/notloggedin.ejs', {  });
  let basicinfo = req.user
  if (access.includes(`${req.user.id}`)) return res.render(__dirname+'/beansnft/loggedin.ejs', { discordpfp: basicinfo ? basicinfo.avatar ? `https://cdn.discordapp.com/avatars/${basicinfo.id}/${basicinfo.avatar}?size=2048` : `https://wbmoderation.com/media/defaultpfp.jpg` : null, discordname: basicinfo ? `${basicinfo.username}#${basicinfo.discriminator}` : null });
  else return res.render(__dirname+'/beansnft/noaccess.ejs', {  });
})
io.on('connection', (socket) => {
  socket.on('themecolorchange', (color, guild) => {
    db.set(`color.${guild}`, color)
    socket.emit('success', 'color', `Successfully changed the bot theme color to: <code>${color}</code>`)
  });

  socket.on('assignroles', async (role, users, guild) => {
    const timer = ms => new Promise(res => setTimeout(res, ms))
    guild = bot.guilds.cache.get(guild)
    role = guild.roles.cache.get(role);
    let failedusers = 0
    let curruser = 0
    if (!guild.me.permissions.has("MANAGE_ROLES")) return socket.emit('error', 'nopermission', `The bot does not have the MANAGE_ROLES permission.<br>Make sure the bot has sufficient permissions and try again.`);
    if (!role) return socket.emit('error', 'invalidrole', `The Role ID you provided is invalid or doesn't exist!`);
    if (!role.editable) return socket.emit('error', 'norolepermission', `The role provided can not be managed by the bot!<br>Please make sure the bot role is higher than the role you wish to assign.`);

    for (const user of users) {
      curruser++
      let member;
      if (!isNaN(user)) {
        member = await guild.members.fetch({user, cache: false})
      } else {
        member = await guild.members.fetch({cache : false}).then(members=>members.find(member=>member.user.tag === user))
      }
      if (!member) {
        failedusers++
        socket.emit('error', 'nosuchuser', `The role was not assigned to <code>${user}</code> because this user does not exist`);
     } else if (!member.manageable) {
       failedusers++
       socket.emit('error', 'usernotmanagable', `The role was not assigned to <code>${user}</code> (<code>${member.user.tag}</code>) because the bot role is below the target user`);
      } else {
        await member.roles.add(role.id)
        console.log(user + ` | ${curruser}`);
      }
      socket.emit('progroles', curruser, users.length)
      await timer(1000)
    }

    socket.emit('success', 'assignroles', `Successfully assigned <code>@${role.name}</code> to <code>${users.length - failedusers}</code> out of <code>${users.length}</code> users!`)

  });

  socket.on('reset', (info, guild) => {
    if (info == 'color') {
      db.delete(`color.${guild}`)
      socket.emit('success', 'resetcolor', `Successfully reset the bot theme color to default.`)
    }
  });

  socket.on('createembed', (json, embedname, guild, selchannel) => {
    let theEmbed = json
    let channel = bot.channels.cache.get(selchannel)
      channel.send(theEmbed).then((msg) => {
        db.set(`embeds.${guild}.${msg.id}`, { name: embedname, channel: selchannel, json: theEmbed })
        socket.emit('success', 'createembed', `Successfully created an embed in <code># ${channel.name}</code> named <code>${embedname}</code>!`)
      }).catch(error =>{
        console.log(error);
        return socket.emit('error', 'createembed', `An error occurred whilst creating or sending your Embed.<br>Try again or check with Bam for more info.`)
      });
  });
  socket.on('editembed', (json, guild, selembed) => {
    let theEmbed = json
    let embeddb = db.get(`embeds.${guild}.${selembed}`)

    bot.guilds.cache.get(guild).channels.cache.get(embeddb.channel).messages.fetch(selembed).then((msg) => {
        msg.edit(theEmbed).catch(error =>{
          console.log(error);
          return socket.emit('error', 'editembed', `An error occurred whilst submitting your changes to <code>${embeddb.name}</code><br>Try again or check with Bam for more info.`)
        });

        db.set(`embeds.${guild}.${selembed}`, { name: embeddb.name, channel: embeddb.channel, json: theEmbed })
        socket.emit('success', 'editembed', `Successfully submit your changes to <code>${embeddb.name}</code> located in <code># ${bot.channels.cache.get(embeddb.channel).name}</code>!`)
      }).catch(error =>{
        console.log(error);
        return socket.emit('error', 'editembed', `An error occurred whilst submitting your changes to <code>${embeddb.name}</code><br>Try again or check with Bam for more info.`)
      });
  });
  socket.on('deleteembed', (guild, selembed) => {
    let embeddb = db.get(`embeds.${guild}.${selembed}`)

    bot.guilds.cache.get(guild).channels.cache.get(embeddb.channel).messages.fetch(selembed).then((msg) => {
        msg.delete().catch(error =>{
          console.log(error);
          return socket.emit('error', 'deleteembed', `An error occurred whilst deleting <code>${embeddb.name}</code><br>Try again or check with Bam for more info.`)
        });

        db.delete(`embeds.${guild}.${selembed}`)
        socket.emit('success', 'deleteembed', `Successfully deleted <code>${embeddb.name}</code>!`)
      }).catch(error =>{
        console.log(error);
        return socket.emit('error', 'deleteembed', `An error occurred whilst removing <code>${embeddb.name}</code> from the database.<br>Try again or check with Bam for more info.`)
      });
  });
  socket.on('getembeddata', (guild, selected) => {
    let embeddata = db.get(`embeds.${guild}.${selected}`)
    socket.emit('embeddata', embeddata)
  });
  socket.on('savecmd', (cmd, disabled, guild) => {
    console.log(cmd);
    console.log(disabled);
    db.set(`commands.${guild}.${cmd}`, { disabled: disabled })
      socket.emit('success', 'savecmd', `Successfully <code>${disabled ? 'disabled' : 'enabled'}</code> the <code>${cmd}</code> command!`)
  });

  socket.on('gatherbeans', async () => {
    const cfg = require('./beansnft/cfg.json')
    const serverUrl = cfg.serverURL;
    const appId = cfg.appID;
    const contractAddress = cfg.contractAddress;

    await Moralis.start({ serverUrl: serverUrl, appId: appId });

    let cursor = null;
    let beans = {};
    let overallprogress = 0
    do {
      const response = await Moralis.Web3API.token.getNFTOwners({
        address: contractAddress,
        chain: "eth",
        limit: 100,
        cursor: cursor,
      });
      overallprogress = overallprogress + 1 / 3
      socket.emit('progress', '1', '3', 'Gathering all Beans', response.page - 1, overallprogress)
        for (const owner of response.result) {
          beans[owner.token_id] = {
          amount: owner.amount,
          owner: owner.owner_of,
          tokenId: owner.token_id,
          tokenAddress: owner.token_address,
          metadata: owner.metadata,
        };
      }
      cursor = response.cursor;
    } while (cursor != "" && cursor != null);

    let mdb = fs.readFileSync('./beansnft/db.json', 'utf8')
    mdb = JSON.parse(mdb);
    let allBeansData = mdb
    for (const transaction of Object.keys(beans)) {
        let trinfo = beans[transaction]
        if (trinfo.owner != (mdb[trinfo.tokenId] ? mdb[trinfo.tokenId].owner : null)) {
      const response2 = await Moralis.Web3API.token.getWalletTokenIdTransfers({
          address: contractAddress,
          token_id: trinfo.tokenId,
          chain: "eth",
          limit: 100,
        });
        for (const trdata of response2.result) {
          if (trdata.to_address == trinfo.owner) {
          allBeansData[trinfo.tokenId] = {
              amount: trinfo.amount,
              owner: trinfo.owner,
              tokenId: trinfo.tokenId,
              tokenAddress: trinfo.tokenAddress,
              metadata: trinfo.metadata,
              timestamp: trdata.block_timestamp,
              price: trdata.value,
          }
          }
      }
      const updatedata = JSON.stringify(allBeansData, null, 4);
      fs.writeFile('./beansnft/db.json', updatedata, (err) => {
       if (err) throw err;
   });
      let tnum = (parseInt(trinfo.tokenId) + 1) / 100
      if (tnum % 1 == 0) overallprogress = overallprogress + 1 / 3
      console.log(`Got Bean ${trinfo.tokenId} of ${Object.keys(beans).length}`);
      socket.emit('progress', '2', '3', 'Comparing Bean data with DB', tnum, overallprogress)
    } else {
      let tnum = (parseInt(trinfo.tokenId) + 1) / 100
      if (tnum % 1 == 0) {
        overallprogress = overallprogress + 1 / 3
        console.log(`Bean ${trinfo.tokenId} is stored in the db and has not changed, skipping. ${tnum}`);
        socket.emit('progress', '2', '3', 'Comparing Bean data with DB', tnum, overallprogress)
      }
    }
    }
    const data = JSON.stringify(allBeansData, null, 4);
      fs.writeFile('./beansnft/db.json', data, (err) => {
       if (err) throw err;
     });

      let getetherusd = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${cfg.etherscanAPIKEY}`, {
        method: 'GET',
      })
      let etherusdprice = await getetherusd.json()
      etherusdprice = etherusdprice.result.ethusd
      let csvdata = []
      let mydt = DateTime.now()
      mydt = `${mydt.year}-${mydt.month}-${mydt.day}_${mydt.hour}-${mydt.minute}-${mydt.second}`
      for (const getbean of Object.keys(allBeansData)) {
        const thebean = allBeansData[getbean]
        let dateacquired = DateTime.fromISO(thebean.timestamp).setZone('UTC')
        let datenow = DateTime.utc()
        let timeheld = Interval.fromDateTimes(dateacquired, datenow).toDuration(['days', 'hours', 'minutes', 'seconds']).toObject()
        let timeheldseconds = Interval.fromDateTimes(dateacquired, datenow).toDuration('seconds').toObject()
        let ethprice = thebean.price / 1000000000000000000
        let usdprice = (ethprice / 1) * etherusdprice

        csvdata.push({ "Bean (token) ID": thebean.tokenId, "Bean token address": thebean.tokenAddress, "Holder / Owner": thebean.owner, "Price purchased (ETH)": ethprice, "Approx. current USD value": `$${usdprice}`, "Date acquired (UTC / GMT+0)": dateacquired.toLocaleString(DateTime.DATETIME_MED), "Date acquired in unix seconds (UTC / GMT+0)": dateacquired.toFormat('X'), "Time held / owned": `${timeheld.days} days, ${timeheld.hours} hours, ${timeheld.minutes} minutes`, "Time held / owned in seconds": timeheldseconds.seconds })

        let tnum = (parseInt(thebean.tokenId) + 1) / 100
        if (tnum % 1 == 0) {
          overallprogress = overallprogress + 1 / 3
          socket.emit('progress', '3', '3', 'Compiling data into CSV', tnum, overallprogress)
        }
      }
      socket.emit('progress', '3', '3', 'Finishing up', 100, 100)
      const csv = new ObjectsToCsv(csvdata);
      await csv.toDisk(`./web/media/download/BeansNFT.${mydt}.csv`)
      console.log('Data Saved to CSV');
      socket.emit('finished', `https://wbmoderation.com/media/download/BeansNFT.${mydt}.csv`)
  });
});
app.get('/uptime', async function(req,res) {
  let up = bot.uptime / 1000
  let days = Math.floor(up / 86400);
  up %= 86400;
  let hours = Math.floor(up / 3600);
  up %= 3600;
  let minutes = Math.floor(up / 60);
  let seconds = Math.floor(up % 60);
  res.json({ days: days, hours: hours, minutes: minutes, seconds: seconds})
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
app.get('/computer', function(req,res) {
  res.sendFile(__dirname+'/web/computer.html');
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

  app.get('/beansnft/auth/discord', passport.authenticate('beansdiscord'));
  app.get('/beansnft/auth/discord/callback', passport.authenticate('beansdiscord', { failureRedirect: '/beansnft' }),
   function(req, res) {
      res.redirect('/beansnft') // Successful auth
  });
  app.get('/beansnft/auth/logout', function(req,res) {
    req.logout();
    res.redirect('/beansnft')
  });

  app.get('/dashboard/auth/discord', passport.authenticate('discorddashboard'));
  app.get('/dashboard/auth/discord/callback', passport.authenticate('discorddashboard', { failureRedirect: '/dashboard' }),
   function(req, res) {
     res.redirect(req.session.returnTo || '/');
     delete req.session.returnTo;
  });
  app.get('/dashboard/auth/logout', function(req,res) {
    req.logout();
    res.redirect('/dashboard')
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
    res.render(__dirname+'/web/complete.ejs', { discordpfp: discorduser ? discorduser.avatar ? `https://cdn.discordapp.com/avatars/${discorduser.id}/${discorduser.avatar}?size=2048` : `https://wbmoderation.com/media/defaultpfp.jpg` : null, steampfp: `${steamuser._json.avatarfull}`, discordname: `${discorduser.username}#${discorduser.discriminator}`, steamname: `${steamuser.displayName}` });
    let user = await bot.users.fetch(discorduser.id).catch(() => null);
    if (!user) {
      console.log(`${discorduser.username}#${discorduser.discriminator} was not found.`);
    } else if (user) {
      let linkembed = new MessageEmbed()
      .setTitle("Successfully Linked!")
      .setThumbnail('https://media.discordapp.net/attachments/933574813849632848/934606101847109652/worldboss_bot.jpg')
      .setDescription(`Your Steam (**${steamuser.displayName}**) & Discord (**${discorduser.username}#${discorduser.discriminator}**) account are now linked with **World Boss Moderation**\n\nTo unlink your accounts, use \`!unlink\`in <#932828142094123009> or use \`!link\` to check your linked account info.`)
      .setColor(themecolor)
  		.setFooter(`Developed by ${bot.users.cache.get(config.ownerID).tag}`, bot.users.cache.get(config.ownerID).displayAvatarURL({ dynamic: true }))
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

server.listen(config.port, () => console.log(`Web server listening at http://localhost:${config.port}`));


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
          let defaultcolor = guild && db.get(`color.${guild.id}`)
          let themecolor;
          if (!defaultcolor) {
            themecolor = `${config.themecolor}`;
          } else {
            themecolor = defaultcolor;
          }
					let unmuteembed = new MessageEmbed()
    				.setColor(themecolor)
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
  .setDescription('Calculator with clickable buttons.'),
  new SlashCommandBuilder()
  .setName('hangman')
  .setDescription('Play a game of hangman')
  .addUserOption(option => option.setName('player2').setDescription('Play with another user.'))
  .addStringOption(option => option.setName('gamemode').setDescription("Custom gamemodes (Doesn't affect your stats)").addChoice("Party", 'party').addChoice("CustomWord", 'custom'))
  .addStringOption(option => option.setName('devoptions').setDescription('Dev options, only usuable by Bot Owner.')),
  new ContextMenuCommandBuilder()
  .setName('Avatar')
	.setType(ApplicationCommandType.User),
  new ContextMenuCommandBuilder()
  .setName('Translate to English')
	.setType(ApplicationCommandType.Message),
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

bot.on('interactionCreate', interaction => {
  if (interaction.isCommand()) slashCommands(interaction, bot);
  if (interaction.isContextMenu()) contextCommands(interaction, bot);
})
bot.on('messageReactionAdd', (reaction, user) => reactionAddEvent(reaction, user, bot));
bot.on('messageReactionRemove', (reaction, user) => reactionRemoveEvent(reaction, user, bot));

bot.on('messageCreate', async message => {
  if (message.channel.type == "DM") return;

  let defaultcolor = message.guild && db.get(`color.${message.guild.id}`)
  let pref = message.guild && db.get(`prefix.${message.guild.id}`)
  let prefix;
  let themecolor;

  if (!pref) {
    prefix = `${config.prefix}`;
  } else {
    prefix = pref;
  }
  if (!defaultcolor) {
    themecolor = `${config.themecolor}`;
  } else {
    themecolor = defaultcolor;
  }
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
        .setColor(themecolor)
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
      .setColor(themecolor)
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
      .setColor(themecolor)
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
		.setColor(themecolor)
		if (!symbol) return message.channel.send({embeds: [nonedefined]})

		db.set(`prefix.${message.guild.id}`, symbol);
		message.channel.send(`The server prefix for **${message.guild.name}** has been updated to: \`${symbol}\``)
		return console.log(`The prefix for ${message.guild.name} was updated to: ${symbol}`);
	}

  if(commandName == "color" || commandName == "themecolor") {
		if (!message.member.permissions.has("MANAGE_GUILD") && message.author.id != config.ownerID) return;
		let data = db.get(`color.${message.guild.id}`);
		if (args[0] === "reset") {
			await db.delete(`color.${message.guild.id}`);
			return message.channel.send(`The bot theme color for **${message.guild.name}** has been reset!`);
		}
		let HEXcolor = args[0];
    let hexreg=/^#[0-9A-F]{6}$/i;
		let nonedefined = new MessageEmbed()
		.setTitle("Bot Theme Color")
		.setDescription(`The bot theme color for ${message.guild.name} is \`${themecolor}\`\nUse ${prefix}themecolor reset to reset the bot's theme color to default.`)
		.addField("Description:", "Change the bot's theme color", true)
		.addField("Usage:", `${prefix}themecolor [HEXcolor]\n${prefix}prefix reset`, true)
		.addField("Example:", `${prefix}themecolor #d90053`)
    .setThumbnail(`https://singlecolorimage.com/get/${themecolor.replace('#', '')}/256x256`)
		.setColor(themecolor)
		if (!HEXcolor) return message.channel.send({embeds: [nonedefined]})
    if (!hexreg.test(HEXcolor)) return message.channel.send({content: "Invalid HEX code.", embeds: [nonedefined]})

		db.set(`color.${message.guild.id}`, HEXcolor);
		return message.channel.send(`The bot theme color for **${message.guild.name}** has been updated to: \`${HEXcolor}\``)
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
		command.execute(bot, message, args, prefix, commandName, themecolor);
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
  let checkifembed = db.get(`embeds.${message.guild.id}.${message.id}`)
  if (checkifembed) {
    db.delete(`embeds.${message.guild.id}.${message.id}`)
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
