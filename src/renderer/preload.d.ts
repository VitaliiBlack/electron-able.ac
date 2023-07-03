import { ElectronHandler } from 'main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electronHandler: ElectronHandler;
    envApi: {
      Platform: string;
    };
    headerButtonsActions: {
      hide: () => void;
      minMax: () => void;
      close: () => void;
    };
    showNotification: (title: string, body: string) => void;
    showContextMenu: (event: any) => void;
  }
}

export {};
