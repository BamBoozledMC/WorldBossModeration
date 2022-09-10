const config = require('../config.json');
const Discord = require ("discord.js");
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} = require('@discordjs/voice');
const fetch = require('node-fetch');
const fs = require('fs');
const db = require('quick.db');

module.exports = {
	name: 'soundboard',
  descrption: 'Returns your message',
	aliases: ['sb', 'sfx'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
		if (db.get(`commands.${message.guild.id}.${commandName}.disabled`)) return message.reply("⛔ This command has been disabled in this server.").then(message => {setTimeout(() => message.delete().catch(error => {}), 10000);});
		if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) {
			if(!message.member.roles.cache.some(role => role.id === '945509781593002067')) return message.reply(`You require the **Conqueror** rank to use this command!\nCheck your current rank by using \`?rank\` in <#932828142094123009>.`);
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
			.setColor(themecolor)
			.setFooter(`Developed by ${bot.users.cache.get(config.ownerID).tag}`, bot.users.cache.get(config.ownerID).displayAvatarURL({ dynamic: true }))
			message.reply({embeds: [invalidsfx]})
		}

		if (message.guild.me.voice.channel) return message.channel.send("I am busy in another voice channel! Please try again soon.")

            if (message.member.voice.channel) {
				const resource = createAudioResource(thesfx);
				const player = createAudioPlayer();
                const connection = joinVoiceChannel({
					channelId: message.member.voice.channel.id,
					guildId: message.guild.id,
					adapterCreator: message.guild.voiceAdapterCreator
				});
            	await connection.subscribe(player)
				player.play(resource)
                message.channel.send(`🔊 Playing the **${thearg}** sound effect in your voice channel`)
                player.on(AudioPlayerStatus.Idle, () => {
                    connection.destroy()
                  });

              } else {
                message.reply({content: 'Join a voice channel and try again', allowedMentions: { repliedUser: false }})
                .then(message => {
					setTimeout(() => message.delete().catch(error => {}), 5000);
                });
							}

    }
}
