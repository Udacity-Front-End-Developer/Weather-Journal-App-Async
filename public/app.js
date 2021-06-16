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
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

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

const fetchApiData = async (baseUrl, code, key) => {
	let url = `${baseUrl}?zip=${code},us&appid=${key}`;
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
		console.log('catch', error);
	}
};

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
		try {
			fetchApiData(
				`https://api.openweathermap.org/data/2.5/weather`,
				zipCode,
				KEY
			)
				.then((data) => {
					if (!data) {
						throw 'Bad Request';
					}
					postData('/all', data);
				})
				.then((response) => {
					console.log(response);
				});
		} catch (error) {
			console.log('catch', error);
		}

		setTimeout(() => {
			overlayToggler();
		}, 500);
	}
});
