//attributes for each individual user
let user = '';
let room = '';
let isHost = false;
let socket;

//sets up all of the client websocket events
const joinRoom = (e) => {
	e.preventDefault();
	
	room = document.querySelector('#roomName').value;
	
	if (room === '') {
		alert('All fields required');
		return false;
	}
	
	socket = io.connect();
	
	socket.on('connect', () => {
		socket.emit('join', {room});
		alert('joined room');
		createPartyUpPage();
	});
	
	//only fires if this socket is the host
  //initializes all of the host's websocket events
  socket.on('hostConfirmation', data => {
    isHost = true;
		console.log(isHost);
    hostConfirmation(data);
    //set up all our host methods
    hostEvents(socket);
  });
	
	//lets the user know who the host is
	socket.on('hostAcknowledge', data => {
		console.log('hi');
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
		console.log('update received');
		updateClientCurrPlay(data.currPlayTitle, data.currPlayImg);
	});
	
};

//Render the intial page
setup();