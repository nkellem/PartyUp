//SECTION - Components that build the web page

//React component for building the page title
const PageTitleComponent = props => {
	return (
		<h1 id="title">Party Up</h1>
	);
};

//React component for building the playing section
const CurrentlyPlayingComponent = props => {
	return (
		<div id="playingSection">
			<div id="ytTitle">
				<h3>Song Title Goes Here</h3>
			</div>
			<div id="controls">
				<span className="control" id="previous">Prev</span>
				<span id="ytVideo">
					<p>Click me to add a song!</p>
				</span>
				<span className="control" id="next">Next</span>
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

//React component for building the search button
const SearchButtonComponent = props => {
	return (
		<button>Search For A Song</button>
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

//SECTION - Events and other App logic