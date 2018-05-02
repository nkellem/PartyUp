//attributes for each individual user
let room = '';
let password = '';
let isHost = false;
let socket;

//sets up all of the client websocket events
const joinRoom = (e) => {
	e.preventDefault();
	
	room = document.querySelector('#roomName').value;
	password = document.querySelector('#password').value;
	
	if (room === '') {
		handleError('Room name is required');
		return false;
	}
	
	socket = io.connect();
	
	const data = {
		room,
	};
	
	if (password !== '') {
		data.password = password;
	}
	
	//sends initial join event on socket connect
	socket.on('connect', () => {
		socket.emit('join', data);
	});
	
	//informs the user if they don't have the right password
	socket.on('wrongPassword', data => {
		handleError(data.message);
	});
	
	//when the user joins, render the page
	socket.on('userJoined', () => {
		createPartyUpPage();
	});
	
	//only fires if this socket is the host
  //initializes all of the host's websocket events
  socket.on('hostConfirmation', data => {
    hostConfirmation(data);
    //set up all our host methods
    hostEvents(socket);
  });
	
	//renders the queue when the host sends
	socket.on('hostSentQueue', data => {
		queue = data.queue;
		createQueueImages();
		
		if (data.joined) {
			createSongTitle(data.title);
			createCurrentlyPlayingImage(data.currPlayImg, data.title);
		}
	});
	
	//updates the client's page with the currently playing info
	socket.on('sendCurrentlyPlaying', data => {
		updateClientCurrPlay(data.currPlayTitle, data.currPlayImg);
	});
	
};

//Render the intial page
setup();