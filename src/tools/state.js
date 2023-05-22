import { sessionDb } from './storage.js';

/**
 * 用户登录状态
 */
export default class State {
    defaultState = {
        version: '0.1.0'
    };

    static get isLogin() {
        return !!sessionDb.get('user.login');
    }

    static get userInfo() {
        return sessionDb.get('user.info') || {};
    }

    static get tokenInfo() {
        return sessionDb.get('token.info') || {};
    }

    static set setTokenInfo(tokenInfo) {
        sessionDb.set('token.info', tokenInfo);
    }

    static get permission() {
        return sessionDb.get('user.permission') || {};
    }

    static set permission(permission) {
        sessionDb.set('user.permission', permission);
    }

    static login(userInfo) {
        const { currentToken } = userInfo;
        sessionDb.set('user.login', true);
        sessionDb.set('user.info', userInfo);
        sessionDb.set('token.info', currentToken);
    }

    static logout() {
        sessionDb.clear();
    }

    static switch(data) {
        sessionDb.set('user.switch', data);
    }
}
