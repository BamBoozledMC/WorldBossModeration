const Discord = require ("discord.js");
const db = require('quick.db');
const config = require('./config.json');
const ping = require('ping');
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en', simultaneousGames: true, requestExpireTime: 45, gameExpireTime: 45, })
const { DateTime } = require("luxon");
const fetch = require('node-fetch');


module.exports = async (interaction, bot) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.deferReply()
    let localping = await ping.promise.probe('127.0.0.1', {
           timeout: 5,
       });
		let isp_dns = await ping.promise.probe('1.1.1.1', {
	          timeout: 5,
	      });
			let pingembed = new Discord.MessageEmbed()
			.setTitle("Pong! 🏓")
			.addField("📤 API:", `**${bot.ws.ping}ms**`)
			.addField("<:server:948743195309768746> ISP/DNS:", `**${isp_dns.time}ms**`)
			.addField("🖥️ INTERNAL:", `**${localping.time}ms**`)
			.setColor("#d90053")
			.setTimestamp()
		return interaction.editReply({ embeds: [pingembed] });
	}

  if (interaction.commandName === 'hello') {
    interaction.reply({content: "Hello there!", ephemeral: true })
  }

  if (interaction.commandName === 'slowmode') {
    if (!interaction.member.permissions.has("MANAGE_MESSAGES") && interaction.user.id != config.ownerID) return interaction.reply({content: "You don't have access to this command.", ephemeral: true});
//if(message.author.id != config.ownerID) return;
    let time = interaction.options.getString('time');
    if(!time) {
        let dbget = db.get(`moderation.slowmode.${interaction.channel.id}`)

        if(!dbget) return;
        else {
            return interaction.reply({content: `The current slowmode is \`${dbget}\``, ephemeral: true});
        }
    }
        if(time.endsWith("s")) time = time.slice(0, -1);
        else if(time.endsWith("m")) time = time.slice(0, -1) * 60;
        else if(time.endsWith("h")) time = time.slice(0, -1) * 3600;

        if(isNaN(time) || time > 21600) return interaction.reply({ content: 'Please include a valid time!', ephemeral: true})
        await interaction.channel.setRateLimitPerUser(time).catch(error =>{
            console.log(error)
            return interaction.reply(error)
        })
            interaction.reply(`<:shieldtick:939667770184966186> Channel slowmode set to \`${time}\``)
                setTimeout(() => interaction.deleteReply().catch(error => {}), 5000);
            db.set(`moderation.slowmode.${interaction.channel.id}`, time)

  }

  if (interaction.commandName === 'tictactoe') {
    game.handleInteraction(interaction);
  }

  if (interaction.commandName === 'discorddate') {
    let timezone = interaction.options.getString('timezone');
    let day = interaction.options.getInteger('date');
    let month = interaction.options.getInteger('month');
    let year = interaction.options.getInteger('year');
    let hour = interaction.options.getInteger('time_hour');
    let minute = interaction.options.getInteger('time_minute');
    if (day <= 0 || day > 31) return interaction.reply({content: "Invalid Date (day)!\nMake sure to provide a number from 1 - 31 (e.g. 23)", ephemeral: true})
    if (year.toString().length != 4) return interaction.reply({content: "Invalid Year!\nMake sure to provide the year in 4 digit form (e.g. 2022)", ephemeral: true})
    if (minute < 0 || minute > 59) return interaction.reply({content: "Invalid Minute!\nMake sure to provide a number from 0 - 59 (e.g. 07)", ephemeral: true})
    let unixtime = DateTime.fromObject({year: year, month: month, day: day, hour: hour, minute: minute}, { zone: timezone }).toSeconds()
    console.log(unixtime);
    let discordunix = unixtime

    interaction.reply({content: `**Timezone compliant dates & times**\n\n<t:${discordunix}:F> **-** \`<t:${discordunix}:F>\`\n\n<t:${discordunix}:f> **-** \`<t:${discordunix}:f>\`\n\n<t:${discordunix}:D> **-** \`<t:${discordunix}:D>\`\n\n<t:${discordunix}:d> **-** \`<t:${discordunix}:d>\`\n\n<t:${discordunix}:t> **-** \`<t:${discordunix}:t>\`\n\n<t:${discordunix}:R> **-** \`<t:${discordunix}:R>\``})
  }

  if (interaction.commandName === 'say') {
    if(!interaction.member.permissions.has("MANAGE_MESSAGES") && interaction.user.id != config.ownerID) return;
    let msg = interaction.options.getString('message');
    if (msg.includes("@everyone")) return interaction.reply({content: "Your suggestion contains a blacklisted phrase/word", ephemeral: true});
    if (msg.includes("@here")) return interaction.reply({content: "Your suggestion contains a blacklisted phrase/word", ephemeral: true});

    await interaction.deferReply({ephemeral: true})
    await interaction.channel.send({content: `${msg}`})
    interaction.editReply({content: ":thumbsup:", ephemeral: true })
  }

  if (interaction.commandName === 'fortnitestats') {
    let platform = interaction.options.getString('platform');
    let username = interaction.options.getString('username');
    if (username.includes("@everyone")) return interaction.reply({content: "Username contains a blacklisted phrase/word", ephemeral: true});
    if (username.includes("@here")) return interaction.reply({content: "Username contains a blacklisted phrase/word", ephemeral: true});
    await interaction.deferReply()
    let pfformat;
    let pfend;
    if (platform == "xbox") {
      pfformat = "xbl("
      pfend = ")"
    } else if (platform == "psn") {
      pfformat = "psn("
      pfend = ")"
    } else {
      pfformat = ""
      pfend = ""
    }

    const getstats = await fetch(`https://api.fortnitetracker.com/v1/profile/${platform}/${pfformat}${username}${pfend}`, {
			method: 'GET',
			headers: {'TRN-Api-Key': config.TRNAPIKEY},
		})
    let stats = await getstats.json()
    let errorembed = new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle(":x: An error occurred")
    .setDescription(`${stats.error}`)
    let errorembed2 = new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle(":x: An error occurred")
    .setDescription(`${stats.message}`)
    if (stats.error) return interaction.editReply({embeds: [errorembed]});
    if (stats.message) return interaction.editReply({embeds: [errorembed2]});
    let playlist = {
      misc: "Creative",
      p2: "Solos",
      p10: "Duos",
      p9: "Squads",
      trios: "Trios",
      ltm: "LTMs",
    }
    let nums = {
      0: ":one:",
      1: ":two:",
      2: ":three:",
      3: ":four:",
      4: ":five:"
    }
    let usrname = stats.epicUserHandle
    usrname = usrname.replace(/ /g, '%20').replace(')', '%29')
    const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Select a stat to show')
					.addOptions([
						{
							label: 'Lifetime',
							description: 'Lifetime stats',
							value: 'lifetime',
						},
						{
							label: 'Solos',
							description: 'Solos stats',
							value: 'solos',
						},
            {
							label: 'Duos',
							description: 'Duos stats',
							value: 'duos',
						},
            {
							label: 'Trios',
							description: 'Trios stats',
							value: 'trios',
						},
            {
							label: 'Squads',
							description: 'Squads stats',
							value: 'squads',
						},
            {
							label: 'LTMs',
							description: 'LTMs stats',
							value: 'ltm',
						},
            {
							label: 'Recent Matches',
							description: 'Recent Matches tats',
							value: 'recent',
						},
					]),
			);
      const row2 = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('delmsg')
					.setLabel('Remove Message')
					.setStyle('DANGER'),
			);

      let statembed = new Discord.MessageEmbed()
      .setTitle("Fortnite Stats | Menu")
      .setDescription(`<:epicgames:965863563468107846> **User:** [${stats.epicUserHandle}](https://fortnitetracker.com/profile/all/${usrname})\n**Platform:** ${stats.platformNameLong}`)
      .setThumbnail(stats.avatar)
      .setColor("#d90053")
    let displaystats = await interaction.editReply({embeds: [statembed], components: [row, row2]})

    const filter = i => i.user.id === interaction.user.id;

		const collector = displaystats.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 300000 });
    const collector2 = displaystats.createMessageComponentCollector({ componentType: 'BUTTON', time: 300000 });

    collector2.on('collect', async i => {
      if(!i.member.permissions.has("MANAGE_MESSAGES") && i.user.id != interaction.user.id) return;
      if (i.customId == 'delmsg') {
        await interaction.deleteReply()
        await collector.stop()
        await collector2.stop()
      }
    })

    collector.on('collect', i => {
      if (i.user.id !== interaction.user.id) return i.reply({content: "You cannot interact with someone elses command.\nUse the **/fortnitestats** slash command to view someone's or your stats.", ephemeral: true})

    if (i.values.toString() == 'lifetime') {
      let lifetime = new Discord.MessageEmbed()
      .setTitle("Fortnite Stats | Lifetime")
      .setDescription(`<:epicgames:965863563468107846> **User:** [${stats.epicUserHandle}](https://fortnitetracker.com/profile/all/${usrname})\n**Platform:** ${stats.platformNameLong}`)
      .setThumbnail(stats.avatar)
      .setColor("#d90053")
      stats.lifeTimeStats.forEach((item) => {
        lifetime.addField(`${item.key}`, `${item.value}`)
      });

      i.update({embeds: [lifetime]})
    } else if (i.values.toString() == 'solos') {
      let s = stats.stats.p2
      let solo = new Discord.MessageEmbed()
      .setTitle("Fortnite Stats | Solos")
      .setDescription(`<:epicgames:965863563468107846> **User:** [${stats.epicUserHandle}](https://fortnitetracker.com/profile/all/${usrname})\n**Platform:** ${stats.platformNameLong}`)
      .setThumbnail(stats.avatar)
      .setColor("#d90053")
      .addField(s.top1.label, s.top1.displayValue, true)
      .addField(s.kills.label, s.kills.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.winRatio.label, s.winRatio.displayValue, true)
      .addField(s.kd.label, s.kd.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.top10.label, s.top10.displayValue, true)
      .addField(s.top25.label, s.top25.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.minutesPlayed.label, s.minutesPlayed.displayValue, true)
      .addField(s.avgTimePlayed.label, s.avgTimePlayed.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.kpg.label, s.kpg.displayValue, true)
      .addField(s.kpm.label, s.kpm.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.scorePerMatch.label, s.scorePerMatch.displayValue, true)
      .addField(s.scorePerMin.label, s.scorePerMin.displayValue, true)
      .addField(s.score.label, s.score.displayValue)
      .addField(`${s.matches.label} Played`, s.matches.displayValue)

      i.update({embeds: [solo]})
    } else if (i.values.toString() == 'duos') {
      let s = stats.stats.p10
      let duos = new Discord.MessageEmbed()
      .setTitle("Fortnite Stats | Duos")
      .setDescription(`<:epicgames:965863563468107846> **User:** [${stats.epicUserHandle}](https://fortnitetracker.com/profile/all/${usrname})\n**Platform:** ${stats.platformNameLong}`)
      .setThumbnail(stats.avatar)
      .setColor("#d90053")
      .addField(s.top1.label, s.top1.displayValue, true)
      .addField(s.kills.label, s.kills.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.winRatio.label, s.winRatio.displayValue, true)
      .addField(s.kd.label, s.kd.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.top5.label, s.top5.displayValue, true)
      .addField(s.top12.label, s.top12.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.minutesPlayed.label, s.minutesPlayed.displayValue, true)
      .addField(s.avgTimePlayed.label, s.avgTimePlayed.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.kpg.label, s.kpg.displayValue, true)
      .addField(s.kpm.label, s.kpm.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.scorePerMatch.label, s.scorePerMatch.displayValue, true)
      .addField(s.scorePerMin.label, s.scorePerMin.displayValue, true)
      .addField(s.score.label, s.score.displayValue)
      .addField(`${s.matches.label} Played`, s.matches.displayValue)

      i.update({embeds: [duos]})
    } else if (i.values.toString() == 'trios') {
      let s = stats.stats.trios
      let trios = new Discord.MessageEmbed()
      .setTitle("Fortnite Stats | Trios")
      .setDescription(`<:epicgames:965863563468107846> **User:** [${stats.epicUserHandle}](https://fortnitetracker.com/profile/all/${usrname})\n**Platform:** ${stats.platformNameLong}`)
      .setThumbnail(stats.avatar)
      .setColor("#d90053")
      .addField(s.top1.label, s.top1.displayValue, true)
      .addField(s.kills.label, s.kills.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.winRatio.label, s.winRatio.displayValue, true)
      .addField(s.kd.label, s.kd.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.top3.label, s.top3.displayValue, true)
      .addField(s.top6.label, s.top6.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.minutesPlayed.label, s.minutesPlayed.displayValue, true)
      .addField(s.avgTimePlayed.label, s.avgTimePlayed.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.kpg.label, s.kpg.displayValue, true)
      .addField(s.kpm.label, s.kpm.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.scorePerMatch.label, s.scorePerMatch.displayValue, true)
      .addField(s.scorePerMin.label, s.scorePerMin.displayValue, true)
      .addField(s.score.label, s.score.displayValue)
      .addField(`${s.matches.label} Played`, s.matches.displayValue)

      i.update({embeds: [trios]})
    } else if (i.values.toString() == 'squads') {
      let s = stats.stats.p9
      let squads = new Discord.MessageEmbed()
      .setTitle("Fortnite Stats | Squads")
      .setDescription(`<:epicgames:965863563468107846> **User:** [${stats.epicUserHandle}](https://fortnitetracker.com/profile/all/${usrname})\n**Platform:** ${stats.platformNameLong}`)
      .setThumbnail(stats.avatar)
      .setColor("#d90053")
      .addField(s.top1.label, s.top1.displayValue, true)
      .addField(s.kills.label, s.kills.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.winRatio.label, s.winRatio.displayValue, true)
      .addField(s.kd.label, s.kd.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.top3.label, s.top3.displayValue, true)
      .addField(s.top6.label, s.top6.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.minutesPlayed.label, s.minutesPlayed.displayValue, true)
      .addField(s.avgTimePlayed.label, s.avgTimePlayed.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.kpg.label, s.kpg.displayValue, true)
      .addField(s.kpm.label, s.kpm.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.scorePerMatch.label, s.scorePerMatch.displayValue, true)
      .addField(s.scorePerMin.label, s.scorePerMin.displayValue, true)
      .addField(s.score.label, s.score.displayValue)
      .addField(`${s.matches.label} Played`, s.matches.displayValue)

      i.update({embeds: [squads]})
    } else if (i.values.toString() == 'ltm') {
      let s = stats.stats.ltm
      let ltm = new Discord.MessageEmbed()
      .setTitle("Fortnite Stats | LTMs")
      .setDescription(`<:epicgames:965863563468107846> **User:** [${stats.epicUserHandle}](https://fortnitetracker.com/profile/all/${usrname})\n**Platform:** ${stats.platformNameLong}`)
      .setThumbnail(stats.avatar)
      .setColor("#d90053")
      .addField(s.top1.label, s.top1.displayValue, true)
      .addField(s.kills.label, s.kills.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.winRatio.label, s.winRatio.displayValue, true)
      .addField(s.kd.label, s.kd.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.minutesPlayed.label, s.minutesPlayed.displayValue, true)
      .addField(s.avgTimePlayed.label, s.avgTimePlayed.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.kpg.label, s.kpg.displayValue, true)
      .addField(s.kpm.label, s.kpm.displayValue, true)
      .addField('\u200b', '\u200b')
      .addField(s.scorePerMatch.label, s.scorePerMatch.displayValue, true)
      .addField(s.scorePerMin.label, s.scorePerMin.displayValue, true)
      .addField(s.score.label, s.score.displayValue)
      .addField(`${s.matches.label} Played`, s.matches.displayValue)

      i.update({embeds: [ltm]})
    } else if (i.values.toString() == 'recent') {
      let recent = new Discord.MessageEmbed()
      .setTitle("Fortnite Stats | Recent Matches")
      .setDescription(`<:epicgames:965863563468107846> **User:** [${stats.epicUserHandle}](https://fortnitetracker.com/profile/all/${usrname})\n**Platform:** ${stats.platformNameLong}`)
      .setThumbnail(stats.avatar)
      .setColor("#d90053")
      stats.recentMatches.forEach((item, i) => {
        if (i > 4) return;
        let compliantdate = DateTime.fromISO(item.dateCollected, { zone: 'UTC' }).toSeconds()
        compliantdate = Math.round(compliantdate)
        let gamewon;
        if (item.top1 == 0) {
          gamewon = "No"
        } else {
          gamewon = "Yes"
        }
        recent.addField(`${nums[i]} ${playlist[item.playlist]}`, `**Playlist:** ${playlist[item.playlist]}\n**Date Played:** <t:${compliantdate}:F>\n**Time Playing:** ${item.minutesPlayed} Minutes\n**Matches Played (consecutively):** ${item.matches}\n**Kills:** ${item.kills}\n**Match Won:** ${gamewon}`)
      });

      i.update({embeds: [recent]})
    }
});
  }
}
