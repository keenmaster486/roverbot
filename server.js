const express = require('express');
const bodyParser = require('body-parser');

const { SerialPort } = require('serialport');

const app = express();


const port = new SerialPort({
	path: '/dev/ttyACM0',
	baudRate: 9600
});



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));


app.post('/motors', (req, res) => {
	const m1Normal = Math.abs(req.body.m1);
	const m2Normal = Math.abs(req.body.m2);
	const m3Normal = Math.abs(req.body.m3);
	const m4Normal = Math.abs(req.body.m4);

	let m1Speed = `${m1Normal}`;
	let m2Speed = `${m2Normal}`;
	let m3Speed = `${m3Normal}`;
	let m4Speed = `${m4Normal}`;

	if (m1Normal < 100) {
		m1Speed = `0${m1Normal}`;
	}
	if (m1Normal < 10) {
		m1Speed = `00${m1Normal}`;
	}

	if (m2Normal < 100) {
		m2Speed = `0${m2Normal}`;
	}
	if (m2Normal < 10) {
		m2Speed = `00${m2Normal}`;
	}

	if (m3Normal < 100) {
		m3Speed = `0${m3Normal}`;
	}
	if (m3Normal < 10) {
		m3Speed = `00${m3Normal}`;
	}

	if (m4Normal < 100) {
		m4Speed = `0${m4Normal}`;
	}
	if (m4Normal < 10) {
		m4Speed = `00${m4Normal}`;
	}

	const motor1 = req.body.m1 < 0 ? `m5${m1Speed}` : `m1${m1Speed}`;
	const motor2 = req.body.m2 < 0 ? `m6${m2Speed}` : `m2${m2Speed}`;
	const motor3 = req.body.m3 < 0 ? `m7${m3Speed}` : `m3${m3Speed}`;
	const motor4 = req.body.m4 < 0 ? `m8${m4Speed}` : `m4${m4Speed}`;

	const commandString = `${motor1}|${motor2}|${motor3}|${motor4}|`;
	// send to serial port
	console.log(commandString);

	port.write(commandString, (err) => {
		if (err) {
			return console.log(err);
		}
		console.log('Message written');
	})

	res.json({ success: true });
});


app.listen(3000, () => {
	console.log('Server is listening at port 3000');
});
