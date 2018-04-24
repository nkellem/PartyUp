let queue = [];

//once the host is confirmed, add to users object
const hostConfirmation = data => {
	alert(`you are the host`);
};

//
const hostEvents = sock => {
	const socket = sock;
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
		null,
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

//sets up all of the client websocket events
const joinRoom = e => {
	e.preventDefault();

	user = document.querySelector('#username').value;
	room = document.querySelector('#roomName').value;

	if (user === '' || room === '') {
		alert('All fields required');
		return false;
	}

	const socket = io.connect();

	socket.on('connect', () => {
		socket.emit('join', { user, room });
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
