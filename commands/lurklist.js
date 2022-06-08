const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'lurklist',
  descrption: 'gets punishment history',
  aliases: ['lurking', 'll', 'lurkers'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
    if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		let getlurkers = db.get(`lurking`)

    let lurklist = new Discord.MessageEmbed()
    .setTitle(`Lurk List`)
    .setTimestamp()
    .setColor(themecolor)

		var numofusers = 0
		Object.keys(getlurkers).forEach( function (key){
			let declarearray = getlurkers[key]
		let getreason = declarearray.reason
		let getID = declarearray.userID
		let getTag = bot.users.cache.get(getID);
		let started = declarearray.startedAT
		try {
		lurklist.addField(`${getTag.tag}`, `Lurking since: <t:${started}:F>\nReason: ${getreason}`)
	} catch(e){
		console.log(e);
			return message.channel.send("error, check console for info")
		}
    numofusers++
});
lurklist.setDescription(`There are **${numofusers}** lurkers`)

		message.channel.send({embeds: [lurklist]})

}
}
