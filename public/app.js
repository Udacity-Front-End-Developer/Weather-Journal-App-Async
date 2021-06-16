/*
# ---------------------------<|----------------|>--------------------------- #
# ----------------------------|GLOBAL VARIABLES|---------------------------- #
# ---------------------------<|----------------|>--------------------------- #
*/

const KEY = 'd98ef3246962037e642cfebbc9b82b35';
let zipCode;
let feelings;
const generate = document.querySelector('#generate');
const zipInput = document.querySelector('#zip');
const feelingsInput = document.querySelector('#feelings');
// Create a new date instance dynamically with JS
let date = new Date();
let newDate = date.getMonth() + '.' + date.getDate() + '.' + date.getFullYear();
/*
# ----------------------------<|----------------|>--------------------------- #
# -----------------------------|HELPER FUNCTIONS|---------------------------- #
# ----------------------------<|----------------|>--------------------------- #
*/

// Shows the overlay with the spinner.
const overlayToggler = () => {
	const container = document.querySelector('.container');
	const overlay = document.querySelector('.overlay');
	const spinner = document.querySelector('.spinner');
	spinner.classList.toggle('hidden');
	overlay.classList.toggle('hidden');
	container.classList.toggle('blur');
};

// Checks for invalid input.
const inputNotValid = (zip, feel) => {
	if (!zipValidation(zip) || !feelingsValidation(feel)) {
		return true;
	}
};

// Zip code validation.
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

// Feelings input validation.
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

// Fetches data from the api.
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

// Posts data received from the api alongside the user input to the server.
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

/*
# -----------------------------<|-------------|>---------------------------- #
# ------------------------------|PAGE'S EVENTS|----------------------------- #
# -----------------------------<|-------------|>---------------------------- #
*/

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
				console.log(response);
			})
			.catch((error) => {
				const container = document.querySelector('.container');
				const errorBox = document.querySelector('.api-error');
				container.classList.toggle('blur');
				container.style.pointerEvents = 'none';
				errorBox.classList.toggle('api-error--active');
				errorBox.querySelector(
					'.api-error__text'
				).textContent = `Oops! something went wrong. ${error}`;
				errorBox
					.querySelector('.api-error__btn')
					.addEventListener('click', () => {
						window.location.reload();
					});
				// return;
			});

		setTimeout(() => {
			overlayToggler();
		}, 500);
	}
});
