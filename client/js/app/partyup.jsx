//SECTION - Components that build the web page

//React component for rendering error messages
const ToastMessageComponent = props => {
	return (
		<h2 id="error">{props.message}</h2>
	);
};

//React comonent for building the upgrade account nav
const UpgradeAccountNavComponent = props => {
	return (
		<div id="upgradeAccountNav">
			<img src="/assets/images/money-32.png" alt="Upgrade Account" onClick={handleUpgradeAccount} />
		</div>
	);
};

//React component for building the page title
const PageTitleComponent = props => {
	return (
		<h1 id="title">Party Up</h1>
	);
};

//React comonent for rendering the room name
const QueueRoomNameComponent = props => {
	return (
		<h3 id="roomName">{`Room name: ${room}`}</h3>
	);
};

//React component for creating the song title
const SongTitleComponent = props => {
	return (
		<h3>{props.songTitle}</h3>
	);
};

//React component for displaying an image of the currently playing song
const CurrPlayImageComponent = props => {
	return (
		<img id="currPlayImage" src={props.image} alt={props.imageTitle} />
	);
};

//React component for rendering the placeholder for videos
const VideoPlaceholderComponent = props => {
	return (
		<span id="ytVideo">
			<p>Click the button below to add a song!</p>
		</span>
	);
};

//React component for building the playing section
const CurrentlyPlayingComponent = props => {
	return (
		<div id="playingSection">
			<div id="ytTitle">
				<SongTitleComponent songTitle="Song Title Goes Here" />
			</div>
			<div id="controls">
				<img src="/assets/images/recurring-appointment-48.png" alt="restart" className="control" id="restart" onClick={handleRestartClick} />
				<span id="ytVideoArea">
					<VideoPlaceholderComponent />
				</span>
				<img src="/assets/images/arrow-30-48.png" alt="next" className="control" id="next" onClick={handleNextClick} />
			</div>
		</div>
	);
};

//React component for displaying the queue
const QueueComponent = props => {
	return (
		<div id="queue">
			<p>Your room's queue is displayed here</p>
		</div>
	);
};

//React component for displaying a single queue image
const QueueImageComponent = props => {
	return (
		<img className="queueImg" src={props.thumbnail} alt={props.vidTitle} title={props.vidTitle} />
	);
};

//React component for displaying the entire image queue
const QueueImagesComponent = props => {
	let items = [];
	
	queue.forEach(video => {
		items.push(<QueueImageComponent thumbnail={video.thumbnail} vidTitle={video.title} currPlayImg={video.currPlayImg} />);
	});
	
	return (
		<div id="queueImages">
			{items}
		</div>
	);
};

//React component for building the search button
const SearchButtonComponent = props => {
	return (
		<a className="button" onClick={createSearchVideoPage} href="#">Search For A Song</a>
	);
};

//React component for grouping all the components and rendering the entire page
const PartyUpComponent = props => {
	return (
		<div id="partyup">
			<UpgradeAccountNavComponent />
			<PageTitleComponent />
			<QueueRoomNameComponent />
			<CurrentlyPlayingComponent />
			<QueueComponent />
			<SearchButtonComponent />
		</div>
	);
}

//SECTION - Methods for calling the components and rendering the page

//renders the toast message
const createToastMessage = message => {
	ReactDOM.render(
		<ToastMessageComponent message={message} />,
		document.querySelector('#toast')
	);
};

//renders the app page
const createPartyUpPage = () => {
	ReactDOM.render(
		<PartyUpComponent />,
		document.querySelector('#mainContent')
	);
};

//renders the placeholder for the videos section
//done so that iFrames can be reloaded on new videos
const createVideoPlaceholder = (callback) => {
	document.querySelector('#ytVideoArea').innerHTML = '<span id="ytVideo"></span>';
	ReactDOM.render(
		<VideoPlaceholderComponent />,
		document.querySelector('#ytVideoArea'),
		callback
	);
};

//renders the queue
const createQueueImages = () => {
	ReactDOM.render(
		<QueueImagesComponent />,
		document.querySelector('#queue')
	);
};

//renders the song title of the page
const createSongTitle = songTitle => {
	ReactDOM.render (
		<SongTitleComponent songTitle={songTitle} />,
		document.querySelector('#ytTitle')
	);
};

//renders the currently playing image for the client page
const createCurrentlyPlayingImage = (image, imageTitle) => {
	ReactDOM.render(
		<CurrPlayImageComponent image={image} imageTitle={imageTitle} />,
		document.querySelector('#ytVideo')
	);
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
	}
};

//updates the client's currently playing section
const updateClientCurrPlay = (songTitle, image) => {
	createSongTitle(songTitle);
	createCurrentlyPlayingImage(image, songTitle);
};
