//React Component for rendering the login form on the home page
const RoomLoginComponent = props => {
	return (
		<div>
			<h1>Party Up</h1>
			<h2>Create a room or enter an existing one!</h2>
			<form id="roomLogin" name="roomLogin" action="/" onSubmit={joinRoom} method="POST">
				<label htmlFor="roomName">Room Name</label>
				<input id="roomName" type="text" name="roomName" placeholder="Room Name" />
				<label htmlFor="username">Username</label>
				<input id="username" type="text" name="username" placeholder="Username" />
				<input className="submitForm" type="submit" value="Sign In" />
			</form>
		</div>
	);
};

//Renders the login form
const createRoomLogin = () => {
	ReactDOM.render(
		<RoomLoginComponent />,
		document.querySelector('#mainContent')
	);
};

const setup = () => {
	createRoomLogin();
};