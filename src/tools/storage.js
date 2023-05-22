/**
 * 封装 localStorage 和 sessionStorage
 */
export default class Storage {

    storage;

    constructor(storage) {
        [this.storage] = [storage];
    }

    get(name) {
        const value = this.storage.getItem(name);
        return value !== null ? JSON.parse(value) : null;
    }

    set(name, value) {
        this.storage.setItem(name, JSON.stringify(value));
    }

    append(name, value) {
        let old = this.get(name);
        if (typeof old.length !== 'number') old = [old];
        old.push(value);
        this.set(name, old);
    }

    remove(name) {
        this.storage.removeItem(name);
    }

    getKeys() {
        return [...Array(this.storage.length)].map((_, index) => index).map(k => {
            return this.storage.key(k);
        });
    }

    clear() {
        this.storage.clear();
    }
}

export const sessionDb = new Storage(window.sessionStorage);
export const localDb = new Storage(window.localStorage);
