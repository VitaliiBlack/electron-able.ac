import {
  FaRegListAlt,
  FaRegSave,
  FaWindowClose,
  FaWindowMaximize,
  FaWindowMinimize,
} from 'react-icons/fa';
import { Outlet } from 'react-router-dom';
import ButtonLink from '../ButtonLink/ButtonLink';

function Layout() {
  return (
    <>
      <header className="header">
        <div className="header-wrapper">
          <div className="menu-buttons">
            <ButtonLink to="/">
              <FaRegSave className="image" />
              <p>Highlight webview</p>
            </ButtonLink>
            <ButtonLink to="BrowserView">
              <FaRegSave className="image" />
              <p>Highlight BrowserView</p>
            </ButtonLink>
            <ButtonLink to="Highlighted">
              <FaRegListAlt className="image" />
              <p>Highlighted list</p>
            </ButtonLink>
          </div>
          {window.envApi.Platform !== 'darwin' && (
            <div className="context-menu-buttons">
              <button
                className="header-button"
                type="button"
                onClick={() => {
                  window.headerButtonsActions.hide();
                }}
              >
                <FaWindowMinimize className="context-button-icon" />
              </button>
              <button
                className="header-button"
                type="button"
                onClick={() => {
                  window.headerButtonsActions.minMax();
                }}
              >
                <FaWindowMaximize className="context-button-icon" />
              </button>
              <button
                className="header-button"
                type="button"
                onClick={() => {
                  window.headerButtonsActions.close();
                }}
              >
                <FaWindowClose className="context-button-icon" />
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="content-wrapper">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
