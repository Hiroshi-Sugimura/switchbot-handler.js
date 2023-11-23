//////////////////////////////////////////////////////////////////////
/**
 * @file index.js
 * @author SUGIMURA Hiroshi
 * @copyright © 2023.11.01 Sugimura Laboratory, KAIT
 * @license MIT
 */
//////////////////////////////////////////////////////////////////////
'use strict'

const axios = require('axios');
const { createHmac, randomUUID } = require('crypto');

/**
 * @class SwitchBotHandler
 * @desc SwitchBot client
 */
class SwitchBotHandler {
    /** @member {string} token */
    token;
    /** @member {string} secret */
    secret;
    /** @member {object} http client */
    client;

    /**
     * @constrauctors
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
     * @func getDevices
     * @param {function} callback - user function
     */
    getDevices(callback) {
        // 'GET /v1.1/devices'
        this.getRequest("/v1.1/devices", callback);
    }

    /**
     * @async
     * @func getDevicesSync
     * @return {string}
     */
    async getDevicesSync() {
        // GET /v1.1/devices
        const res = this.getRequestSync("/v1.1/devices");
        return res;
    }

    /**
     * @func getDeviceStatus
     * @param {function} callback - user function
     */
    getDeviceStatus(callback) {
        this.getRequest(`/v1.1/devices/${deviceId}/status`, callback);
    }

    /**
     * @async
     * @func getDeviceStatusSync
     * @param {string} deviceId - deviceId
     * @return {string}
     */
    async getDeviceStatusSync(deviceId) {
        // GET /v1.1/devices/{deviceId}/status
        const res = this.getRequestSync(`/v1.1/devices/${deviceId}/status`);
        return res;
    }

    /**
     * @func setDeviceStatus
     * @param {string} deviceId
     * @param {string} _command
     * @param {string} _params
     * @param {function} callback
     */
    setDeviceStatus(deviceId, _command, _params, callback) {
        const body = {
            command: _command,
            parameters: _params,
            commandType: 'command'
        }
        this.postRequest(`/v1.1/devices/${deviceId}/commands`, body, callback);
    }

    /**
     * @async
     * @func setDeviceStatusSync
     * @param {string} deviceId
     * @param {string} _command
     * @param {string} _params
     * @return {string}
     */
    async setDeviceStatusSync(deviceId, _command, _params) {
        // GET /v1.1/devices/{deviceId}/commands
        const body = {
            command: _command,
            parameters: _params,
            commandType: 'command'
        };
        const res = this.postRequestSync(`/v1.1/devices/${deviceId}/commands`, body);
        return res;
    }

    //================================================================
    // inner function

    /**
     * @func getRequest
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
     * @async
     * @func getRequestSync
     * @param {string} path
     * @return {string}
     */
    async getRequestSync(path) {
        const res = await this.client.get(path, { headers: this.getRequestHeaders() });

        return res.data.body;
    }


    /**
     * @func postRequest
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
     * @async
     * @func postRequestSync
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
     * @typedef {Object} Headers
     * @property {string} sign - Hmac
     * @property {string} nonce - random UUID
     * @property {Date} t - time
     */

    /**
     * @func getRequestHeaders
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
