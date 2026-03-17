import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Handle WCA OAuth Callback for Implicit Flow
if (window.location.pathname === '/auth/callback') {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get('access_token');
  
  if (accessToken && window.opener) {
    window.opener.postMessage({ type: 'WCA_AUTH_SUCCESS', token: accessToken }, '*');
    window.close();
  } else {
    document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif; color: white; background: #0f172a; height: 100vh;">登入處理中... 如果視窗沒有自動關閉，請手動關閉並回到原網頁。</div>';
    if (window.opener) window.close();
    else window.location.href = '/';
  }
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
