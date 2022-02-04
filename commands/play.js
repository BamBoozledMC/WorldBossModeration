const config = require('../config.json');
const Discord = require ("discord.js");
const ytdl = require('ytdl-core-discord');
const ytSearch = require('yt-search');
const db = require('quick.db');

const queue = new Map();

module.exports = {
	name: 'play',
  descrption: 'Returns your message',
	aliases: ['skip', 'stop', 'leave', 'p', 'volume', 'vol', 'v', 'pause', 'unpause', 'resume', 's', 'np', 'nowplaying', 'forceleave', 'fl', 'join', 'summon'],
	usage: '<message>',
	args: true,
	async execute(bot, message, args, prefix, commandName) {
		if(message.author.id != config.ownerID) return;
		const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
				const server_queue = queue.get(message.guild.id);

				if (commandName === 'play' || commandName === 'p'){
					if (!args.length) return message.channel.send("You need to give me something to play.")
					let song = {}

					if (ytdl.validateURL(args[0])) {
						const song_info = await ytdl.getInfo(args[0]).catch(error =>{
						})
						if(!song_info) return message.channel.send("This video is age-restricted and cannot be played.")
						song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url, duration: song_info.videoDetails.lengthSeconds, thumbnail: `https://i.ytimg.com/vi/${song_info.videoDetails.videoId}/hqdefault.jpg` }
					} else {
						const video_finder = async (query) =>{
                    const video_result = await ytSearch(query);
										return (video_result.videos.length > 1) ? video_result.videos[0] : null;
					}

					const video = await video_finder(args.join(' '));
					if (video){
          	song = { title: video.title, url: video.url, duration: video.seconds, thumbnail: video.thumbnail }
          } else {
            message.channel.send('Error finding video.');
          }
				}

				if (!server_queue){

					const queue_constructor = {
						voice_channel: voice_channel,
		        text_channel: message.channel,
		        connection: null,
		        songs: []
					}

					queue.set(message.guild.id, queue_constructor);
					queue_constructor.songs.push(song);

					try {
		          const connection = await voice_channel.join();
		          queue_constructor.connection = connection;
		          video_player(message.guild, queue_constructor.songs[0]);
		      } catch (err) {
		          queue.delete(message.guild.id);
		          message.channel.send('There was an error connecting!');
		          throw err;
		      }
				} else {
					server_queue.songs.push(song);
					return message.channel.send(`👍 **${song.title}** added to queue!`);
				}
    }

		else if(commandName === 'skip' || commandName === 's') skip_song(message, server_queue);
		else if(commandName === 'stop') stop_song(message, server_queue);
		else if(commandName === 'leave') stop_song(message, server_queue);
		else if(commandName === 'volume' || commandName === 'vol' || commandName === 'v') vol_song(message, args)
		else if(commandName === 'pause') pause_song(message, server_queue);
		else if(commandName === 'unpause' || commandName === 'resume') unpause_song(message, server_queue);
		else if(commandName === 'nowplaying' || commandName === 'np') nowplaying_song(message, server_queue);
		else if(commandName === 'forceleave' || commandName === 'fl') forceleave_song(message, server_queue);
		else if(commandName === 'join' || commandName === 'summon') join_song(message, server_queue);

}
}

var currentplaying;
var thesong;
const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id);

    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    if (!song) {
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
				db.delete(`song.${guild.id}.lastvolume`)
        return;
    }
		thesong = song
		let getvol = db.get(`song.${guild.id}.lastvolume`)
		if(!getvol) getvol = 0.5
    currentplaying = await song_queue.connection.play(await ytdl(song.url), { filter: 'audioonly', type: 'opus', seek: 0, quality: 'highestaudio', volume: getvol, highWaterMark: 1<<25})
    .on('finish', () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0]);
				console.log("urmom")
    })
		.on('error', (error) => {
			console.log(error);
			song_queue.text_channel.send('Could not play this song.')
			song_queue.songs.shift();
			video_player(guild, song_queue.songs[0]);
		})
		function secondsTohms(seconds) {
			seconds = Number(seconds);
			var h = Math.floor(seconds % (3600*24) / 3600);
			var m = Math.floor(seconds % 3600 / 60);
			var s = Math.floor(seconds % 60);

			if (m < 10) {m = "0"+m;}
			if (h   < 10) {h   = "0"+h;}
    	if (s < 10) {s = "0"+s;}
			return `${h}:${m}:${s}`;
		}
		let playembed = new Discord.MessageEmbed()
		.setTitle("🎶 Now Playing")
		.setDescription(`[${song.title}](${song.url})\n\n**Duration:** \`${secondsTohms(song.duration)}\``)
		.setThumbnail(song.thumbnail)
		.setColor('#d90053')
    await song_queue.text_channel.send(playembed)
}

