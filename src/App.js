import './App.scss';
import Routes from './pages/Routes';
import { ConfigProvider } from 'antd';
import { useThemeContext } from './context/ThemeContext';

function App() {
  const { isAppLoader, setIsAppLoader, theme } = useThemeContext()

  setTimeout(() => {
    setIsAppLoader(false)
  }, 6000);

  return (
    <div className={`App dashboard ${theme} min-vh-100`}>
      {
        !isAppLoader ?
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#323743',
              },
            }}
          >
            <Routes />
          </ConfigProvider>
          :
          <div className="screen-loader">
            <div className="wrapper">
              <svg>
                <text x="50%" y="50%" dy=".35em" text-anchor="middle">
                  Bittensor Staking
                </text>
              </svg>
            </div>
          </div>
      }
    </div>
  );
}

export default App;
