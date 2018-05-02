//SECTION - Components that build the web page

//React Component for rendering the login form on the home page
const RoomLoginComponent = props => {
	return (
		<div>
			<h1>Party Up</h1>
			<h2>Create a room or enter an existing one!</h2>
			<form id="roomLogin" name="roomLogin" action="/" onSubmit={joinRoom} method="POST">
				<label htmlFor="roomName">Room Name</label>
				<input id="roomName" type="text" name="roomName" placeholder="Room Name" />
				<input className="submitForm" type="submit" value="Sign In" />
			</form>
		</div>
	);
};

//SECTION - Methods for calling the components and rendering the page

//Renders the login form
const createRoomLogin = () => {
	ReactDOM.render(
		<RoomLoginComponent />,
		document.querySelector('#mainContent')
	);
};

//SECTION - Events and other App logic

//sets up events for the login page and renders the page
const setup = () => {
	createRoomLogin();
};