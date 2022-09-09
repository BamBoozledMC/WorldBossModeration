const Discord = require ("discord.js");
const db = require('quick.db');
const config = require('./config.json');
const ping = require('ping');
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en', simultaneousGames: true, requestExpireTime: 45, gameExpireTime: 45, })
const { DateTime } = require("luxon");
const fetch = require('node-fetch');
const languages = require("@cospired/i18n-iso-languages");
const translate = require('@vitalets/google-translate-api');


module.exports = async (interaction, bot) => {
  let defaultcolor = interaction.guild && db.get(`color.${interaction.guild.id}`)
  let themecolor;
  if (!defaultcolor) {
    themecolor = `${config.themecolor}`;
  } else {
    themecolor = defaultcolor;
  }

  if (interaction.commandName === 'Avatar') {
    await interaction.deferReply()
    let customavatar;
		if(interaction.targetUser.displayAvatarURL({ dynamic: true }) == interaction.targetMember.displayAvatarURL({ dynamic: true })) {
			customavatar = false
		} else {
			customavatar = true
		}
    let mentionedavatar = new Discord.MessageEmbed()
    .setTitle(`${interaction.targetMember.user.username}'s${customavatar ? " Server" : ""} Avatar`)
    .setDescription(`**Links:**\n[webp](${interaction.targetMember.displayAvatarURL({ dynamic: true, size: 4096, format: 'webp' })}) | [png](${interaction.targetMember.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}) | [jpg](${interaction.targetMember.displayAvatarURL({ dynamic: true, size: 4096, format: 'jpg' })})`)
    .setImage(`${interaction.targetMember.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}`)
    .setColor(themecolor)
    let mentionedavataruser = new Discord.MessageEmbed()
    .setTitle(`${interaction.targetUser.username}'s User Avatar`)
    .setDescription(`**Links:**\n[webp](${interaction.targetUser.displayAvatarURL({ dynamic: true, size: 4096, format: 'webp' })}) | [png](${interaction.targetUser.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}) | [jpg](${interaction.targetUser.displayAvatarURL({ dynamic: true, size: 4096, format: 'jpg' })})`)
    .setImage(`${interaction.targetUser.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}`)
    .setColor(themecolor)

     customavatar ? interaction.editReply({embeds: [mentionedavatar, mentionedavataruser]}) : interaction.editReply({embeds: [mentionedavatar]})
  }

  if (interaction.commandName === 'Translate to English') {
    await interaction.deferReply()
    try {
      let trans = await translate(interaction.targetMessage.content, {to: 'en'})
      let translated = new Discord.MessageEmbed()
      .setTitle("Translator")
      .setColor(themecolor)
      .setDescription(`Detected Language: **${languages.getName(trans.from.language.iso, "en")}**`)
      .addField("Translation", `\`\`\`${trans.text}\`\`\``)
      .setTimestamp()
      interaction.editReply({ embeds: [translated]})
    } catch (e) {
      interaction.editReply(":x: Something went wrong, please try again.")
    }

  }
}
