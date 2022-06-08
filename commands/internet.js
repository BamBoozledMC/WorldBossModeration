const Discord = require ("discord.js");
const config = require('../config.json');
const ping = require('ping');
const { FastAPI, SpeedUnits } = require('fast-api-speedtest');

module.exports = {
	name: 'internet',
	description: 'Checks the bot\'s internet',
	usage: '!internet',
	args: false,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		const pingMsg =  await message.channel.send('<a:loading:939665977728176168> Gathering data...');

		const FastTest = new FastAPI({
    measureUpload: true,
    downloadUnit: SpeedUnits.Mbps,
    timeout: 60000
});

FastTest.runTest().then(result => {
		let uploadMB = result.uploadSpeed / 8
		let downloadMB = result.downloadSpeed / 8

		let results = new Discord.MessageEmbed()
		.setTitle("Internet Stats")
		.setDescription(`Internet statistics of the bot.`)
		.addField("Info", `**ISP:** Telstra (Telecom Australia)\n**Located:** Queensland, Australia`)
		.addField(`Internet Speeds`, `**Ping:** ${result.ping}ms\n**Download:** ${result.downloadSpeed}${result.downloadUnit} (${downloadMB}MB/s)\n**Upload:** ${result.uploadSpeed}${result.uploadUnit} (${uploadMB}MB/s)`)
		.setColor(themecolor)
    .setTimestamp()

		pingMsg.delete()
		message.reply({embeds: [results]})
		}).catch(e => {
    	console.error(e.message);
			pingMsg.edit("Failed to retrieve data.")
		});

}
}
