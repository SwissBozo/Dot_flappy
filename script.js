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

let xOnUp = 0;
let xSinceUp = 0;

let up = false;
let soundStarted = false;
let first = true;

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



// let ballHeight = 
let lastPos = { x: 0, y: 0 }
function draw() {
	//UPDATE TOUT LES 100MS
	setInterval(() => {
		// PAREMTRES LIGNES
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 1;
		// 
		// LINE 1 TOP
		ctx.beginPath();
		ctx.moveTo(window.innerWidth / 1.5, 0);
		ctx.lineTo(window.innerWidth / 1.5, 400);
		ctx.stroke();

		// LINE 1 BOTTOM
		ctx.beginPath();
		ctx.moveTo(window.innerWidth / 1.5, 500);
		ctx.lineTo(window.innerWidth / 1.5, 1000);
		ctx.stroke();

		// LINE 2 TOP
		ctx.beginPath();
		ctx.moveTo(window.innerWidth / 1.2, 0);
		ctx.lineTo(window.innerWidth / 1.2, 300);
		ctx.stroke();

		// LINE 2 BOTTOM
		ctx.beginPath();
		ctx.moveTo(window.innerWidth / 1.2, 450);
		ctx.lineTo(window.innerWidth / 1.2, 1000);
		ctx.stroke();
		ctx.fillStyle = '#000'
		// ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// xSinceUp = x - xOnUp;

		// if (up) {
		// 	y -= (1 / 50) * xSinceUp * xSinceUp;
		// 	console.log("ACTIVE");
		// } else if (y < zero)
		// 	y += 10;
		//console.log("INACTIVE");

		//creer un nouveau point au centre

		// decaler touts les points
		for (const point of points) {
			point.x -= 20
		}

		// // ajouter un head
		// points.unshift({ x: 250, y: y });


		points.push({ x: zero, y: y })

		// for (const point of points) {
		// 	ctx.beginPath();
		// 	ctx.fillStyle = 'red';
		// 	ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI)
		// 	ctx.fill()
		// }

		// dessiner les points



		for (let i = 0; i < points.length - 1; i++) {
			ctx.beginPath();
			ctx.fillStyle = "blue";
			ctx.arc(points[i].x, points[i].y, 0.5, 0, 2 * Math.PI)
			ctx.fill()
			ctx.closePath();

			if (!first) {
				ctx.beginPath();
				ctx.moveTo(points[i].x, points[i].y);
				ctx.lineTo(points[i + 1].x, points[i + 1].y);
				ctx.strokeStyle = 'blue';
				ctx.stroke();
				ctx.closePath();
			}

		}

		lastPos = { x: x, y: y };
		first = false;




		// incrementer x
		if (soundStarted) {
			x += 10

		}

		//	console.log("Position x " + x + " Position y " + y);
	}, 100)
}

// // GET MICROPHONE
// async function getMicroVolume() {
// 	const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
// 	audioContext = new AudioContext();
// 	analyser = audioContext.createAnalyser();
// 	microphone = audioContext.createMediaStreamSource(stream);
// // 	javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

// // 	analyser.smoothingTimeConstant = 0.8;
// // 	analyser.fftSize = 1024;

// // 	microphone.connect(analyser);
// // 	soundStarted = true;
// // 	analyser.connect(javascriptNode);
// // 	javascriptNode.connect(audioContext.destination);
// // 	console.log(analyser);
// // 	javascriptNode.onaudioprocess = function () {
// // 		var array = new Uint8Array(analyser.frequencyBinCount);
// // 		analyser.getByteFrequencyData(array);
// // 		var values = 0;
// // 	//	console.log(analyser);

// // 		var length = array.length;
// // 		for (var i = 0; i < length; i++) {
// // 			values += (array[i]);
// // 		}

// // 		var average = values / length;
// // 		console.log(average);

