fetch('http://localhost:3000/all')
	.then((req) => req.json())
	.then((data) => console.log(data));
