//Holds all our YouTube API related information
const API_KEY = '&key=AIzaSyB3Js93Zd4qIyvA-CY0ZBaRgt4ZQifUDMQ';
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&type=video';
let searchTerm = '&q=';

//helper method for sending out AJAX requests
const sendAjax = (type, action, data, success) => {
  fetch(action, {
		headers: {
			'Content-Type': 'application/json'
		},
    method: type,
		body: data
  }).then(response => {
    return response.json();
  }).then(data => {
    if (data.error) {
      handleError(data.error);
      return;
    }
    success(data);
  });
};

//helper method for initiating an API request
const buildYouTubeAPIRequest = (search, success) => {
	const searchQuery = `${searchTerm}${search}`;
	const action = `${BASE_URL}${searchQuery}${API_KEY}`;
	
	sendAjax('GET', action, null, success);
};