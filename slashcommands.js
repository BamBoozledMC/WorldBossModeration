const Discord = require ("discord.js");
const db = require('quick.db');
const config = require('./config.json');
const ping = require('ping');
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en', simultaneousGames: true, requestExpireTime: 45, gameExpireTime: 45, })


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
}
