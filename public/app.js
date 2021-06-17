/*
# ---------------------------<|----------------|>--------------------------- #
# ----------------------------|GLOBAL VARIABLES|---------------------------- #
# ---------------------------<|----------------|>--------------------------- #
*/

/**
 * The key to openweathermap api.
 * @constant
 */
const KEY = 'd98ef3246962037e642cfebbc9b82b35';
const generate = document.querySelector('#generate');
const zipInput = document.querySelector('#zip');
const feelingsInput = document.querySelector('#feelings');
let zipCode;
let feelings;
// Create a new date instance dynamically with JS
let date = new Date();
let newDate = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
/*
# ----------------------------<|----------------|>--------------------------- #
# -----------------------------|HELPER FUNCTIONS|---------------------------- #
# ----------------------------<|----------------|>--------------------------- #
*/

/**
 * @description Activates the overlay and the spinner.
 */
const overlayToggler = () => {
	const container = document.querySelector('.container');
	const overlay = document.querySelector('.overlay');
	const spinner = document.querySelector('.spinner');
	spinner.classList.toggle('hidden');
	overlay.classList.toggle('hidden');
	container.classList.toggle('blur');
};

/**
 * @description Check for invalid input.
 * @function inputNotValid
 * @param {HTMLElement} zip
 * @param {HTMLElement} feel
 * @returns {boolean}
 */
const inputNotValid = (zip, feel) => {
	if (!zipValidation(zip) || !feelingsValidation(feel)) {
		return true;
	}
};

/**
 * @description Validates the zip code's value and handles errors.
 * @function zipValidation
 * @param {HTMLElement} zip
 * @returns {boolean}
 */
const zipValidation = (zip) => {
	zip.addEventListener('input', () => {
		document.querySelector('.zip-error').textContent = '';
	});
	if (zip.value.length < 1) {
		document.querySelector('.zip-error').textContent = 'Zip code is required!';
		return false;
	} else if (isNaN(zip.value)) {
		document.querySelector('.zip-error').textContent =
			'Zip code must be a number!';
		return false;
	} else {
		return true;
	}
};

/**
 * @description Validates the feelings' value and handles errors.
 * @function feelingsValidation
 * @param {HTMLElement} feel
 * @returns {boolean}
 */
const feelingsValidation = (feel) => {
	feel.addEventListener('input', () => {
		document.querySelector('.feelings-error').textContent = '';
	});
	if (feel.value.length < 1) {
		console.log('field required');
		document.querySelector('.feelings-error').textContent =
			'This field is required!';
		return false;
	} else {
		return true;
	}
};

/**
 * @description This fetches data from the api.
 * @function fetchApiData
 * @param {string} baseUrl
 * @param {number} code
 * @param {string} key
 * @returns {object} An object holding the data from the api.
 */
const fetchApiData = async (baseUrl, code, key) => {
	let url = `${baseUrl}?zip=${code},us&appid=${key}&units=metric`;
	const res = await fetch(url);
	const data = await res.json();
	try {
		if (res.status === 404 && !res.ok) {
			throw data.message;
		} else {
			document.querySelector('.title').classList.add('hidden');
			document
				.querySelector('.container__col1')
				.classList.add('container__col1--active');
			return data;
		}
	} catch (error) {
		// Notify the user about the error.
		return error;
	}
};

/**
 * @description Notifies the user about any bad request error.
 * @function fetchErrorHandler
 * @param {object} error
 */
const fetchErrorHandler = (error) => {
	const container = document.querySelector('.container');
	const errorBox = document.querySelector('.api-error');
	container.classList.toggle('blur');
	container.style.pointerEvents = 'none';
	errorBox.classList.toggle('api-error--active');
	errorBox.querySelector(
		'.api-error__text'
	).textContent = `Oops! something went wrong. ${error}`;
	errorBox.querySelector('.api-error__btn').addEventListener('click', () => {
		window.location.reload();
	});
};

/**
 * @description This fetches data from the server.
 * @function getData
 * @param {string} url
 * @returns {object} An object holding the data from the server.
 */
const getData = async (url = '') => {
	const response = await fetch(url);
	const data = await response.json();
	return data;
};

/**
 * @description Posts data received from the api alongside the user input to the server.
 * @function postData
 * @param {string} url
 * @param {object} data
 * @returns {object} An object holding the response from the server.
 */
const postData = async (url = '', data = {}) => {
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	try {
		const newData = response.json();
		return newData;
	} catch (error) {
		console.log('error', error);
	}
};

/**UI updates */

// Update entryHodler.
/**
 * @description This updates the HTML element entryHolder.
 * @function updateEntryHolder
 * @param {object} data
 */
const updateEntryHolder = (data) => {
	const entryHolder = document.querySelector('#entryHolder');
	entryHolder.querySelector('#date').textContent = `date:${data.date}`;
	entryHolder.querySelector('#temp').textContent = `temp:${data.temp}`;
	entryHolder.querySelector(
		'#content'
	).textContent = `zip:${data.userInput.zip} feeling:${data.userInput.feelings}`;
};

/**
 * @description This calls getData and updates the appropriate UI elements with the new data received.
 * @function updateUi
 */
const updateUi = () => {
	// Reset input values.
	feelingsInput.value = '';
	zipInput.value = '';
	// Retrieve data from server.
	getData('/all').then((data) => {
		updateEntryHolder(data);
		let card = document.querySelector('.card');
		card.querySelector('.zip').textContent = `zip: ${data.userInput.zip}`;
		card.querySelector(
			'.feel'
		).textContent = `feelings: ${data.userInput.feelings}`;
		card.querySelector('.date').textContent = newDate;
		card.querySelector('.temp').textContent = data.temp;
	});
};

/*
# -----------------------------<|-------------|>---------------------------- #
# ------------------------------|PAGE'S EVENTS|----------------------------- #
# -----------------------------<|-------------|>---------------------------- #
*/

// On page load, retreive data from server and update the ui.
window.addEventListener('load', () => {
	getData('/all').then((data) => {
		// if data obj is not empty update entryHolder.
		if (Object.keys(data).length > 0) {
			updateEntryHolder(data);
		}
	});
});

generate.addEventListener('click', (e) => {
	e.preventDefault();
	if (inputNotValid(zipInput, feelingsInput)) {
		return;
	} else {
		overlayToggler();
		zipCode = zipInput.value;
		feelings = feelingsInput.value;
		fetchApiData(
			`https://api.openweathermap.org/data/2.5/weather`,
			zipCode,
			KEY
		)
			.then((data) => {
				if (!data.main) {
					throw data;
				} else {
					return postData('/all', {
						data,
						newDate,
						userInput: { zip: zipCode, feelings: feelings },
					});
				}
			})
			.then((response) => {
				// updateUi will ask the server for data.
				updateUi(response);
			})
			.catch((error) => {
				return fetchErrorHandler(error);
			});
		// Communicate to the user that we're calculating his request.
		setTimeout(() => {
			overlayToggler();
		}, 500);
	}
});
