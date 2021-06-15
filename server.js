// Setup empty JS object to act as endpoint for all routes
let projectData = {
	zip: 1414,
}; // the app api endpoint.

/*
 *Dependencies.
 */
const express = require('express');
const cors = require('cors');
const _PORT = 3000;

// Initialize an express instance.
const app = express();

/*
 *Middlewares config
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize the main project folder
app.use(express.static('public'));

app.get('/all', (req, res) => {
	res.send(projectData);
});

app.post('/all', (req, res) => {
	// Adds incoming data to projectData.
});
app.listen(_PORT, () => console.log(`Serving is live on port ${_PORT}`));
