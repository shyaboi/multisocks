import io from 'socket.io-client';

const $events = document.getElementById('events');

const newItem = (content) => {
  const item = document.createElement('li');
  item.innerText = content;
  return item;
};

const socket = io();

socket.on('welcome', (hi) => {
    $events.appendChild(newItem(hi));
})



socket.on('hello', (hi) => {
    console.log(hi)
    $events.appendChild(newItem(hi));
  });
