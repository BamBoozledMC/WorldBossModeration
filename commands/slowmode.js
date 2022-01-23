const config = require('../config.json');
const Discord = require ("discord.js");
const db = require('quick.db');

module.exports = {
	name: 'slowmode',
    descrption: 'Chat slowmode',
    aliases: ["sm"],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix) {
        if (!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
		//if(message.author.id != config.ownerID) return;
        message.delete()
        let time = args[0]
        if(!time) {
            let dbget = db.get(`moderation.slowmode.${message.channel.id}`)
            
            if(!dbget) return;
            else {
                return message.channel.send(`The current slowmode is \`${dbget}\``);
            }
        }
            if(time.endsWith("s")) time = time.slice(0, -1);
            else if(time.endsWith("m")) time = time.slice(0, -1) * 60;
            else if(time.endsWith("h")) time = time.slice(0, -1) * 3600;

            if(isNaN(time) || time > 21600) return message.channel.send('Please include a valid time!')
            await message.channel.setRateLimitPerUser(time).catch(error =>{
                console.log(error)
            })
                message.channel.send(`<a:completed:934404118754263050> Channel slowmode set to \`${args[0]}\``).then(message => {
									message.delete({timeout:5000})
								});
                db.set(`moderation.slowmode.${message.channel.id}`, args[0])


    }
    }
