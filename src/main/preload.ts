// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

interface ForSaving {
  content: {
    selectionText: string;
    pageURL: string;
  };
}

interface Coordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

const envApi = {
  Platform: process.platform,
};
// ToDo: remake this
const electronHandler = {
  ipcRenderer: {
    on(channel: 'save-selected', func: (forSaving: ForSaving) => void) {
      const subscription = (_event: IpcRendererEvent, forSaving: ForSaving) => func(forSaving);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },

    sendOpen(channel: 'browserViewOpen', coordinates: Coordinates) {
      ipcRenderer.send(channel, coordinates);
    },

    sendHide(channel: 'browserViewHide', coordinates: Coordinates) {
      ipcRenderer.send(channel, coordinates);
    },
    sendUrl(channel: 'browserViewUrl', url: string) {
      ipcRenderer.send(channel, url);
    },
  },
};

const headerButtonsActions = {
  hide: () => {
    ipcRenderer.send('hideWindow');
  },
  minMax: () => {
    ipcRenderer.send('minMaxWindow');
  },
  close: () => {
    ipcRenderer.send('close');
  },
};

const showNotification = (title: string, body: string) => {
  ipcRenderer.send('showNotification', title, body);
};

const showContextMenu = (event: any) => {
  ipcRenderer.send('show-context-menu', event);
};

contextBridge.exposeInMainWorld('electronHandler', electronHandler);
contextBridge.exposeInMainWorld('envApi', envApi);
contextBridge.exposeInMainWorld('headerButtonsActions', headerButtonsActions);
contextBridge.exposeInMainWorld('showNotification', showNotification);
contextBridge.exposeInMainWorld('showContextMenu', showContextMenu);

export type ElectronHandler = typeof electronHandler;
export type EnvApi = typeof envApi;
export type HeaderButtonsActions = typeof headerButtonsActions;
export type ShowNotification = typeof showNotification;
export type ShowContextMenu = typeof showContextMenu;
