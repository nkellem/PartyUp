let queue = [];

//once the host is confirmed, add to users object
const hostConfirmation = data => {
	alert(`you are the host`);
};

//host method for receiving queue song request from another user
const onClientSentVideoId = sock => {
	const socket = sock;
	console.log('client sent video set up');
	socket.on('clientSentVideoId', data => {
		console.log('fired');
		console.log(data.videoId);
		addVideoToQueue(data.videoId, data.thumbnail);
	});
};

//sets up all of the host's socket events
const hostEvents = sock => {
	const socket = sock;
	console.log('Host events set up');
	onClientSentVideoId(socket);
};

//
const addVideoToQueue = (videoId, thumbnail) => {
	queue.push({videoId, thumbnail});
	console.dir(queue);
	
	if (queue.length === 1) {
		playYouTubeVideo();
	};
};

//handles what do when the video being played ends
const onVideoEnd = e => {
	if (e.data === 0) {
		console.log('event fired');
		queue.splice(0, 1);
		playYouTubeVideo();
	}
};

//Loading the YouTube iFrame API
const loadYoutubeVideo = videoId => {
	const playArea = document.querySelector('#ytVideo');
	
	if (playArea.tagName !== 'IFRAME') {
		const player = new YT.Player('ytVideo', {
  	  height: '360',
  	  width: '640',
  	  videoId,
			playerVars: {
				autoplay: 1,
				rel: 0,
			},
			events: {
				onStateChange: onVideoEnd,
			},
  	});
		
		return false;
	}
	
	playArea.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
	
	playArea.addEventListener('onStateChange', e => {
		onVideoEnd(e);
	});
};

//
const playYouTubeVideo = () => {
	const videoId = queue[0];
	console.log(`Video Id: ${videoId}`);
	loadYoutubeVideo(videoId);
};