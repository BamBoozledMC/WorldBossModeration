const config = require('../config.json');
const Discord = require ("discord.js");
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
	name: 'soundboard',
  descrption: 'Returns your message',
	aliases: ['sb', 'sfx'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
		if(!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(!message.member.roles.cache.some(role => role.id === '937561741334814810')) return message.lineReply(`This command is a supporter-only command. Check the \`${prefix}help\` command for more info.`);
		}
		sfxs = new Map();
		const sfxFiles = fs.readdirSync('./sfx/').filter(file => file.endsWith('.mp3'));
		for(const file of sfxFiles){
		    const sfx = `./sfx/${file}`
				let sfxname = file.replace(".mp3", "")
			sfxs.set(sfxname, sfx);
		}

		if(!args[0]) return invalid();
		thearg = args[0].toLowerCase()

		const thesfx = sfxs.get(thearg)
		if(!thesfx) return invalid();

			function invalid() {
			var allsfx = []
			sfxFiles.forEach((f, i) => {
				f = f.replace(".mp3", "")
				allsfx.push(`\`${f}\``)
			})
			allsfx = allsfx.join("\n")
			let invalidsfx = new Discord.MessageEmbed()
			.setTitle(`Invalid Sound!`)
			.setDescription(`The sound effect name you provided is **Invald** or does not **exist**\nUsage: ${prefix}soundboard sound_effect_name\nAliases: \`${prefix}sb | ${prefix}sfx\`\n**Available Sound Effects:**\n${allsfx}\n**Total: ${sfxs.size}**`)
			.setColor('#d90053')
			.setFooter("Developed by BamBoozled#0882")
			message.lineReply(invalidsfx)
		}

		if (message.guild.me.voice.channel) return message.channel.send("I am busy in another voice channel! Please try again soon.")

            if (message.member.voice.channel) {
                const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play(thesfx)
                message.channel.send(`🔊 Playing the **${thearg}** sound effect in your voice channel`)
                dispatcher.on('finish', () => {
                    message.guild.me.voice.channel.leave()
                  });

              } else {
                message.lineReplyNoMention('Join a voice channel and try again')
                .then(message => {
                message.delete({timeout:5000});
                });
							}

    }
}
