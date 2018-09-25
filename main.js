// Basic init
const electron = require('electron')
const { app, BrowserWindow } = electron
const path = require('path');
const url = require('url');

// Let electron reloads by itself
if (process.env.ELECTRON_URL) {
  require('electron-reload')(__dirname)
}

// To avoid being garbage collected
let mainWindow

app.on('ready', () => {
  global.sharedObject = { argv: process.argv }

  let mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 1200,
    minWidth: 700
  })

  const startUrl = process.env.ELECTRON_URL || url.format({
    pathname: path.join(__dirname, './build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);
  mainWindow.maximize();

  if (process.env.DEBUG_ELECTRON) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));

    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});
