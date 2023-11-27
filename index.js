//////////////////////////////////////////////////////////////////////
/**
 * @author SUGIMURA Hiroshi
 * @copyright © 2023.11.01 Sugimura Laboratory, KAIT
 * @license MIT
 */
//////////////////////////////////////////////////////////////////////
'use strict'

const axios = require('axios');
const { createHmac, randomUUID } = require('crypto');

/**
 * SwitchBot clientクラス
 * SwitchBotのWebAPIを利用して状態取得や状態変更を実施する。
 * ユーザのTokenとSecretKeyが必要で、取得方法は公式に書いてあります。公式のドキュメントはこのモジュールのReadmeに参照先がかいてあります。
 */
class SwitchBotHandler {
    /** @member {string} token */
    token;
    /** @member {string} secret */
    secret;
    /** @member {object} http client */
    client;

    /**
     * コンストラクタ
     * @param {string} token - switch bot token
     * @param {string} secret - switch bot secret
     */
    constructor(token, secret) {
        this.token = token;
        this.secret = secret;

        this.client = axios.create({
            baseURL: 'https://api.switch-bot.com',
            headers: {
                Authorization: this.token

            },
            responseType: 'json'
        })

    }

    /**
     * デバイスリストを取得する。デバイスリストを取得したらcallback関数を呼ぶ。
     * @param {function} callback - user function
     */
    getDevices(callback) {
        // 'GET /v1.1/devices'
        this.getRequest("/v1.1/devices", callback);
    }

    /**
     * デバイスリストを同期的に取得する。デバイスリストを取得したらreturnする。getDevicesのほうがパフォーマンスに優れる。
     * @async
     * @return {string}
     */
    async getDevicesSync() {
        // GET /v1.1/devices
        const res = this.getRequestSync("/v1.1/devices");
        return res;
    }

    /**
     * デバイスの状態取得
     * @param {function} callback - user function
     */
    getDeviceStatus(callback) {
        this.getRequest(`/v1.1/devices/${deviceId}/status`, callback);
    }

    /**
     * デバイスの状態取得
     * @async
     * @param {string} deviceId - deviceId
     * @return {string}
     */
    async getDeviceStatusSync(deviceId) {
        // GET /v1.1/devices/{deviceId}/status
        const res = this.getRequestSync(`/v1.1/devices/${deviceId}/status`);
        return res;
    }

    /**
     * デバイスの状態変更
     * @param {string} deviceId
     * @param {string} _command
     * @param {string} _params
     * @param {function} callback
     */
    setDeviceStatus(deviceId, _command, _params, callback) {
        const body = {
            command: _command,
            parameter: _params,
            commandType: 'command'
        }
        this.postRequest(`/v1.1/devices/${deviceId}/commands`, body, callback);
    }

    /**
     * デバイスの状態変更
     * @async
     * @param {string} deviceId
     * @param {string} _command
     * @param {string} _params
     * @return {string}
     */
    async setDeviceStatusSync(deviceId, _command, _params) {
        // GET /v1.1/devices/{deviceId}/commands
        const body = {
            command: _command,
            parameter: _params,
            commandType: 'command'
        };
        const res = this.postRequestSync(`/v1.1/devices/${deviceId}/commands`, body);
        return res;
    }

    //================================================================
    // inner function

    /**
     * 内部関数：情報取得
     * @param {string} path
     * @param {function} callback
     * @throws error
     */
    getRequest(path, callback) {
        const res = this.client.get(path, { headers: this.getRequestHeaders() })
            .then(response => {
                callback(response.data.body);
            })
            .catch(error => {
                throw error;
            });
    }

    /**
     * 内部関数：情報取得
     * @async
     * @param {string} path
     * @return {string}
     */
    async getRequestSync(path) {
        const res = await this.client.get(path, { headers: this.getRequestHeaders() });

        return res.data.body;
    }


    /**
     * 内部関数：情報書き込み
     * @param {string} path
     * @param {string} body
     * @param {function} callback
     * @throws error
     */
    postRequest(path, body, callback) {
        this.client.post(path, body, { headers: { ...this.getRequestHeaders(), "Content-Type": "application/json" } })
            .then(response => {
                callback(response.data.body);
            })
            .catch(error => {
                throw error;
            });
    }

    /**
     * 内部関数：情報書き込み
     * @async
     * @param {string} path
     * @param {string} body
     * @return {string}
     */
    async postRequestSync(path, body) {
        const response = await this.client.post(path, body, {
            headers: {
                ...this.getRequestHeaders(),
                "Content-Type": "application/json"
            }
        })
        return response.data;
    }

    ////////////////////////////////////////////////////////
    // inner

    /**
     * 内部構造体：通信用HTTPヘッダ
     * @typedef {Object} Headers
     * @property {string} sign - Hmac
     * @property {string} nonce - random UUID
     * @property {Date} t - time
     */

    /**
     * 内部関数：通信用HTTPヘッダ生成
     * @return {Headers} request headers for switch bot
     */
    getRequestHeaders() {
        const t = Date.now();
        const nonce = randomUUID();
        const data = this.token + t + nonce;
        const sign = createHmac("sha256", this.secret).update(Buffer.from(data, 'utf-8')).digest().toString('base64');
        return { sign, nonce, t };
    }
}


module.exports = { SwitchBotHandler };
//////////////////////////////////////////////////////////////////////
// EOF
//////////////////////////////////////////////////////////////////////
