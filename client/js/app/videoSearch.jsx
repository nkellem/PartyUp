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
					<input className="button" id="submitVideoSearch" type="submit" value="Search" />
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
			<a className="button" href="#" onClick={handleNavHomeClick}>Home</a>
		</nav>
	);
};

//React componenet for building an result list item
const ResultsListItemComponent = props => {
	return (
		<li className="resultName" value={props.video.id.videoId} thumbnail={props.video.snippet.thumbnails.default.url} vidTitle={props.video.snippet.title} currPlayImg={props.video.snippet.thumbnails.high.url} onClick={addSongFromSearch}>
			<img src={props.video.snippet.thumbnails.medium.url} alt={props.video.snippet.title} />
			<div className="songResultTitle">
				<p>{props.video.snippet.title}</p>
				<p className="confirmAdded">Added!</p>
			</div>
		</li>
	);
};

//React component for building the results list
const ResultsListComponent = props => {
	
	const added = document.querySelectorAll('.confirmAdded');
	added.forEach(msg => {
		msg.style.display = 'none';
	});
	
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
	
	const searchPage = document.querySelector('#search');
	searchPage.style.display = 'block';
	
	ReactDOM.render(
		<SearchVideoPageComponent />,
		searchPage
	);
};

//SECTION - Events and other App logic
const handleNavHomeClick = e => {
	e.preventDefault();
	
	document.querySelector('#search').style.display = 'none';
	document.querySelector('#paidAccount').style.display = 'none';
};

//handles the JSON response from the YouTube API
const processResults = data => {	
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
const addSongToQueue = (videoId, thumbnail, title, currPlayImg) => {
	if (!isHost) {
		socket.emit('clientSendVideoId', {videoId, thumbnail, title, currPlayImg});
	} else {
		addVideoToQueue(videoId, thumbnail, title, currPlayImg);
	}
};

//method for adding a song to the queue from a search
const addSongFromSearch = e => {
	let element = e.target;
	
	if (e.target.tagName === 'IMG') {
		element = e.target.parentNode;
	}
	
	if (e.target.tagName === 'P') {
		element = e.target.parentNode.parentNode;
	}
	
	element.childNodes[1].childNodes[1].style.display = "block";
	
	const videoId = element.getAttribute('value');
	const thumbnail = element.getAttribute('thumbnail');
	const title = element.getAttribute('vidTitle');
	const currPlayImg = element.getAttribute('currPlayImg');
	
	addSongToQueue(videoId, thumbnail, title, currPlayImg);
};