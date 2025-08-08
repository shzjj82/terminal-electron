import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { initializeStores } from './stores/globalStores';
import { initEnvironment } from './utils/env';

// 初始化 stores 并启动应用
async function startApp() {
  try {
    // 初始化环境变量
    await initEnvironment();
    
    // 初始化 stores
    await initializeStores();
    
    ReactDOM.createRoot(document.getElementById('root')!).render(
      // <React.StrictMode>
        <App />
      // </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

startApp();