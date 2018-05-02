//SECTION - Components that build the web page

//React Component for rendering the login form on the home page
const RoomLoginComponent = props => {
	return (
		<div id="login">
			<h1 className="title">Party Up</h1>
			<h2 id="description">Create dynamic playlists with you and your friends!</h2>
			<h2 id="formHeader">Create a room or enter an existing one</h2>
			<div id="toast"></div>
			<form id="roomLogin" name="roomLogin" action="/" onSubmit={joinRoom} method="POST">
				<label htmlFor="roomName">*Room Name: </label>
				<input id="roomName" type="text" name="roomName" placeholder="Room Name" />
				<label htmlFor="password">Room Password: </label>
				<input id="password" type="text" name="password" placeholder="Room Password" />
				<input className="submitForm button" type="submit" value="Enter" />
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