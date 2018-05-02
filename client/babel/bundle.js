let queue = [];
let player;

//once the host is confirmed, add to users object
const hostConfirmation = data => {
	alert(`you are the host`);
};

//host method for sending the updated queue to each client
const sendQueueToClients = () => {
	socket.emit('sendQueueToClients', { queue });
};

//host method for sending the current song's image
const sendCurrentlyPlaying = () => {
	const currPlayImg = queue[0].currPlayImg;
	console.log(currPlayImg);
	const currPlayTitle = document.querySelector('#ytTitle').innerText;

	console.log('curr play update sent');

	socket.emit('sendCurrentlyPlaying', { currPlayImg, currPlayTitle });
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
		socket.emit('sendUserQueue', { socketId: data.socketId, queue, currPlayImg: queue[0].currPlayImg, title: queue[0].title });
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
	queue.push({ videoId, thumbnail, title, currPlayImg });
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
	if (e) {
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
			rel: 0
		},
		events: {
			onStateChange: onVideoEnd,
			onReady: onPlayerReady
		}
	});
};

//Plays the youtube video on the host's client
const playYouTubeVideo = () => {
	const videoId = queue[0].videoId;
	createSongTitle(queue[0].title);
	console.log(`Video Id: ${videoId}`);
	loadYoutubeVideo(videoId);
};
//SECTION - Components that build the web page

//React Component for rendering the login form on the home page
const RoomLoginComponent = props => {
	return React.createElement(
		"div",
		{ id: "login" },
		React.createElement(
			"h1",
			{ className: "title" },
			"Party Up"
		),
		React.createElement(
			"h2",
			{ id: "description" },
			"Create dynamic playlists with you and your friends!"
		),
		React.createElement(
			"h2",
			{ id: "formHeader" },
			"Create a room or enter an existing one"
		),
		React.createElement(
			"form",
			{ id: "roomLogin", name: "roomLogin", action: "/", onSubmit: joinRoom, method: "POST" },
			React.createElement(
				"label",
				{ htmlFor: "roomName" },
				"Room Name"
			),
			React.createElement("input", { id: "roomName", type: "text", name: "roomName", placeholder: "Room Name" }),
			React.createElement("input", { className: "submitForm", type: "submit", value: "Sign In" })
		)
	);
};

//SECTION - Methods for calling the components and rendering the page

//Renders the login form
const createRoomLogin = () => {
	ReactDOM.render(React.createElement(RoomLoginComponent, null), document.querySelector('#mainContent'));
};

//SECTION - Events and other App logic

//sets up events for the login page and renders the page
const setup = () => {
	createRoomLogin();
};
//SECTION - Components that build the web page

//React comonent for building the upgrade account nav
const UpgradeAccountNavComponent = props => {
	return React.createElement(
		"div",
		{ id: "upgradeAccountNav" },
		React.createElement("img", { src: "/assets/images/money-32.png", alt: "Upgrade Account", onClick: handleUpgradeAccount })
	);
};

//React component for building the page title
const PageTitleComponent = props => {
	return React.createElement(
		"h1",
		{ id: "title" },
		"Party Up"
	);
};

//React component for creating the song title
const SongTitleComponent = props => {
	return React.createElement(
		"h3",
		null,
		props.songTitle
	);
};

//React component for displaying an image of the currently playing song
const CurrPlayImageComponent = props => {
	return React.createElement("img", { id: "currPlayImage", src: props.image, alt: props.imageTitle });
};

//React component for rendering the placeholder for videos
const VideoPlaceholderComponent = props => {
	return React.createElement(
		"span",
		{ id: "ytVideo" },
		React.createElement(
			"p",
			null,
			"Click me to add a song!"
		)
	);
};

//React component for building the playing section
const CurrentlyPlayingComponent = props => {
	return React.createElement(
		"div",
		{ id: "playingSection" },
		React.createElement(
			"div",
			{ id: "ytTitle" },
			React.createElement(SongTitleComponent, { songTitle: "Song Title Goes Here" })
		),
		React.createElement(
			"div",
			{ id: "controls" },
			React.createElement("img", { src: "/assets/images/recurring-appointment-48.png", alt: "restart", className: "control", id: "restart", onClick: handleRestartClick }),
			React.createElement(
				"span",
				{ id: "ytVideoArea" },
				React.createElement(VideoPlaceholderComponent, null)
			),
			React.createElement("img", { src: "/assets/images/arrow-30-48.png", alt: "next", className: "control", id: "next", onClick: handleNextClick })
		)
	);
};

