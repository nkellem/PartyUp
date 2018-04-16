//attributes for each individual user
let user = '';
let room = '';

//sets up all of the client websocket events
const joinRoom = (e) => {
	e.preventDefault();
	
	user = document.querySelector('#username').value;
	room = document.querySelector('#roomName').value;
	
	if (user === '' || room === '') {
		alert('All fields required');
		return false;
	}
	
	const socket = io.connect();
	
	socket.on('connect', () => {
		socket.emit('join', {user});
		alert('joined room');
	});
};

//Render the intial page
setup();