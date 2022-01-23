const config = require('../config.json');
const Discord = require ("discord.js");
const beautify = require("beautify");
const db = require('quick.db');

module.exports = {
	name: 'eval',
    descrption: 'Evaluates my code',
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
    if (message.author.id != config.ownerID && message.author.id != "624665686978986020") return;
    if (!args[0]) return message.channel.send("You didn't give me anything to evaluate! :sob:")
    try {
        if (args.join(" ").toLowerCase().includes("token")) return;
        const toEval = args.join(" ");
        const evaluated = eval(toEval);

        let embed = new Discord.MessageEmbed()
        .setColor("#d90053")
        .setTimestamp()
        .setFooter(bot.user.username)
        .setTitle("Eval")
        .addField("Input:", `\`\`\`js\n${beautify(args.join(" "), { format: "js" })}\n\`\`\``)
        .addField("Output:", `\`\`\`${evaluated}\`\`\``)
        .addField("Type of:", typeof(evaluated))
        var Evalembed = await message.channel.send(embed)

        Evalembed.react('✅').then(() => Evalembed.react('❌'));

const filter = (reaction, user) => {
	return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
};

Evalembed.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
	.then(collected => {
		const reaction = collected.first();

		if (reaction.emoji.name === '✅') {
            message.delete().catch(error =>{
            })
			Evalembed.delete();
		} else {
			Evalembed.reactions.removeAll()
		}
	})
	.catch(collected => {
        Evalembed.reactions.removeAll()
    });

        /* const emoji = await message.react("✅").then(() => message.react("❌"))
            console.log(emoji)
            // if the emoji is a tick:
            if (emoji === "✅") {
            // delete their message
            console.log("tick")
            if (message.deletable == true) {
            console.log("can delete")
            console.log("attempting to delete")
            message.delete()
            }
            if (!message.deletable == false) {
            "cannot delete"
            }
            } else if (emoji === "❌") { // if the emoji is a cross
                message.reactions.removeAll()
            return;
            } */



    } catch (e) {
        let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("ERROR!")
        .setDescription(`\`\`\`${e}\`\`\``)
        .setFooter(bot.user.username)
        var Errorembed = await message.channel.send(embed)

        Errorembed.react('✅').then(() => Errorembed.react('❌'));

const filter = (reaction, user) => {
	return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
};

Errorembed.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
	.then(collected => {
		const reaction = collected.first();

		if (reaction.emoji.name === '✅') {
            message.delete().catch(error =>{
            })
			Errorembed.delete();
		} else {
			Errorembed.reactions.removeAll()
		}
	})
	.catch(collected => {
        Errorembed.reactions.removeAll()
    });
    }
    }
}
