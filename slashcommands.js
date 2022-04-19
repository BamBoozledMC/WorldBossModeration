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
    if(interaction.user.id != config.ownerID) return;
    let platform = interaction.options.getString('platform');
    let username = interaction.options.getString('username');
    if (username.includes("@everyone")) return interaction.reply({content: "Username contains a blacklisted phrase/word", ephemeral: true});
    if (username.includes("@here")) return interaction.reply({content: "Username contains a blacklisted phrase/word", ephemeral: true});
    await interaction.deferReply()

    const getstats = await fetch(`https://api.fortnitetracker.com/v1/profile/${platform}/${username}`, {
			method: 'GET',
			headers: {'TRN-Api-Key': config.TRNAPIKEY},
		})
    let stats = await getstats.json()
    console.log(stats);
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
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
					]),
			);

      let statembed = new Discord.MessageEmbed()
      .setTitle("Fortnite Stats | Menu")
      .setDescription(`<:epicgames:965863563468107846> **User:** ${stats.epicUserHandle}\n**Platform:** ${stats.platformNameLong}`)
      .setThumbnail(stats.avatar)
      .setColor("#d90053")
    let displaystats = await interaction.editReply({embeds: [statembed], components: [row]})

    const filter = i => i.user.id === interaction.user.id;

		const collector = displaystats.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 120000 });

    collector.on('collect', i => {
    if (i.values.toString() == 'lifetime') {
      let lifetime = new Discord.MessageEmbed()
      .setTitle("Fortnite Stats | Lifetime")
      .setDescription(`<:epicgames:965863563468107846> **User:** ${stats.epicUserHandle}\n**Platform:** ${stats.platformNameLong}`)
      .setThumbnail(stats.avatar)
      .setColor("#d90053")
      stats.lifeTimeStats.forEach((item) => {
        lifetime.addField(`${item.key}`, `${item.value}`)
      });

      interaction.editReply({embeds: [lifetime]})
      i.deferUpdate()
    } else if (i.values.toString() == 'second_option') {
      console.log("second");
      let second = new Discord.MessageEmbed()
      .setTitle("fn stats")
      .setDescription(`second`)
      .setColor("#d90053")
      interaction.editReply({embeds: [second]})
      i.deferUpdate()
    }
});
  }
}
