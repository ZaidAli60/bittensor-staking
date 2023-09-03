import './App.scss';
import Routes from './pages/Routes';
import { ConfigProvider } from 'antd';
import { useThemeContext } from './context/ThemeContext';
import { useTaoInfoContext } from 'context/TaoInfoContext';

function App() {
  const { isAppLoading } = useTaoInfoContext()
  const { theme } = useThemeContext()

  return (
    <div className={`App dashboard ${theme} min-vh-100`}>
      {
        !isAppLoading ?
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
                <text x="50%" y="50%" dy=".35em" textAnchor="middle">
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
