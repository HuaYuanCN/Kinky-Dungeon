// preload.js

// preload with contextIsolation enabled
const { contextBridge, ipcRenderer, app } = require('electron')


contextBridge.exposeInMainWorld('kdAPI', {
	setFullscreen: () => {
		ipcRenderer.invoke('setFullScreen', true);
	},
	setWindowed: () => {
		ipcRenderer.invoke('setFullScreen', false);
	},
	close: () => {ipcRenderer.invoke('quit');},
	getMods: async () => await ipcRenderer.invoke('getMods'),
	//getFile: async (filePath) => await ipcRenderer.invoke('getFile', filePath),
})