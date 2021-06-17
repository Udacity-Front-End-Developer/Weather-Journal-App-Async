const { expect, should } = require('chai');
const fetch = require('node-fetch');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

describe('Server connection', () => {
	it('it should connect to the server', (done) => {
		chai
			.request(server)
			.get('/all')
			.end((error, response) => {
				expect(response.status).to.eql(200);
				expect(response.body).to.eql({});
				done();
			});
	});

	it('it should post data to the server', (done) => {
		let date = new Date();
		let testDate =
			date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
		let testData = {
			data: { main: { temp: 50 } },
			testDate,
			userInput: { zip: 10001, feelings: 'happy' },
		};
		chai
			.request(server)
			.post('/all')
			.send(testData)
			.end((error, response) => {
				expect(response.status).to.eql(200);
				expect(response.body.temp).to.eql(testData.data.main.temp);
				done();
			});
	});

	it('it should get data from api and post to the server', (done) => {
		let key = 'd98ef3246962037e642cfebbc9b82b35';
		fetch(
			`https://api.openweathermap.org/data/2.5/weather?zip=10001,us&appid=${key}&units=metric`
		)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				let date = new Date();
				let testDate =
					date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
				let userInput = { zip: 10001, feelings: 'happy' };
				chai
					.request(server)
					.post('/all')
					.send({ data, testDate, userInput })
					.end((error, response) => {
						expect(response.status).to.eql(200);
						expect(response.body.userInput.feelings).to.eql(userInput.feelings);
						return done();
					});
			});
		// .then(done);
	});
});
