//attributes for each individual user
let user = '';
let room = '';
let isHost = false;
let hostName = '';

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
		socket.emit('join', {user, room});
		alert('joined room');
		createPartyUpPage();
	});
	
	//only fires if this socket is the host
  //initializes all of the host's websocket events
  socket.on('hostConfirmation', data => {
    isHost = true;
    hostConfirmation(data);
    //set up all our host methods
    hostEvents(socket);
  });
	
	socket.on('hostAcknowledge', data => {
		console.log('hi');
		alert(`${data.hostName} is the host`);
	});
};

//Render the intial page
setup();