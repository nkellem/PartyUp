let queue = [];
let player;

//once the host is confirmed, add to users object
const hostConfirmation = data => {
	isHost = true;
	createPartyUpPage();
};

//host method for sending the updated queue to each client
const sendQueueToClients = () => {
	socket.emit('sendQueueToClients', {queue});
};

//host method for sending the current song's image
const sendCurrentlyPlaying = () => {
	const currPlayImg = queue[0].currPlayImg;
	const currPlayTitle = document.querySelector('#ytTitle').innerText;
	
	socket.emit('sendCurrentlyPlaying', {currPlayImg, currPlayTitle});
};

//host method for checking if the user entered the correct password
const onCheckPassword = sock => {
	const socket = sock;
	
	socket.on('checkPassword', data => {
		if (data.userPass === password) {
			socket.emit('passwordMatches', {socketId: data.socketId});
		} else {
			socket.emit('disconnectUser', {socketId: data.socketId})
		}
	});
};

//host method for receiving queue song request from another user
const onClientSentVideoId = sock => {
	const socket = sock;
	socket.on('clientSentVideoId', data => {
		addVideoToQueue(data.videoId, data.thumbnail, data.title, data.currPlayImg);
	});
};

//host method for receiving client "next" requests
const onClientHitNext = sock => {
	const socket = sock;
	
	socket.on('clientHitNext', () => {
		handleNextClick();
	});
};

//host method for receiving client restart requests
const onClientHitRestart = sock => {
	const socket = sock;
	
	socket.on('clientHitRestart', () => {
		handleRestartClick();
	});
};

//host method for receiving request from the client to get initial queue info
const onUserJoined = sock => {
	const socket = sock;
	
	socket.on('userJoined', data => {
		if (queue.length > 0) {
			socket.emit('sendUserQueue', {socketId: data.socketId, queue, currPlayImg: queue[0].currPlayImg, title: queue[0].title});
		}
	});
};

//sets up all of the host's socket events
const hostEvents = sock => {
	const socket = sock;
	onClientSentVideoId(socket);
	onClientHitNext(socket);
	onClientHitRestart(socket);
	onUserJoined(socket);
	onCheckPassword(socket);
};

//adds a selected video to the queue
const addVideoToQueue = (videoId, thumbnail, title, currPlayImg) => {
	queue.push( {videoId, thumbnail, title, currPlayImg} );
	
	sendQueueToClients();
	createQueueImages();
	
	if (queue.length === 1) {
		playYouTubeVideo();
	};
};

//handles playing the next song in the queue
const playNextSongInQueue = () => {
	queue.splice(0, 1);
	sendQueueToClients();
	createQueueImages();
	playYouTubeVideo();
};

//handles what do when the video being played ends
const onVideoEnd = e => {
	if (e.data === 0 && queue.length > 1) {
		createVideoPlaceholder(playNextSongInQueue);
	}
};

//handles playing the video as it is loaded
const onPlayerReady = (e, player) => {
	sendCurrentlyPlaying();
	if(e) {
		e.target.playVideo();
	} else {
		player.playVideo();
	}
};

//Loading the YouTube iFrame API
const loadYoutubeVideo = videoId => {
	player = new YT.Player('ytVideo', {
    height: '360',
    width: '640',
    videoId,
		playerVars: {
			autoplay: 1,
			rel: 0,
		},
		events: {
			onStateChange: onVideoEnd,
			onReady: onPlayerReady,
		},
  });
};

//Plays the youtube video on the host's client
const playYouTubeVideo = () => {
	const videoId = queue[0].videoId;
	createSongTitle(queue[0].title);
	loadYoutubeVideo(videoId);
};