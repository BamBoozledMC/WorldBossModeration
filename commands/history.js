const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'history',
  descrption: 'gets punishment history',
  aliases: ['punishments', 'warns', 'offences', 'warnings', 'logs', 'modlogs'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
    if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
  let member;
  let memberID;
            if(args[0]) {
              let mention;
              if(message.mentions.members.first()) {
                if(message.mentions.members.first().user.id == bot.user.id) {
                  mention = [...message.mentions.members.values()][1];
                } else {
                  mention = message.mentions.members.first();
                }
              }

                if(!mention) {

                    if(isNaN(args[0])) member = bot.users.cache.find(u => u.tag == args[0]);
                    else member = bot.users.cache.get(args[0]);

                } else if(mention) {

                    if(!args[0].startsWith('<@') || !args[0].endsWith('>')) member = bot.users.cache.find(u => u.tag == args[0]);
                    else if(args[0].startsWith('<@') && args[0].endsWith('>')) {

                        mention = args[0].slice(2, -1)
                        if(mention.startsWith('!')) mention = mention.slice(1);

                        member = bot.users.cache.get(mention);

                    }  else return;
                }  else return;

            } else return;



            if (member) {
              memberID = member.id
              member = message.guild.members.cache.get(member.id);
            }
            if (!member) memberID = args[0];


    var varmember = member
    var dbgetuser = db.get(`moderation.punishments.${memberID}`)

    if(!dbgetuser) return message.reply("There are no recorded punishments for that user.");


    // var fieldsformat = []
    // var counter = 0
    // Object.keys(dbgetuser).forEach( function (key: 'value'){
    //   counter++
    //   let thecounter = `${counter}`
    //   console.log(varmember.id)
    //   let declarearray = dbgetuser[key: 'value']
    //   let date = declarearray.counter.date
    //   console.log(date)
    //   let reason = declarearray.counter.reason
    //   let punisher = declarearray.counter.punisher
    //   let type = declarearray.counter.type
    //
    //     var format = `{ name: '${counter}. ${type} | ${date}', value: 'Reason: ${reason}\\nIssued by: ${punisher}' },`;
    //   fieldsformat.push(format)
    // })
    // console.log(fieldsformat)
    // let fields = fieldsformat.join(" ")
    // console.log(fields)



    // .addFields(fields)

    let page = 1;
    if(args[1] && !isNaN(args[1])) page = args[1];
    while(dbgetuser.offenceno < 1 + (5 * (page - 1))) page--;

    let max = Math.floor(dbgetuser.offenceno / 5);
    if((dbgetuser.offenceno % 5) > 0) max++;

    let usertag;
    if(!member) {
      usertag = memberID
    } else {
      usertag = member.user.tag
    }


    let history = new Discord.MessageEmbed()
    .setTitle(`Offence history | ${usertag}`)
    .setDescription(`This user has **${dbgetuser.offenceno}** recorded punishments/offences.`)
    .setFooter(`Page ${page}/${max} - Use ${config.prefix}history (user) <page number> to view other pages`)
    .setColor(themecolor)

    for(i = 1; i <= 5; i++) {
      const offnum = i + (5 * (page - 1));
    const offence = db.get(`moderation.punishments.${memberID}.${offnum}`);

    if(offence) history.addField(`${offnum}. ${offence.type} | ${offence.date}`, `Reason: ${offence.reason}\nIssued by: ${offence.punisher}`);
}

    // for(i = 1; i <= dbgetuser.offenceno; i++) {
    //   let eee = '1'
    //   console.log(dbgetuser.eee.date)
    //   let date = db.get(`moderation.punishments.${member.id}.${i}`)
    //   let reason = dbgetuser.i.reason
    //   let punisher = dbgetuser.i.punisher
    //   let type = dbgetuser.i.type
    //   history.addField(`${i}. ${type} | ${date}`, `Reason: ${reason}\nIssued by: ${punisher}`);
    // }

		message.channel.send({embeds: [history]})

}
}
