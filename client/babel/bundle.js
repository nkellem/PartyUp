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

//Renders the login form
const createRoomLogin = () => {
	ReactDOM.render(React.createElement(RoomLoginComponent, null), document.querySelector('#mainContent'));
};

const setup = () => {
	createRoomLogin();
};
//attributes for each individual user
let user = '';
let room = '';

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
		socket.emit('join', { user });
		alert('joined room');
	});
};

//Render the intial page
setup();
