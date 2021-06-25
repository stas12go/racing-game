"use strict";
const score = document.querySelector('.score'),
	menu = document.querySelector('.menu'),
	starts = document.querySelectorAll('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div');
const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false
};
const setting = {
	start: false,
	score: 0,
	speed: 3,
	traffic: 3
};
const NUMBER_OF_LINES = 8;
const NUMBER_OF_ENEMIES_CARS = 7;
const player = new Audio(`https://www.ostmusic.org/sound/track/
	dalnoboyshchiki_2/%D0%A5%D0%B8%D0%BC%D0%B5%D1%80%D0%B0.mp3`);
const storage = window.localStorage;
let bestResult = storage.getItem('best');
let start;

function getRandomCar(car) {
	car.style.background = 
		`transparent 
		url('./image/enemy${Math.ceil(Math.random() * NUMBER_OF_ENEMIES_CARS)}.png') 
		center / cover 
		no-repeat`;
	car.style.left = Math.random() * (gameArea.clientWidth - car.clientWidth) + 'px';
}

function moveRoad() {
	let lines = document.querySelectorAll('.line');
	lines.forEach(function (line) {
		line.y += setting.speed * 2;
		line.style.top = line.y + 'px';
		if (line.y >= (gameArea.offsetHeight)) {
			line.y = -gameArea.offsetHeight / NUMBER_OF_LINES;
		}
	});
}

function moveEnemy() {
	let enemies = document.querySelectorAll('.enemy');
	enemies.forEach(function (enemy) {
		let carRect = car.getBoundingClientRect();
		let enemyRect = enemy.getBoundingClientRect();

		if (carRect.top <= enemyRect.bottom &&
			carRect.right >= enemyRect.left &&
			carRect.left <= enemyRect.right &&
			carRect.bottom >= enemyRect.top) {
			setting.start = false;
			menu.classList.remove('hide');
			menu.style.top = score.offsetHeight + 'px';
		}
		
		enemy.y += setting.speed;
		enemy.style.top = enemy.y + 'px';
		if (enemy.y >= (gameArea.offsetHeight)) {
			enemy.y = -gameArea.offsetHeight / setting.traffic;
			getRandomCar(enemy);
		}
	});
}

function playGame() {
	if (setting.start) {
		setting.score += setting.speed;
		console.log('bestResult < setting.score: ', bestResult > setting.score);
		if (bestResult > setting.score) {
			score.textContent = 'SCORE: ' + setting.score;
		} else {
			score.textContent = 'SCORE: ' + setting.score + ' Ты побил рекорд!';
		}

		moveRoad();
		moveEnemy();
		if (keys.ArrowLeft && setting.x > 0) {
			setting.x -= setting.speed;
		}
		if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
			setting.x += setting.speed;
		}
		if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
			setting.y += setting.speed;
		}
		if (keys.ArrowUp && setting.y > 0) {
			setting.y -= setting.speed;
		}
		car.style.left = setting.x + 'px';
		car.style.top = setting.y + 'px';
		requestAnimationFrame(playGame);
	} else {
		player.pause();
		if (bestResult < setting.score) {storage.setItem('best', setting.score);}
		console.log(storage.getItem('best'));
	}
}

function playMusic() {	
	player.currentTime = 0;
	player.play();
}

function startGame(event) {
	car.classList.add('car');
	menu.classList.add('hide');
	gameArea.classList.remove('hide');

	player.volume = 0.2;

	gameArea.innerHTML = '';

	setting.start = true;
	setting.score = 0;
	setting.speed = parseInt(event.currentTarget.dataset.difficulty);

	gameArea.appendChild(car);
	car.style.left = (gameArea.offsetWidth - car.offsetWidth) / 2 + 'px';
	car.style.top = gameArea.offsetHeight - car.offsetHeight - 10 + 'px';
	
	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;

	for (let i = -1, block = 0; (i * block) < gameArea.offsetHeight; i++) {
		const line = document.createElement('div');
		line.classList.add('line');
		block = gameArea.offsetHeight / NUMBER_OF_LINES;
		line.style.height = block * 0.5 + 'px';
		line.style.top = (i * block) + 'px';
		line.y = i * block;
		gameArea.appendChild(line);
	}
	
	for (let i = -1	, block = 0; (i * block) < gameArea.offsetHeight; i++) {
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		block = gameArea.offsetHeight / setting.traffic;
		enemy.style.top = (i * block - gameArea.offsetHeight) + 'px';
		gameArea.appendChild(enemy);
		getRandomCar(enemy);
		enemy.y = i * block - gameArea.offsetHeight;
	}

	playMusic();
	
	requestAnimationFrame(playGame);
}

function startRun(event) {
	if (keys.hasOwnProperty(event.key)) {
		event.preventDefault();
		keys[event.key] = true;
	}
}

function stopRun(event) {
	if (keys.hasOwnProperty(event.key)) {
		event.preventDefault();
		keys[event.key] = false;
	}
}

for (const key in starts) {
	if (Object.hasOwnProperty.call(starts, key)) {
		start = starts[key];
		start.addEventListener('click', startGame);
	}
}
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);