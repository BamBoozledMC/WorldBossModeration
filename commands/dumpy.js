const config = require('../config.json');
const db = require('quick.db');
const fs = require('fs');
const Discord = require ("discord.js");
const dumpy = require('../dumpy.js');
const https = require('https')
const { URL, parse } = require('url');
const stringIsAValidUrl = (s, protocols) => {
    try {
        new URL(s);
        const parsed = parse(s);
        return protocols
            ? parsed.protocol
                ? protocols.map(x => `${x.toLowerCase()}:`).includes(parsed.protocol)
                : false
            : true;
    } catch (err) {
        return false;
    }
};
function fileExt(url) {
  return url.split(/[?#]/)[0].split('.').pop().trim();
}

module.exports = {
	name: 'dumpy',
  descrption: '',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
    if (db.get(`commands.${message.guild.id}.${commandName}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		if (message.author.bot) return;
		size = args[0]
		if(isNaN(size) || size > 100) return message.channel.send('Please include a valid size (1 - 100)\n**Format:** `!dumpy <size> [file]`')
		if(size.includes(".")) return message.channel.send('Please include a valid size (1 - 100)\n**Format:** `!dumpy <size> [file]`')
		let nofile = new Discord.MessageEmbed()
		.setTitle(":x: Error")
		.setColor("RED")
		.setDescription("No file specified!\nMake sure to provide a link or upload an attachment.")
		let invalidfile = new Discord.MessageEmbed()
		.setTitle(":x: Error")
		.setColor("RED")
		.setDescription("Invalid file!\nMake sure to provide a working link or upload an attachment.\n*Note: Multiple links **will not** work.*")
		let file;
		if(!args[1] && !message.attachments.first()) return message.channel.send({ embeds: [nofile]});
		if(args[1]) {
			file = args[1]
		} else if (message.attachments.first()) {
			file = message.attachments.first().attachment
		}
		if(!stringIsAValidUrl(file, ['http', 'https'])) return message.channel.send({ embeds: [invalidfile]});
		let ext = fileExt(file)
		let filename = db.get('dumpy')
		let executer = message.author.tag
		let downloading = new Discord.MessageEmbed()
		.setTitle("Dumpy Generator")
		.setColor(themecolor)
		.setDescription(`<a:loading:939665977728176168> Downloading your file...`)
		.setFooter(`Generated by: ${executer}`)
		.setTimestamp()
		let generating = new Discord.MessageEmbed()
		.setTitle("Dumpy Generator")
		.setColor(themecolor)
		.setDescription(`<a:loading:939665977728176168> Generating your dumpy...`)
		.setFooter(`Generated by: ${executer}`)
		.setTimestamp()
		let dumpymsg = await message.reply({ embeds: [downloading] })
			https.get(file, resp => {
				resp.pipe(fs.createWriteStream(`./dumpys/todo/${filename}.${ext}`));
				resp.on('end', async () => {
					await dumpymsg.edit({ embeds: [generating] })
					dumpy.createdumpy(dumpymsg, executer, false, `./dumpys/todo/${filename}.${ext}`, size)
				})
			})



    }
}
