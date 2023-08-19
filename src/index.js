import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ThemeContext from './context/ThemeContext';
import SidebarContextProvider from './context/SideBarContext';
import ValidatorsContext from 'context/ValidatorsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContext>
        <SidebarContextProvider>
          <ValidatorsContext>
            <App />
          </ValidatorsContext>
        </SidebarContextProvider>
      </ThemeContext>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
