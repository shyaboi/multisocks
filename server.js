const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
const PORT = process.env.PORT || 8888
const httpServer = require('http').createServer((req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (['GET', 'POST'].indexOf(req.method) > -1) {
    res.writeHead(200, headers);
    res.end('Hello World');
    return;
  }

  res.writeHead(405, headers);
  res.end(`${req.method} is not allowed for the request.`);
 
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});
const io = require('socket.io')(httpServer);


let peopleOnCount = 0
const peopleOnID = []
let chatLog = []




io.on('connect', socket => {
  socket.emit('msg', chatLog)
  peopleOnCount++
  let id;
  let current = peopleOnID
  // let hi = peopleOnCount

    
    socket.on('idCheck', data => {
      for( var i = 0; i < peopleOnID.length; i++){ if ( peopleOnID[i] === socket.id) { peopleOnID.splice(i, 1); i--; }}

      id =  data
      console.log(data.uName)

      socket.id = id
      peopleOnID.push(id)
      current = peopleOnID
      socket.broadcast.emit('welcome', id );
      socket.emit('inroom', current);  
      socket.broadcast.emit('inroom', current);  
      // console.log(peopleOnID)
    });



  socket.on('typing', data => {
    const id = data.id
    // console.log(id);
    const xIsTyping = id
    socket.broadcast.emit('otherTyping', xIsTyping)
  });

  socket.on('message', data => {
    const msg = data
    // console.log(msg.id, msg.msg);
    chatLog.push(msg)
    // console.log(chatLog)
    socket.emit('message', chatLog)
    socket.broadcast.emit('msg', chatLog)
  });


      socket.on('disconnect', () => {
          for( var i = 0; i < peopleOnID.length; i++){ if ( peopleOnID[i] === socket.id) { peopleOnID.splice(i, 1); i--; }}
          
          peopleOnCount--
          let bye= peopleOnCount+' online '+socket.id+' just left '
      socket.broadcast.emit('bye', socket.id);  
      socket.broadcast.emit('inroom', current);  
      // socket.broadcast.emit('hello', hi);


// console.log(peopleOnID)

    });
  });








httpServer.listen(PORT, () => {
  console.log('go to http://localhost:'+PORT);
});