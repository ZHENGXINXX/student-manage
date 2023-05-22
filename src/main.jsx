import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/view';
import './index.less';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ConfigProvider locale={zhCN}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ConfigProvider>
	</React.StrictMode>,
);
