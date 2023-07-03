/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { BrowserView, BrowserWindow, Menu, Notification, app, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

interface Coordinates {
  xPosition: number;
  yPosition: number;
  widthPosition: number;
  heightPosition: number;
}

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

let view: BrowserView | null = null;
const coordinates: Coordinates | null = {
  xPosition: 0,
  yPosition: 0,
  widthPosition: 0,
  heightPosition: 0,
};
const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 1024,
    minHeight: 728,
    icon: getAssetPath('icon.png'),
    frame: false,
    titleBarStyle: 'hiddenInset',
    movable: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webviewTag: true,
      contextIsolation: true,
    },
  });

  if (process.platform === 'darwin') {
    mainWindow.setWindowButtonVisibility(true);
  }

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined, please check the context of createWindow.');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // BrowserView add
  ipcMain.on('browserViewOpen', (event, arg) => {
    coordinates!.xPosition = Math.floor(arg?.x);
    coordinates!.yPosition = Math.floor(arg?.y);
    coordinates!.widthPosition = Math.floor(arg?.width);
    coordinates!.heightPosition = Math.floor(arg?.height);

    mainWindow?.setBrowserView(view);

    view?.setBounds({
      x: coordinates!.xPosition,
      y: coordinates!.yPosition,
      width: coordinates!.widthPosition,
      height: coordinates!.heightPosition,
    });
    if (!view?.webContents.canGoBack()) {
      view?.webContents.loadURL('https://google.com');
    }
  });

  ipcMain.on('browserViewHide', () => {
    mainWindow?.removeBrowserView(view!);
  });

  ipcMain.on('browserViewUrl', (event, args) => {
    view?.webContents.loadURL(args);
  });

  view = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      webviewTag: true,
      accessibleTitle: 'BrowserView',
      javascript: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      safeDialogs: true,
      enablePreferredSizeMode: true,
    },
  });
  view.setAutoResize({
    width: true,
    height: true,
    horizontal: true,
    vertical: true,
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};
ipcMain.on('hideWindow', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('minMaxWindow', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('close', () => {
  if (mainWindow) {
    mainWindow?.close();
    mainWindow = null;
    app.exit(0);
  }
});

ipcMain.on('showNotification', (event, title, body) => {
  const notification = new Notification({
    title,
    body,
    urgency: 'normal',
    closeButtonText: 'Close',
    timeoutType: 'default',
    icon: path.join(__dirname, '../../assets/icon.png'),
  })
    .addListener('click', (e) => {
      console.log('clicked', event, e);
    })
    .addListener('close', (e) => {
      console.log('closed', event, e);
    });
  notification.show();
});

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
  app.exit(0);
});

app.on('web-contents-created', (event, contents) => {
  contents.on('context-menu', (e, params) => {
    let { x, y } = params;
    if (contents.getType() === 'browserView') {
      x += coordinates!.xPosition;
      y += coordinates!.yPosition;
    }

    Menu.buildFromTemplate([
      {
        label: 'Save selected text',
        click: () => {
          const { pageURL, selectionText } = params;
          view!.webContents.send('save-selected', { content: { pageURL, selectionText } });
          mainWindow!.webContents.send('save-selected', { content: { pageURL, selectionText } });
        },
      },
    ]).popup({ window: mainWindow!, x, y });
  });
});

app.setAboutPanelOptions({
  applicationName: 'electron-able.ac ',
  applicationVersion: '0.0.1',
  version: '0.0.1',
  credits: 'electron-able.ac',
  authors: ['Vitalii Hrybinyk'],
  website: 'https://github.com/VitaliiBlack/electron-able.ac',
  iconPath: path.join(__dirname, '../../assets/icon.png'),
});

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch((e) => {
    console.error(e);
  });
