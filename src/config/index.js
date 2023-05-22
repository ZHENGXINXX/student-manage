export const baseConfig = {
    service: {
        // 生产环境和开发环境地址不一样
        // eslint-disable-next-line no-undef
        baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://23.213.134.109:9123',
        // eslint-disable-next-line no-undef
        proxy: process.env.NODE_ENV === 'development' ? 'http://localhost:9125/api' : 'http://23.213.134.109:9123/api'
    }
};