// This object object acts as endpoint for all routes
let projectData = {};

/*
 *Dependencies.
 */
const express = require('express');
const cors = require('cors');
const _PORT = 3000;

// Initialize an instance of an express application.
const app = express();

/*
 *Middlewares config
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize the main project folder.
app.use(express.static('public'));

/**Routes handlers */
app.get('/all', (req, res) => {
	res.send(projectData);
});

app.post('/all', (req, res) => {
	// Adds incoming data to projectData.
	console.log(req.body);
	projectData.temp = req.body.data.main.temp;
	projectData.date = req.body.newDate;
	projectData.userInput = req.body.userInput;
	res.send(projectData);
	// projectData.date
	// res.send(projectData);
});

app.listen(_PORT, () => console.log(`Server is live on port ${_PORT}`));