//React component for displaying the queue
const QueueComponent = props => {
	return React.createElement(
		"div",
		{ id: "queue" },
		React.createElement(
			"p",
			null,
			"Queue goes here"
		)
	);
};

//React component for displaying a single queue image
const QueueImageComponent = props => {
	return React.createElement("img", { className: "queueImg", src: props.thumbnail, alt: props.vidTitle, title: props.vidTitle });
};

//React component for displaying the entire image queue
const QueueImagesComponent = props => {
	let items = [];

	queue.forEach(video => {
		items.push(React.createElement(QueueImageComponent, { thumbnail: video.thumbnail, vidTitle: video.title, currPlayImg: video.currPlayImg }));
	});

	return React.createElement(
		"div",
		{ id: "queueImages" },
		items
	);
};

//React component for building the search button
const SearchButtonComponent = props => {
	return React.createElement(
		"a",
		{ className: "button", onClick: createSearchVideoPage, href: "#" },
		"Search For A Song"
	);
};

//React component for grouping all the components and rendering the entire page
const PartyUpComponent = props => {
	return React.createElement(
		"div",
		{ id: "partyup" },
		React.createElement(UpgradeAccountNavComponent, null),
		React.createElement(PageTitleComponent, null),
		React.createElement(CurrentlyPlayingComponent, null),
		React.createElement(QueueComponent, null),
		React.createElement(SearchButtonComponent, null)
	);
};

//SECTION - Methods for calling the components and rendering the page

//renders the app page
const createPartyUpPage = () => {
	ReactDOM.render(React.createElement(PartyUpComponent, null), document.querySelector('#mainContent'));
};

//renders the placeholder for the videos section
//done so that iFrames can be reloaded on new videos
const createVideoPlaceholder = callback => {
	console.log("placeholder fired");
	document.querySelector('#ytVideoArea').innerHTML = '<span id="ytVideo"></span>';
	ReactDOM.render(React.createElement(VideoPlaceholderComponent, null), document.querySelector('#ytVideoArea'), callback);
};

//renders the queue
const createQueueImages = () => {
	ReactDOM.render(React.createElement(QueueImagesComponent, null), document.querySelector('#queue'));
};

//renders the song title of the page
const createSongTitle = songTitle => {
	ReactDOM.render(React.createElement(SongTitleComponent, { songTitle: songTitle }), document.querySelector('#ytTitle'));
};

//renders the currently playing image for the client page
const createCurrentlyPlayingImage = (image, imageTitle) => {
	ReactDOM.render(React.createElement(CurrPlayImageComponent, { image: image, imageTitle: imageTitle }), document.querySelector('#ytVideo'));
};

//SECTION - Events and other App logic
//when the next button is clicked, play the next song in the queue
const handleNextClick = e => {
	if (queue.length > 1) {
		if (!isHost) {
			socket.emit('clientHitNext');
		} else {
			createVideoPlaceholder(playNextSongInQueue);
		}
	}
};

//when the restart button is clicked, restart the song
const handleRestartClick = e => {
	if (isHost) {
		if (player) {
			player.seekTo(0);
		}
	} else {
		socket.emit('clientHitRestart');
		console.log('hit restart');
	}
};

//updates the client's currently playing section
const updateClientCurrPlay = (songTitle, image) => {
	createSongTitle(songTitle);
	createCurrentlyPlayingImage(image, songTitle);
};
//attributes for each individual user
let user = '';
let room = '';
let isHost = false;
let socket;

