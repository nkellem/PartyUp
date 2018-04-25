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
//SECTION - Components that build the web page

//React Component for rendering the login form on the home page
const RoomLoginComponent = props => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"h1",
			null,
			"Party Up"
		),
		React.createElement(
			"h2",
			null,
			"Create a room or enter an existing one!"
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
			React.createElement(
				"label",
				{ htmlFor: "username" },
				"Username"
			),
			React.createElement("input", { id: "username", type: "text", name: "username", placeholder: "Username" }),
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

//React component for building the page title
const PageTitleComponent = props => {
	return React.createElement(
		"h1",
		{ id: "title" },
		"Party Up"
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
			React.createElement(
				"h3",
				null,
				"Song Title Goes Here"
			)
		),
		React.createElement(
			"div",
			{ id: "controls" },
			React.createElement(
				"span",
				{ className: "control", id: "previous" },
				"Prev"
			),
			React.createElement(
				"span",
				{ id: "ytVideo" },
				React.createElement(
					"p",
					null,
					"Click me to add a song!"
				)
			),
			React.createElement(
				"span",
				{ className: "control", id: "next" },
				"Next"
			)
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

//React component for building the search button
const SearchButtonComponent = props => {
	return React.createElement(
		"button",
		{ onClick: createSearchVideoPage },
		"Search For A Song"
	);
};

//React component for grouping all the components and rendering the entire page
const PartyUpComponent = props => {
	return React.createElement(
		"div",
		{ id: "partyup" },
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

//SECTION - Events and other App logic
//attributes for each individual user
let user = '';
let room = '';
let isHost = false;
let hostName = '';
let socket;

//sets up all of the client websocket events
const joinRoom = e => {
	e.preventDefault();

	user = document.querySelector('#username').value;
	room = document.querySelector('#roomName').value;

	if (user === '' || room === '') {
		alert('All fields required');
		return false;
	}

	socket = io.connect();

	socket.on('connect', () => {
		socket.emit('join', { user, room });
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

	socket.on('hostAcknowledge', data => {
		console.log('hi');
		alert(`${data.hostName} is the host`);
	});
};

//Render the intial page
setup();
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
		React.createElement(
			"span",
			{ className: "addVideo" },
			React.createElement(
				"h2",
				null,
				"Add a Song by Link"
			),
			React.createElement(
				"form",
				{ id: "videoAdd", name: "videoAdd" },
				React.createElement(
					"label",
					{ htmlFor: "songLink" },
					"Song Link: "
				),
				React.createElement("input", { name: "songLink", id: "songLink", type: "text", placeholder: "Enter a YouTube link" }),
				React.createElement("input", { id: "submitVideoAdd", type: "submit", value: "Add" })
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
			{ href: "#", onClick: handleNavHomeClick },
			"Home"
		)
	);
};

//React componenet for building an result list item
const ResultsListItemComponent = props => {
	return React.createElement(
		"li",
		{ className: "resultName", value: props.video.id.videoId, onClick: addSongFromSearch },
		React.createElement("img", { src: props.video.snippet.thumbnails.default.url, alt: props.video.snippet.title }),
		React.createElement(
			"p",
			null,
			props.video.snippet.title
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

	ReactDOM.render(React.createElement(SearchVideoPageComponent, null), document.querySelector('#mainContent'));
};

//SECTION - Events and other App logic
const handleNavHomeClick = e => {
	e.preventDefault();

	createPartyUpPage();
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
const addSongToQueue = videoId => {
	console.log(videoId);

	if (!isHost) {
		socket.emit('clientSendVideoId', { videoId });
	} else {
		addVideoToQueue(videoId);
	}
};

//method for adding a song to the queue from a search
const addSongFromSearch = e => {
	let element = e.target;

	if (e.target.tagName === 'IMG' || e.target.tagName === 'P') {
		element = e.target.parentNode;
	}

	videoId = element.getAttribute('value');

	addSongToQueue(videoId);
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
