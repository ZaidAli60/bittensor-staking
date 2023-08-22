import './App.scss';
import Routes from './pages/Routes';
import { ConfigProvider } from 'antd';
// import { useThemeContext } from './context/ThemeContext';

function App() {
  // const { theme, toggleTheme } = useThemeContext();

  return (
    <div className="App">

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#0d1321',
          },
        }}
      >
        <Routes />
      </ConfigProvider>
      {/* <div className="wrapper">
        <svg>
          <text x="50%" y="50%" dy=".35em" text-anchor="middle">
            Bittensor Staking
          </text>
        </svg>
      </div> */}
    </div>
  );
}

export default App;
