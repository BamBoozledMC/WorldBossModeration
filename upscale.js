const { spawn } = require('child_process');
const { rename, unlink } = require('fs')
const Discord = require ("discord.js");
const db = require('quick.db');
const config = require('./config.json');

module.exports = {
  upscale: function(message, executer, isInteraction, file, ext) {
    console.log('\x1b[36m%s\x1b[0m', `Upscaling image: FILE: ${file}`);
    const dumpy = spawn('cmd.exe', [`/c cd upscaler && ncnn.exe -i ./todo/${file}.${ext} -o ./upscaled/${file}.png -v`])
    let updating = false
    dumpy.stderr.on('data', (data) => {
      data = data.toString()
        console.log('\x1b[36m%s\x1b[0m', data);
        (async () => {
        if(data.includes("%")) {
          if(isInteraction) {
            let update = new Discord.MessageEmbed()
            .setTitle("Image Upscaler")
            .setColor(config.themecolor)
            .setDescription(`<a:loading:939665977728176168> Upscaling your image...`)
            .addField("Progress", `${data}`)
            .setFooter(`Generated by: ${executer}`)
            .setTimestamp()
            if (!updating) {
              updating = true
              await message.editReply({ embeds: [update] })
              setTimeout(() => updating = false, 1000);
            }
          } else if (!isInteraction) {
            let update = new Discord.MessageEmbed()
            .setTitle("Image Upscaler")
            .setColor(config.themecolor)
            .setDescription(`<a:loading:939665977728176168> Upscaling your image...`)
            .addField("Progress", `${data}`)
            .setFooter(`Generated by: ${executer}`)
            .setTimestamp()
            if (!updating) {
              updating = true
              await message.edit({ embeds: [update] })
              setTimeout(() => updating = false, 1000);
            }
          }
        }

        if(data.includes("done")) {
          let nextnum = db.get('upscale');
          let done = new Discord.MessageEmbed()
          .setTitle("Image Upscaler")
          .setColor(config.themecolor)
          .setDescription(`<a:completed:934404118754263050> Your Image has been upscaled 4x!\n[Click Here](https://wbmoderation.com/media/upscale/${file}.png) to download the image **or** if the image didn't load for you.`)
          .setImage(`https://wbmoderation.com/media/upscale/${file}.png`)
          .setFooter(`Generated by: ${executer}`)
          .setTimestamp()
          db.add('upscale', 1)
          if(isInteraction) {
            return await message.editReply({ embeds: [done] })
          } else if (!isInteraction) {
            return await message.edit({ embeds: [done] })
          }

        }
        if(data.includes("invalid")) return failed()
        if(data.includes("failed")) return failed()
      })();
    })
    function failed() {
      let error = new Discord.MessageEmbed()
      .setTitle(":x: Error")
      .setColor("RED")
      .setDescription("An error occurred whilst upscaling your image.\nTry again and make sure to provide a working link or upload an attachment.")
      if(isInteraction) {
        return message.editReply({ embeds: [error] })
      } else if (!isInteraction) {
        return message.edit({ embeds: [error] })
      }
    }
    dumpy.stdout.on('data', (data) => {
      console.log('\x1b[31m%s\x1b[0m', data.toString());
      if(data.includes("failed")) return failed()
    })
  }
}