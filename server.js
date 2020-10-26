const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
const PORT = process.env.PORT || 8888
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

  socket.on('typing', data => {
    const id = data.id
    // console.log(id);
    const xIsTyping = id
    socket.broadcast.emit('otherTyping', xIsTyping)
  });

  socket.on('message', data => {
    const msg = data
    console.log(msg);
    socket.broadcast.emit('msg', msg)
  });



    peopleOnID.push(socket.id)
    peopleOnCount++
    let hi = peopleOnCount
    let current = peopleOnID
    socket.broadcast.emit('welcome', socket.id );
    socket.emit('inroom', current);  
    socket.broadcast.emit('hello', hi);
    socket.broadcast.emit('inroom', current);  

// console.log(peopleOnID)
      socket.on('disconnect', () => {
          for( var i = 0; i < peopleOnID.length; i++){ if ( peopleOnID[i] === socket.id) { peopleOnID.splice(i, 1); i--; }}
          
          peopleOnCount--
          let bye= peopleOnCount+' online '+socket.id+' just left '
      socket.broadcast.emit('bye', socket.id);  
      socket.broadcast.emit('inroom', current);  
      socket.broadcast.emit('hello', hi);

// console.log(peopleOnID)

    });
  });








httpServer.listen(PORT, () => {
  console.log('go to http://localhost:'+PORT);
});