//sets up all of the client websocket events
const joinRoom = e => {
	e.preventDefault();

	room = document.querySelector('#roomName').value;

	if (room === '') {
		alert('All fields required');
		return false;
	}

	socket = io.connect();

	socket.on('connect', () => {
		socket.emit('join', { room });
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
//SECTION - Components that build the web page

//SECTION - Methods for calling the components and rendering the page

//SECTION - Events and other App logic
//when the upgrade account button is clicked, render the summary of a paid service
const handleUpgradeAccount = e => {
	e.preventDefault();

	document.querySelector('#paidAccount').style.display = 'block';
};
//SECTION - Components that build the web page

//React component for building the search video form
const SearchVideoFormComponent = props => {
	return React.createElement(
		"div",
		{ id: "searchForVideo" },
		React.createElement(
			"span",
			{ className: "addVideo" },
			React.createElement(
				"h2",
				null,
				"Search for a Song"
			),
			React.createElement(
				"form",
				{ id: "videoSearch", name: "videoSearch", onSubmit: handleSongSearch },
				React.createElement(
					"label",
					{ htmlFor: "songName" },
					"Song Name: "
				),
				React.createElement("input", { name: "songName", id: "songName", type: "text", placeholder: "Enter a song name here" }),
				React.createElement("input", { id: "submitVideoSearch", type: "submit", value: "Search" })
			)
		),
		React.createElement("div", { id: "searchResults" })
	);
};

//React component for building the nav
const SearchVideoNavComponent = props => {
	return React.createElement(
		"nav",
		null,
		React.createElement(
			"a",
			{ className: "button", href: "#", onClick: handleNavHomeClick },
			"Home"
		)
	);
};

//React componenet for building an result list item
const ResultsListItemComponent = props => {
	return React.createElement(
		"li",
		{ className: "resultName", value: props.video.id.videoId, thumbnail: props.video.snippet.thumbnails.default.url, vidTitle: props.video.snippet.title, currPlayImg: props.video.snippet.thumbnails.high.url, onClick: addSongFromSearch },
		React.createElement("img", { src: props.video.snippet.thumbnails.medium.url, alt: props.video.snippet.title }),
		React.createElement(
			"div",
			{ className: "songResultTitle" },
			React.createElement(
				"p",
				null,
				props.video.snippet.title
			)
		)
	);
};

//React component for building the results list
const ResultsListComponent = props => {
	let videos = [];

	Object.keys(props.videos).forEach(video => {
		videos.push(React.createElement(ResultsListItemComponent, { video: props.videos[video] }));
	});

	return React.createElement(
		"div",
		null,
		React.createElement(
			"h1",
			null,
			"Song Results"
		),
		React.createElement(
			"ul",
			null,
			videos
		)
	);
};

//React component for bulding the search video page
const SearchVideoPageComponent = props => {
	return React.createElement(
		"div",
		null,
		React.createElement(SearchVideoNavComponent, null),
		React.createElement(SearchVideoFormComponent, null)
	);
};

//SECTION - Methods for calling the components and rendering the page
const createSearchVideoPage = e => {
	e.preventDefault();

	const searchPage = document.querySelector('#search');
	searchPage.style.display = 'block';

	ReactDOM.render(React.createElement(SearchVideoPageComponent, null), searchPage);
};

//SECTION - Events and other App logic
const handleNavHomeClick = e => {
	e.preventDefault();

	document.querySelector('#search').style.display = 'none';
	document.querySelector('#paidAccount').style.display = 'none';
};

//handles the JSON response from the YouTube API
const processResults = data => {
	console.dir(data.items);

	ReactDOM.render(React.createElement(ResultsListComponent, { videos: data.items }), document.querySelector('#searchResults'));
};

//method for taking user input and querieing YouTube
const handleSongSearch = e => {
	e.preventDefault();

	const searchTerm = document.querySelector('#songName').value;

	if (!searchTerm || searchTerm === '') {
		alert('Something needs to be searched!');
		return false;
	}

	buildYouTubeAPIRequest(encodeURI(searchTerm), processResults);
};

//method for adding a song to the queue
const addSongToQueue = (videoId, thumbnail, title, currPlayImg) => {
	console.log(videoId);

	if (!isHost) {
		socket.emit('clientSendVideoId', { videoId, thumbnail, title, currPlayImg });
	} else {
		addVideoToQueue(videoId, thumbnail, title, currPlayImg);
	}
};

//method for adding a song to the queue from a search
const addSongFromSearch = e => {
	let element = e.target;

	if (e.target.tagName === 'IMG' || e.target.tagName === 'P') {
		element = e.target.parentNode;
	}

	const videoId = element.getAttribute('value');
	const thumbnail = element.getAttribute('thumbnail');
	const title = element.getAttribute('vidTitle');
	const currPlayImg = element.getAttribute('currPlayImg');

	addSongToQueue(videoId, thumbnail, title, currPlayImg);
};
//Holds all our YouTube API related information
const API_KEY = '&key=AIzaSyB3Js93Zd4qIyvA-CY0ZBaRgt4ZQifUDMQ';
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&type=video';
let searchTerm = '&q=';

//helper method for sending out AJAX requests
const sendAjax = (type, action, data, success) => {
  fetch(action, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: type,
    body: data
  }).then(response => {
    return response.json();
  }).then(data => {
    if (data.error) {
      handleError(data.error);
      return;
    }
    success(data);
  });
};

//helper method for initiating an API request
const buildYouTubeAPIRequest = (search, success) => {
  const searchQuery = `${searchTerm}${search}`;
  const action = `${BASE_URL}${searchQuery}${API_KEY}`;

  sendAjax('GET', action, null, success);
};
