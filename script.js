// CANVAS
const canvas = document.querySelector('#canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//canvas.style = 'border: solid 1px black'
const ctx = canvas.getContext('2d');

// VARIABLES
let zero = window.innerHeight / 2;
let x = window.innerWidth / 2;
let y = window.innerHeight / 2;

//SOUNDS
let theme = new Audio('src/sounds/theme.wav');
theme.loop = true;
let microphoneStarted = false;

let xOnUp = 0;
let xSinceUp = 0;

let up = false;
let first = true;

// BARS
const bars = [{ x: window.innerWidth, y: 0, gapY: 300 }];
const gapHeight = 200;
let shouldAddBar = true;

// EVENEMENTS ESPACE
document.onkeydown = function (event) {
	if (event.keyCode == 32) {
		up = true;
		// capturer la valeur de x au moment du click sur espace
		xOnUp = x;
	}

	if (event.keyCode == 13) {

		getMicroVolume();

	}
}

document.onkeyup = function (event) {
	if (event.keyCode == 32) {
		up = false;
	}
}

// DECLARATION POINTS
const points = [{ x: 250, y: 250 }];

// LINE(S)

// TIMER
var startTime = Date.now();
let score = 0;
var interval = setInterval(function () {
	var elapsedTime = Date.now() - startTime;
	score = (elapsedTime / 100).toFixed(0);
	document.getElementById("timer").innerHTML = score + '/' + localStorage.highestScore;
}, 100);

function generateBars(ctx) {
	for (let i = 0; i < bars.length; i++) {
		// afficher la partie superieure de la bare
		ctx.fillStyle = '#F2790F'
		ctx.fillRect(bars[i].x, 0, 3, bars[i].gapY);
		// afficher la partie inferieure de la bare
		ctx.fillStyle = '#F2790F'
		const bottomBar = canvas.height - gapHeight - bars[i].gapY;
		ctx.fillRect(bars[i].x, bars[i].gapY + gapHeight, 3, bottomBar);
		// deplacer la bare
		bars[i].x -= 20
	}

	// si la bare en avant depasse le debut du canvas on le supprime
	if (bars[0].x <= 0) {
		shouldAddBar = true;
		bars.shift();
	}
	
	// si la bare en avant depasse le tiere du canvas on genere une nouvelle bare
	if (bars[0].x <= (canvas.width / 3) && shouldAddBar) {
		bars.push({ x: window.innerWidth, y: 0, gapY: Math.floor(Math.random() * (canvas.height - gapHeight)) });
		shouldAddBar = false;
	}

}

// let ballHeight = 
let lastPos = { x: 0, y: 0 }
function draw() {
	
	// SON THEME
	// theme.play();
	
	
	//UPDATE TOUT LES 100MS
	setInterval(() => {
		// ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// xSinceUp = x - xOnUp;

		// if (up) {
		// 	y -= (1 / 50) * xSinceUp * xSinceUp;
		// 	console.log("ACTIVE");
		// } else if (y < zero)
		// 	y += 20;
		//console.log("INACTIVE");

		//creer un nouveau point au centre

		generateBars(ctx);
		
		// decaler touts les points
		for (const point of points) {
			point.x -= 20
		}

		// // ajouter un head
		// points.unshift({ x: 250, y: y });


		points.unshift({ x: zero, y: y })

		// for (const point of points) {
		// 	ctx.beginPath();
		// 	ctx.fillStyle = 'red';
		// 	ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI)
		// 	ctx.fill()
		// }

		// dessiner les points

		for (let i = 0; i < points.length - 1; i++) {
			ctx.beginPath();
			ctx.fillStyle = '#F21326';
			ctx.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI)
			ctx.fill()
			ctx.closePath();

			if (!first) {
				ctx.beginPath();
				ctx.moveTo(points[i].x, points[i].y);
				ctx.lineTo(points[i + 1].x, points[i + 1].y);
				ctx.strokeStyle = '#F21326';
				ctx.stroke();
				ctx.closePath();
			}

		}

		lastPos = { x: x, y: y };
		first = false;

		const head = points[0];
		// est ce que le head est entre la largeur de la bare
		const isCrossed = head.x >= bars[0].x && (head.x <= bars[0].x + 20);
		// console.log(head.x);
		if (isCrossed && !(head.y > bars[0].gapY && head.y < (bars[0].gapY + gapHeight))) {
			localStorage.highestScore = score;
			window.location.href = 'score.html';
		}
		//	console.log("Position x " + x + " Position y " + y);
	}, 100)
}

async function getMicroVolume(result) {
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
	audioContext = new AudioContext();
	analyser = audioContext.createAnalyser();
	microphone = audioContext.createMediaStreamSource(stream);
	javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

	analyser.smoothingTimeConstant = 0.8;
	analyser.fftSize = 1024;

	microphone.connect(analyser);
	analyser.connect(javascriptNode);
	javascriptNode.connect(audioContext.destination);
	javascriptNode.onaudioprocess = function () {
		var array = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(array);
		var values = 0;

		var length = array.length;
		for (var i = 0; i < length; i++) {
			values += (array[i]);
		}

		var average = values / length;
		console.log(average)

		document.querySelector('#volume').innerHTML = Math.round(average);
		y = window.innerHeight - average * 70;
		// colorPids(average);
		// console.log(average);
	}
}
draw();