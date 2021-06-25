"use strict";
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
	const win = new BrowserWindow({
		width: 600,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'main.js')
		}
	});

	win.loadFile('index.html');
}

app.whenReady().then(() => {
	createWindow();
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
  })