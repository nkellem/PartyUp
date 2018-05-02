let queue = [];
let player;

//once the host is confirmed, add to users object
const hostConfirmation = data => {
	alert(`you are the host`);
};

//host method for sending the updated queue to each client
const sendQueueToClients = () => {
	socket.emit('sendQueueToClients', {queue});
};

//host method for sending the current song's image
const sendCurrentlyPlaying = () => {
	const currPlayImg = queue[0].currPlayImg;
	console.log(currPlayImg);
	const currPlayTitle = document.querySelector('#ytTitle').innerText;
	
	console.log('curr play update sent');
	
	socket.emit('sendCurrentlyPlaying', {currPlayImg, currPlayTitle});
};

//host method for receiving queue song request from another user
const onClientSentVideoId = sock => {
	const socket = sock;
	console.log('client sent video set up');
	socket.on('clientSentVideoId', data => {
		console.log('fired');
		console.log(data.videoId);
		addVideoToQueue(data.videoId, data.thumbnail, data.title, data.currPlayImg);
	});
};

//host method for receiving client "next" requests
const onClientHitNext = sock => {
	const socket = sock;
	
	socket.on('clientHitNext', () => {
		console.log('client hit next');
		handleNextClick();
	});
};

//host method for receiving client restart requests
const onClientHitRestart = sock => {
	const socket = sock;
	
	socket.on('clientHitRestart', () => {
		console.log('client hit restart');
		handleRestartClick();
	});
};

//host method for receiving request from the client to get initial queue info
const onUserJoined = sock => {
	const socket = sock;
	
	socket.on('userJoined', data => {
		console.log('user joined');
		socket.emit('sendUserQueue', {socketId: data.socketId, queue, currPlayImg: queue[0].currPlayImg, title: queue[0].title});
	});
};

//sets up all of the host's socket events
const hostEvents = sock => {
	const socket = sock;
	console.log('Host events set up');
	onClientSentVideoId(socket);
	onClientHitNext(socket);
	onClientHitRestart(socket);
	onUserJoined(socket);
};

//adds a selected video to the queue
const addVideoToQueue = (videoId, thumbnail, title, currPlayImg) => {
	queue.push( {videoId, thumbnail, title, currPlayImg} );
	console.dir(queue);
	
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
		console.log('event fired');
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
	console.log(`Video Id: ${videoId}`);
	loadYoutubeVideo(videoId);
};