const skip_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to execute this command!');
    if(!server_queue){
        return message.channel.send(`There are no songs in queue.`);
    }
		if (!message.guild.me.voice.channel) return console.log('trigger');
		async function endsong() {
			await server_queue.connection.dispatcher.destroy();
		}
		endsong()
}

const stop_song = (message, server_queue) => {
	if(!server_queue){
			return message.channel.send(`There are no songs playing.`);
	}
    if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to execute this command!');
    server_queue.songs = [];
		db.delete(`song.${message.guild.id}.lastvolume`)
		if(currentplaying == 'undefined' || currentplaying == null) {
			return message.channel.send("The connection is glitched, if the bot is still in the VC use `!forceleave`")
		} else if (!message.guild.me.voice.channel) {
			return;
		} else {
			server_queue.connection.dispatcher.end();
		}
}

const vol_song = (message, args) => {
	let voice_channel = message.member.voice.channel;
			if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
			if (isNaN(args[0])) return message.channel.send('Please provide a number from `1-200`')
			if (args[0] > 200) {
				volnum = 200
			} else if (args[0] < 1){
			 volnum = 1
		 } else volnum = args[0] / 100
		 currentplaying.setVolume(volnum)
		 db.set(`song.${message.guild.id}.lastvolume`, volnum)
		 message.channel.send(`:loud_sound: The volume has been set to **${args[0]}**`)
}

const pause_song = (message, server_queue) => {
	let voice_channel = message.member.voice.channel;
			if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
		 currentplaying.pause()
		 message.channel.send(`⏸️ The song has been paused.\nUse \`!unpause\` to resume the song.`)
}
const unpause_song = (message, server_queue) => {
	let voice_channel = message.member.voice.channel;
			if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
			currentplaying.pause(true)
		 	currentplaying.resume()
			currentplaying.resume()
		 message.channel.send(`▶️ The song has been unpaused.`)
}

const nowplaying_song = (message, server_queue) => {
	let voice_channel = message.member.voice.channel;
			if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
		function msToHMS( ms ) {
    // 1- Convert to seconds:
    let s = ms / 1000;
    // 2- Extract hours:
    var h = parseInt( s / 3600 ); // 3,600 seconds in 1 hour
    s = s % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    var m = parseInt( s / 60 ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    s = s % 60;
		if (m < 10) {m = "0"+m;}
		if (h   < 10) {h   = "0"+h;}
		s = Math.round(s)
		if (s < 10) {s = "0"+s;}
    console.log(`${h}:${m}:${s}`);
	}

		function secondsTohms(seconds) {
			seconds = Number(seconds);
			var h = Math.floor(seconds % (3600*24) / 3600);
			var m = Math.floor(seconds % 3600 / 60);
			var s = Math.floor(seconds % 60);

			if (m < 10) {m = "0"+m;}
			if (h   < 10) {h   = "0"+h;}
    	if (s < 10) {s = "0"+s;}
			//return `${h}:${m}:${s}`;
			console.log(`${h}:${m}:${s}`);
		}
msToHMS(currentplaying.streamTime)
secondsTohms(thesong.duration)
}

const forceleave_song = (message, server_queue) => {
	if(!server_queue){
			return message.channel.send(`There are no songs playing.`);
	}
    if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to execute this command!');
    server_queue.songs = [];
		db.delete(`song.${message.guild.id}.lastvolume`)
		if (!message.guild.me.voice.channel) return;
		song_queue.voice_channel.leave();
}

const join_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to execute this command!');
    message.member.voice.channel.join();
}
