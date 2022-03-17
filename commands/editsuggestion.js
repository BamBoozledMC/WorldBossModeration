const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'editsuggestion',
  descrption: 'Returns your message',
	cooldown: 30,
  aliases: ["editlastsuggestion"],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if (message.author.bot) return;
		if(message.channel.id == config.generalID) return;
		if (message.guild.id != "929941845004415046") return
		if (message.content.includes("@everyone"))  return;
		if (message.content.includes("@here")) return;
		let msgtosend = args.join(" ")
		if (!msgtosend) {
			let errMSG = await message.lineReply('Please include the edited suggestion!').catch(error =>{
			})
			errMSG.delete({timeout:5000});
			message.delete({timeout:5000});
			return;
		}
		let loading = await message.channel.send("<a:loading:939665977728176168> Give me a sec...")
		let getsuggestions = db.get(`suggestions`)
		var allusersuggestions = [];
		for (const property in getsuggestions) {
			let getinfo = db.get(`suggestions.${property}`)

			if (getinfo.submitterID == message.author.id) {
				allusersuggestions.push({ key: getinfo.msgID, value: getinfo.time })
			}
		}

		var highesttime = Math.max.apply(Math,allusersuggestions.map(function(o){return o.value;}))
		var lastsuggestion = allusersuggestions.find(function(o){ return o.value == highesttime; })

		if(!lastsuggestion) return loading.edit("You have not submit any suggestions that I can edit.");

		let embed = new Discord.MessageEmbed()
		.setTimestamp()
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setDescription(msgtosend)
		.setColor("GREEN")
		.setTitle("New suggestion (EDITED):")
		.setFooter('To suggest something use !suggest')

		var editembed = await message.guild.channels.cache.get(config.suggestionID).messages.fetch(lastsuggestion.key).then(message => {
      message.edit(embed);
    }).catch(err => {
			loading.edit(":x: An error occurred.")
      console.error(err);
    });

				db.set(`suggestions.${lastsuggestion.key}.suggestion`, msgtosend )
				db.set(`suggestions.${lastsuggestion.key}.edited`, true )
				loading.edit("<a:completed:934404118754263050> Your suggestion has been edited!").then(message => {
					message.delete({timeout:5000})
				});

		message.delete().catch(error =>{
		})
    }
}
