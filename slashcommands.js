const Discord = require ("discord.js");
const db = require('quick.db');
const config = require('./config.json');
const ping = require('ping');


module.exports = async (interaction, bot) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
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
		return interaction.reply({ embeds: [pingembed] });
	}

  if (interaction.commandName === 'hello') {
    interaction.reply({content: "Hello there!", ephemeral: true })
  }
}
