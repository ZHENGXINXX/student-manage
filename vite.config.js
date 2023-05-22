import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		}
	},

	server: {
		host: 'localhost',
		port: 9125,
		proxy: {
			// 接口地址代理
			'/api': {
				target: 'http://localhost:8080', // 接口的域名
				secure: false, // 如果是https接口，需要配置这个参数
				changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
				rewrite: path => path.replace(/^\/api/, '')
			},
		}
	},

	css: {
		modules: { // css模块化 文件以.module.[css|less|scss]结尾
			generateScopedName: '[name]__[local]___[hash:base64:5]',
			hashPrefix: 'prefix',
		},
		preprocessorOptions: {
			less: {
				math:'always',
				javascriptEnabled: true,
				additionalData: `@import "${path.resolve(__dirname, 'src/assets/styles/base.less')}";`
			}
		}
	}
});