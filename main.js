const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		height: 600,
		width: 800
	});

	ipcMain.on('openFileHandler', (event) => {
		dialog.showOpenDialog({properties: ['openFile', 'openDirectory']}, (filename) => {
			if (!filename) {
				console.warn('No file specified!');
			} else {
				fs.readFile(filename[0], 'utf-8', function (err, content) {
					if (err) {
						console.warn('An error ocurred while reading the file :' + err.message);
						return;
					}
					event.sender.send('read-file-success', filename[0], content);
					return content;
				});
			}
		});
	});

	ipcMain.on('createFileHandler', (event) => {
		dialog.showSaveDialog((filename, content = '') => {
			if (!filename) {
				console.warn('You haven\'t specified a file name!');
				return;
			}

			fs.writeFile(filename, content, (err) => {
				if (err) {
					console.warn('An error occured while saving the file!' + err.message);
					throw err;
				}
			});
			event.sender.send('read-file-success', filename, content);
		});
	});

	ipcMain.on('saveFileHandler', (event, filename, content) => {
		fs.writeFile(filename, content, function (err) {
			if (err) {
				console.warn("An error ocurred while updating the file" + err.message);
				return;
			}
		});
	});

	mainWindow.loadURL('file://' + __dirname + '/index.html');
});