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
    let hi = peopleOnCount+' online '+socket.id+' just joined the battle'
    socket.emit('welcome', hi);
    socket.broadcast.emit('hello', hi);
console.log(peopleOnID)
      socket.on('disconnect', () => {
    let bye= peopleOnCount+' online '+socket.id+' just left the battle'

          peopleOnCount--
      socket.broadcast.emit('hello', bye);      
    });
  });








httpServer.listen(3000, () => {
  console.log('go to http://localhost:3000');
});