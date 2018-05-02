//SECTION - Components that build the web page

//React component for building the page title
const PageTitleComponent = props => {
	return (
		<h1 id="title">Party Up</h1>
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
			<p>Click me to add a song!</p>
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
				<span className="control" id="restart" onClick={handleRestartClick}>Restart</span>
				<span id="ytVideoArea">
					<VideoPlaceholderComponent />
				</span>
				<span className="control" id="next" onClick={handleNextClick}>Next</span>
			</div>
		</div>
	);
};

//React component for displaying the queue
const QueueComponent = props => {
	return (
		<div id="queue">
			<p>Queue goes here</p>
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
		<button onClick={createSearchVideoPage}>Search For A Song</button>
	);
};

//React component for grouping all the components and rendering the entire page
const PartyUpComponent = props => {
	return (
		<div id="partyup">
			<PageTitleComponent />
			<CurrentlyPlayingComponent />
			<QueueComponent />
			<SearchButtonComponent />
		</div>
	);
}

//SECTION - Methods for calling the components and rendering the page

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
	console.log("placeholder fired");
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
	if (player && isHost) {
		player.seekTo(0);
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
