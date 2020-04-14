const { app, BrowserWindow, Menu, Tray } = require('electron');
const isDevMode = require('electron-is-dev');
const { CapacitorSplashScreen, configCapacitor } = require('@capacitor/electron');

const path = require('path');

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = true;

const iconPath = path.join(__dirname, 'images', process.platform === 'win32' ? 'icon.ico' : 'icon.png');

// Create simple menu for easy devtools access, and for demo
const menuTemplate = [];

const appMenu = { role: 'appMenu' };
const fileMenu = { role: 'fileMenu' };
const editMenu = { role: 'editMenu' };
const windowMenu = { role: 'windowMenu' };

const devMenu = {
  label: 'Options',
  submenu: [
    { role: 'toggleDevTools', label: 'Dev Tools', accelerator: 'F12' },
    { role: 'reload' },
    { role: 'forceReload' },
  ],
}

async function createWindow () {
  // Mac only
  if (app.dock) {
    app.dock.setIcon(iconPath);
  }
  // Define our main window size
  mainWindow = new BrowserWindow({
    icon: iconPath,
    height: 920,
    width: 1600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js')
    }
  });

  configCapacitor(mainWindow);

  if (process.platform === 'darwin') {
    menuTemplate.push(appMenu);
  } else {
    menuTemplate.push(fileMenu);
  }
  menuTemplate.push(editMenu, windowMenu);

  if (isDevMode) {
    menuTemplate.push(devMenu);
  }

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  if(useSplashScreen) {
    splashScreen = new CapacitorSplashScreen(mainWindow, {
      imageFileName: 'splash.png',
      windowHeight: 800,
      windowWidth: 600,
      loadingText: 'Starting Pinpoint',
      textColor: '#7fc35c',
      textPercentageFromTop: 85
    });
    splashScreen.init();
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.show();
    });
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', startup);

function startup() {
  createWindow();
  buildTrayMenu();
}

function buildTrayMenu() {
  const trayIcon = 'icon.ico';
  tray = new Tray(path.join(__dirname, 'images', trayIcon));
  tray.on('double-click', () => mainWindow.show());
  tray.setToolTip(app.getName());
  tray.setContextMenu(Menu.buildFromTemplate([
    { role: 'quit' }
  ]));
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Define any IPC or other custom functionality below here
