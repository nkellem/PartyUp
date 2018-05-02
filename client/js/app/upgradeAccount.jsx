//SECTION - Components that build the web page

//SECTION - Methods for calling the components and rendering the page

//SECTION - Events and other App logic
//when the upgrade account button is clicked, render the summary of a paid service
const handleUpgradeAccount = e => {
	e.preventDefault();
	
	document.querySelector('#paidAccount').style.display = 'block';
};