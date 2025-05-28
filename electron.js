// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const os = require('node:os')

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 2000,
		height: 1000,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(app.getAppPath(), 'preload.js'),
			nodeIntegration: false,
			contextIsolation: true
		}
	})


	// and load the index.html of the app.
	mainWindow.loadFile('index.html')

	// Open the DevTools.
	//mainWindow.webContents.openDevTools()

	ipcMain.handle('setFullScreen', (event, isFullScreen) => {
	  const currentWindow = BrowserWindow.getFocusedWindow();
	  currentWindow.setFullScreen(isFullScreen);
	});

	ipcMain.handle('quit', (event) => {
	  const currentWindow = BrowserWindow.getFocusedWindow();
	  currentWindow.close();
	});
	
	ipcMain.handle('getMods', async (event) => {
		let fileList = [];
		let ppath = path.join(app.getAppPath(), '../../Mods/');
		if (os?.platform() == 'darwin') {
			ppath = path.join(app.getAppPath(), '../../../../KDMods/');
		}
		fs.readdirSync(ppath).forEach(file => {
			let filePath = ppath + file;
			if (filePath.includes('.zip'))
				fileList.push({base: file, file: fs.readFileSync(filePath)});
		});
		return fileList;
	})

}

app.enableSandbox()
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})
