let queue = [];

//once the host is confirmed, add to users object
const hostConfirmation = data => {
	alert(`you are the host`);
};

//host method for receiving queue song request from another user
const onClientSentVideoId = sock => {
	const socket = sock;
	
	socket.on('clientSentVideoId', data => {
		console.log(data.videoId);
		addVideoToQueue(data.videoId);
	});
};

//
const hostEvents = sock => {
	const socket = sock;
	
	onClientSentVideoId(socket);
};

//
const addVideoToQueue = videoId => {
	queue.push(videoId);
	console.dir(queue);
	
	if (queue.length === 1) {
		playYouTubeVideo();
	};
};

//Loading the YouTube iFrame API
const loadYoutubeVideo = videoId => {
	const player = new YT.Player('ytVideo', {
    height: '360',
    width: '640',
    videoId
  });
};

//
const playYouTubeVideo = () => {
	const videoId = queue.splice(0, 1);
	console.log(`Video Id: ${videoId}`);
	loadYoutubeVideo(videoId);
};