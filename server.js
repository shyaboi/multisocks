const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
const httpServer = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});
const io = require('socket.io')(httpServer);


let peopleOnCount = 0
const peopleOnID = []


io.on('connect', socket => {
    peopleOnID.push(socket.id)
    peopleOnCount++
    let hi = peopleOnCount+' current in the room'
    let current = "current people in the room" + [peopleOnID]
    socket.emit('welcome', );
    socket.broadcast.emit('hello', hi);
    socket.broadcast.emit('hello', current);
console.log(peopleOnID)
      socket.on('disconnect', () => {
          for( var i = 0; i < peopleOnID.length; i++){ if ( peopleOnID[i] === socket.id) { peopleOnID.splice(i, 1); i--; }}
          
          peopleOnCount--
          let bye= peopleOnCount+' online '+socket.id+' just left the battle, now there are only ' + peopleOnID
      socket.broadcast.emit('hello', bye);  
console.log(peopleOnID)

    });
  });








httpServer.listen(3000, () => {
  console.log('go to http://localhost:3000');
});