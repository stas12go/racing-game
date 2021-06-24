"use strict";
const score = document.querySelector('.score'),
	start = document.querySelector('.start'),
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
	traffic: 4
};
const NUMBER_OF_LINES = 8;
const NUMBER_OF_ENEMIES = 7;

function getRandomCar(car) {
	car.style.background = 
		`transparent 
		url('./image/enemy${Math.ceil(Math.random() * NUMBER_OF_ENEMIES)}.png') 
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
	}
}

function startGame() {
	start.classList.add('hide');
	gameArea.classList.remove('hide');

	setting.start = true;
	gameArea.appendChild(car);
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
	
	for (let i = -1, block = 0; (i * block) < gameArea.offsetHeight; i++) {
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		block = gameArea.offsetHeight / setting.traffic;
		enemy.style.top = (i * block) + 'px';
		gameArea.appendChild(enemy);
		getRandomCar(enemy);
		enemy.y = i * block;
	}
	
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

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);