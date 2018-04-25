//SECTION - Components that build the web page

//React component for building the search video form
const SearchVideoFormComponent = props => {
	return (
		<div id="searchForVideo">
			<span className="addVideo">
				<h2>Search for a Song</h2>
				<form id="videoSearch" name="videoSearch" onSubmit={handleSongSearch}>
					<label htmlFor="songName">Song Name: </label>
					<input name="songName" id="songName" type="text" placeholder="Enter a song name here" />
					<input id="submitVideoSearch" type="submit" value="Search" />
				</form>
			</span>
			<span className="addVideo">
				<h2>Add a Song by Link</h2>
				<form id="videoAdd" name="videoAdd">
					<label htmlFor="songLink">Song Link: </label>
					<input name="songLink" id="songLink" type="text" placeholder="Enter a YouTube link" />
					<input id="submitVideoAdd" type="submit" value="Add" />
				</form>
			</span>
			<div id="searchResults">
			</div>
		</div>
	)
};

//React component for building the nav
const SearchVideoNavComponent = props => {
	return (
		<nav>
			<a href="#" onClick={handleNavHomeClick}>Home</a>
		</nav>
	);
};

//React componenet for building an result list item
const ResultsListItemComponent = props => {
	return (
		<li className="resultName" value={props.video.id.videoId} onClick={addSongFromSearch}>
			<img src={props.video.snippet.thumbnails.default.url} alt={props.video.snippet.title} />
			<p>{props.video.snippet.title}</p>
		</li>
	);
};

//React component for building the results list
const ResultsListComponent = props => {
	let videos = [];
	
	Object.keys(props.videos).forEach(video => {
		videos.push(<ResultsListItemComponent video={props.videos[video]} />);
	});
	
	return (
		<div>
			<h1>Song Results</h1>
			<ul>
				{videos}
			</ul>
		</div>
	);
};

//React component for bulding the search video page
const SearchVideoPageComponent = props => {
	return (
		<div>
			<SearchVideoNavComponent />
			<SearchVideoFormComponent />
		</div>
	);
};

//SECTION - Methods for calling the components and rendering the page
const createSearchVideoPage = e => {
	e.preventDefault();
	
	ReactDOM.render(
		<SearchVideoPageComponent />,
		document.querySelector('#mainContent')
	);
};

//SECTION - Events and other App logic
const handleNavHomeClick = e => {
	e.preventDefault();
	
	createPartyUpPage();
};

//handles the JSON response from the YouTube API
const processResults = data => {
	console.dir(data.items);
	
	ReactDOM.render(
		<ResultsListComponent videos={data.items} />,
		document.querySelector('#searchResults')
	);
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
		socket.emit('clientSendVideoId', {videoId});
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