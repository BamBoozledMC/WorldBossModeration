const net = require('net');

module.exports = {
   connect: function() {
     global.vlc = net.createConnection({ port: 9999 })
     console.log('connected to VLC');
     vlc.on('error', (data) => console.log(data))
     vlc.on('data', (data) => {
       console.log(data.toString());
     });
      return vlc;
   },
   add: function(url) {
     return vlc.write(`add ${url}\r\n`)
   },
   enqueue: function(url) {
     return vlc.write(`enqueue ${url}\r\n`)
   },
   stop: function() {
     return vlc.write(`stop\r\n`)
   },
   pause: function() {
     return vlc.write(`pause\r\n`)
   },
   next: function() {
     return vlc.write(`next\r\n`)
   },
   prev: function() {
     return vlc.write(`prev\r\n`)
   },
   playlist: function() {
     return vlc.write(`playlist\r\n`)
   },
}
