import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./config/global"
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter } from 'react-router-dom';
import ThemeContext from './context/ThemeContext';
import SidebarContextProvider from './context/SideBarContext';
import ConnectWalletContext from 'context/ConnectWalletContext';
import TaoInfoContext from 'context/TaoInfoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContext>
        <SidebarContextProvider>
          <ConnectWalletContext>
            <TaoInfoContext>
              <App />
            </TaoInfoContext>
          </ConnectWalletContext>
        </SidebarContextProvider>
      </ThemeContext>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
