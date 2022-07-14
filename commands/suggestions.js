const Discord = require ("discord.js");
const config = require('../config.json');
const db = require('quick.db');

module.exports = {
	name: 'suggestions',
  descrption: 'gets punishment history',
//  aliases: [],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName, themecolor) {
    if(!message.member.permissions.has("MANAGE_MESSAGES") && message.author.id != config.ownerID) return;
	  let getsuggestions = db.get(`suggestions`)
		let displaytype = args[0]
		if (!displaytype) return message.reply(`Please provide the limit of days you wish to be displayed.\n**Available:** \`30_days\`, \`all_time\`\n**Usage:** \`${prefix}suggestions <30_days | all_time>\``);

		if (displaytype.toLowerCase() == "30days" || displaytype.toLowerCase() == "30_days") {
			let loading = await message.channel.send("<a:loading:939665977728176168> Collecting data...")
		var today = new Date();
		var priordate = new Date(new Date().setDate(today.getDate()-30));

    let top10suggestions = new Discord.MessageEmbed()
    .setTitle(`Top 10 suggestions`)
		.setDescription(`Showing result from last **30** days.\nThere are **${gettotalsuggestionsoffset(10)}** more suggestions not displayed in this table.\nThere is a __total__ of **${gettotalsuggestions()}** suggestions ever submitted.`)
    .setTimestamp()
    .setColor(themecolor)
		.setFooter(`Developed by ${bot.users.cache.get(config.ownerID).tag}`, bot.users.cache.get(config.ownerID).displayAvatarURL({ dynamic: true }))

		var last30days = [];
		Object.keys(getsuggestions).forEach( function (key){
			let suggestions = getsuggestions[key]
		let gettheID = suggestions.msgID
		let gettime = suggestions.time


		if (gettime > Math.round(priordate.getTime() / 1000)) {
			last30days.push(gettheID)
		}
});
var suggestionupvotes = [];
last30days.forEach(function (arrayItem) {
    let getsuggestion = db.get(`suggestions.${arrayItem}`)
		suggestionupvotes.push({ key: arrayItem, value: getsuggestion.upvotes })
});

var tosort = suggestionupvotes.reduce(
  (obj, item) => Object.assign(obj, { [item.key]: item.value }), {});


sortedupvotes = Object.assign(                      // collect all objects into a single obj
	...Object                                // spread the final array as parameters
	.entries(tosort)                     // key a list of key/ value pairs
	.sort(({ 1: a }, { 1: b }) => b - a) // sort DESC by index 1
	.slice(0, 10)                         // get first three items of array
	.map(([k, v]) => ({ [k]: v }))       // map an object with a destructured
);
let icounter = 1
for (const property in sortedupvotes) {
	let getinfo = db.get(`suggestions.${property}`)
	let suggestionchecked;
	if (getinfo.suggestion.length > 512) {
		suggestionchecked = getinfo.suggestion.substring(0, 512) + '...\nTo read more, Jump to the message.';
 	} else {
	 suggestionchecked = getinfo.suggestion
 	}
	top10suggestions.addField(`Top suggestion ${icounter}`, `**Submitter:** ${getinfo.submitter} - <@${getinfo.submitterID}>\n**Suggestion:** ${suggestionchecked}\n**Edited:** ${getinfo.edited ? "Yes" : "No"}\n**Submitted:** <t:${getinfo.time}:F>\n<:Upvote:934930260070371389> Upvotes: **${getinfo.upvotes}** - <:Downvote:934930252713586688> Downvotes: **${getinfo.downvotes}**\n[Jump to message](${getinfo.msgURL})`)
	icounter++
}

loading.edit({content: " ", embeds: [top10suggestions]})

} else if (displaytype.toLowerCase() == "alltime" || displaytype.toLowerCase() == "all_time") {
	let loading = await message.channel.send("<a:loading:939665977728176168> Collecting data...")

	let top10suggestions = new Discord.MessageEmbed()
	.setTitle(`Top 10 suggestions`)
	.setDescription(`Showing result from **all time**\nThere are **${gettotalsuggestionsoffset(10)}** more suggestions not displayed in this table.\nThere is a __total__ of **${gettotalsuggestions()}** suggestions ever submitted.`)
	.setTimestamp()
	.setColor(themecolor)
	.setFooter(`Developed by ${bot.users.cache.get(config.ownerID).tag}`, bot.users.cache.get(config.ownerID).displayAvatarURL({ dynamic: true }))

	var getallsuggestions = [];
	Object.keys(getsuggestions).forEach( function (key){
		let suggestions = getsuggestions[key]
		getallsuggestions.push(suggestions.msgID)
});
var suggestionupvotes = [];
getallsuggestions.forEach(function (arrayItem) {
	let getsuggestion = db.get(`suggestions.${arrayItem}`)
	suggestionupvotes.push({ key: arrayItem, value: getsuggestion.upvotes })
});

var tosort = suggestionupvotes.reduce(
(obj, item) => Object.assign(obj, { [item.key]: item.value }), {});

sortedupvotes = Object.assign(                      // collect all objects into a single obj
...Object                                // spread the final array as parameters
.entries(tosort)                     // key a list of key/ value pairs
.sort(({ 1: a }, { 1: b }) => b - a) // sort DESC by index 1
.slice(0, 10)                         // get first three items of array
.map(([k, v]) => ({ [k]: v }))       // map an object with a destructured
);
let icounter = 1
for (const property in sortedupvotes) {
let getinfo = db.get(`suggestions.${property}`)
let suggestionchecked;
if (getinfo.suggestion.length > 512) {
		suggestionchecked = getinfo.suggestion.substring(0, 512) + '...\nTo read more, Jump to the message.';
 } else {
	 suggestionchecked = getinfo.suggestion
 }
top10suggestions.addField(`Top suggestion ${icounter}`, `**Submitter:** ${getinfo.submitter} - <@${getinfo.submitterID}>\n**Suggestion:** ${suggestionchecked}\n**Edited:** ${getinfo.edited ? "Yes" : "No"}\n**Submitted:** <t:${getinfo.time}:F>\n<:Upvote:934930260070371389> Upvotes: **${getinfo.upvotes}** - <:Downvote:934930252713586688> Downvotes: **${getinfo.downvotes}**\n[Jump to message](${getinfo.msgURL})`)
icounter++
}

loading.edit({content: " ", embeds: [top10suggestions]})
} else {
	return message.reply(`Please provide the limit of days you wish to be displayed.\n**Available:** \`30_days\`, \`all_time\`\n**Usage:** \`${prefix}suggestions <30_days | all_time>\``);
}


function gettotalsuggestionsoffset(offsetnum) {
	let getsug = db.get(`suggestions`)

	var totalcounter = 1
	Object.keys(getsug).forEach( function () {
		totalcounter++
	});
	let numoffset = totalcounter - offsetnum
	return numoffset < 0 ? 0 : numoffset;
}
function gettotalsuggestions() {
	let getsug = db.get(`suggestions`)

	var totalcounter = 1
	Object.keys(getsug).forEach( function () {
		totalcounter++
	});
	return totalcounter;
}
}
}
