import { ConfigProvider } from 'antd';
import './App.scss';
import Routes from './pages/Routes';
// import { useThemeContext } from './context/ThemeContext';

function App() {
  // const { theme, toggleTheme } = useThemeContext();

  return (
    <div className="App">

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '',
          },
        }}
      >
        <Routes />
      </ConfigProvider>
    </div>
  );
}

export default App;
