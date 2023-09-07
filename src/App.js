import './App.scss';
import Routes from './pages/Routes';
import { ConfigProvider } from 'antd';
import { useThemeContext } from './context/ThemeContext';

function App() {
  const { theme } = useThemeContext()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#323743',
        },
      }}
    >
      <div className={`App dashboard ${theme} min-vh-100`}>
        <Routes />
      </div>
    </ConfigProvider>

  );
}

export default App;
