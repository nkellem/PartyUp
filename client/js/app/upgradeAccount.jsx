//SECTION - Components that build the web page
//React component for rendering the Upgrade Account blurb
const UpgradeAccountContentComponent = props => {
	return (
		<div id="upgradeAccountContent">
			<h1>Upgrade Account</h1>
			<p>For a fee of $1 a month, you can password protect your group queues!</p>
		</div>
	);
};

//React component for rendering the entire page
const UpgradeAccountPageComponent = props => {
	return (
		<div>
			<SearchVideoNavComponent />
			<UpgradeAccountContentComponent />
		</div>
	);
};

//SECTION - Methods for calling the components and rendering the page
//Render the Upgrade Account page
const createUpgradeAccountPage = () => {
	ReactDOM.render(
		<UpgradeAccountPageComponent />,
		document.querySelector('#paidAccount')
	);
};

//SECTION - Events and other App logic
//when the upgrade account button is clicked, render the summary of a paid service
const handleUpgradeAccount = e => {
	e.preventDefault();
	
	document.querySelector('#paidAccount').style.display = 'block';
	createUpgradeAccountPage();
};