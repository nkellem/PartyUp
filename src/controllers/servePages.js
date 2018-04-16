//Renders the home page
const homePage = (req, res) => {
	res.render('home');
};

//Exports methods for the module so they can be used by other files
module.exports = {
	homePage,
};