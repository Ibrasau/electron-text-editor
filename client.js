	const { ipcRenderer } = require('electron');

	let openedFile;

	document.querySelector('.open-file').addEventListener('click', () => {
		ipcRenderer.send('openFileHandler');
	});

	document.querySelector('.create-file').addEventListener('click', () => {
		ipcRenderer.send('createFileHandler');
	});

	document.querySelector('.save-file').addEventListener('click', () => {
		const content = document.querySelector('.file-content').value.toString();
		if (openedFile === '') {
			console.warn('Error while trying to write in empty file!');
		} else ipcRenderer.send('saveFileHandler', openedFile, content);
	});

	document.querySelector('.reset-opened').addEventListener('click', () => {
		document.querySelector('.file-name').innerHTML = '';
		document.querySelector('.file-content').value = '';
		openedFile = '';
	});

	ipcRenderer.on('read-file-success', (event, filename, content) => {
		openedFile = filename;
		document.querySelector('.file-name').innerHTML = ` ${openedFile}`;
		document.querySelector('.file-content').value = content || '';
	});