// // 		y = window.innerHeight - window.innerHeight / 50 * average;
// // 		//document.querySelector('#volume').innerHTML = Math.round(average);
// // 		// colorPids(average);
// // 	}
// // }

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

		document.querySelector('#volume').innerHTML = Math.round(average);
		y = window.innerHeight - average * 4;
		// colorPids(average);
		console.log(average);
	}
}

// TIMER
var startTime = Date.now();

var interval = setInterval(function () {
	var elapsedTime = Date.now() - startTime;
	document.getElementById("timer").innerHTML = (elapsedTime / 100).toFixed(0);
}, 100);



// // COLLISION DETECTOR 1
// function arcsCollision(first, second) {
// 	const dx = first.x - second.x;
// 	const dy = first.y - second.y;
// 	const distance = Math.sqrt(dx ** 2 + dy ** 2);
// 	return (
// 		distance
// 		<=
// 		(first.radius + second.radius + 0.1)
// 	);
// }

// function arcAndRectCollision(arc, rect) {

// 	return (
// 		arc.x - arc.radius < rect.x ||
// 		arc.x + arc.radius > rect.width ||
// 		arc.y - arc.radius < rect.y ||
// 		arc.y + arc.radius > rect.height
// 	);
// }


// // COLLISION DETECTOR 2
// var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');

// var cWidth = canvas.width = window.innerWidth;
// var cHeight = canvas.height = window.innerHeight;

// var bodies = [];
// var keyState = [];
// var jumping = true;

// var player = {
//   x: cWidth / 2,
//   y: cHeight / 2,
//   vx: 0,
//   vy: 0,
//   radius: 20,
//   color: "white",
//   lastPosition: {
//     x: 0,
//     y: 0
//   }
// };

// for (var i = 0, x = 20; i < x; i++) {
//   bodies.push({
//     x: Math.random() * cWidth,
//     y: Math.random() * cHeight,
//     w: 30,
//     h: 30,
//     color: "red"  
//   });
// }

// function draw() {
//   ctx.clearRect(0,0,cWidth,cHeight);

//   for(var i = 0, x = bodies.length; i < x; i++){
//     var body = bodies[i];
//     ctx.fillStyle = body.color;
//     ctx.fillRect(body.x, body.y, body.w, body.h);
//   }

//   ctx.fillStyle = player.color;
//   ctx.beginPath();
//   ctx.arc(player.x, player.y, player.radius, 0, 2*Math.PI);
//   ctx.fill();

//   ctx.fillStyle = 'black';
//   ctx.fillRect(player.x,player.y,1,1);
// }

// function update() {
//   player.lastPosition.x = player.x;
//   player.lastPosition.y = player.y;

//   if (keyState[37]){
//     player.vx = 1;
//     player.x -= player.vx;
//   }

//   if (keyState[39]){
//     player.vx = 1;
//     player.x += player.vx;
//   }

//   if (keyState[38]){
//     player.vy = 1;
//     player.y -= player.vy;
//   }

//   if (keyState[40]){
//     player.vy = 1;
//     player.y += player.vy;
//   }

//   if(notColliding(player)){
//     player.color = "blue";
//   } else {
//     player.color = "white";
//   }
// }

// function tick() {
//   update();
//   draw();
//   requestAnimationFrame(tick);
// }

// function notColliding(block1) {
//   for (var i = 0, x = bodies.length; i < x; i++) {
//     if (collision(block1, bodies[i])){
//       return true;
//     } 
//   }

//   return false;
// }

// function collision(block1, block2) {
//   return !(block1 === block2 ||
//           block1.x + block1.radius < block2.x ||
//           block1.y + block1.radius < block2.y ||
//           block1.x - block1.radius > block2.x + block2.w ||
//           block1.y - block1.radius > block2.y + block2.h);
// }

// tick();

// window.addEventListener('keydown', function(e) {
//   keyState[e.keyCode] = true;
//   e.preventDefault();
// });

// window.addEventListener('keyup', function(e) {
//   keyState[e.keyCode] = false;
// });

draw();