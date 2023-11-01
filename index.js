//////////////////////////////////////////////////////////////////////
//	Copyright (C) Hiroshi SUGIMURA 2023.10.01
//////////////////////////////////////////////////////////////////////
'use strict'

const axios = require('axios');
const { createHmac, randomUUID } = require('crypto');

/**
 * @class SwitchBot
 * @desc SwitchBot client
 */
class SwitchBot {
    token;
    secret;
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
     * @func getDevicesSync
     */
    async getDevicesSync() {
        // GET /v1.1/devices
        const res = this.getRequestSync("/v1.1/devices");
        return res;
    }

    /**
     * @func getDeviceStatus
     */
    getDeviceStatus(callback) {
    }

    /**
     * @func getDeviceStatusSync
     */
    async getDeviceStatusSync(deviceId) {
        // GET /v1.1/devices/{deviceId}/status
        const res = this.getRequestSync(`/v1.1/devices/${deviceId}/status`);
        return res;
    }

    /**
     * @func getRequest
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
     * @func getRequestSync
     */
    async getRequestSync(path) {
        const res = await this.client.get(path, { headers: this.getRequestHeaders() });

        return res.data.body;
    }

    /**
     * @func getRequestHeaders
     */
    getRequestHeaders() {
        const t = Date.now();
        const nonce = randomUUID();
        const data = this.token + t + nonce;
        const sign = createHmac("sha256", this.secret).update(Buffer.from(data, 'utf-8')).digest().toString('base64');
        return { sign, nonce, t };
    }

    /**
     * @func postRequestSync
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
}


module.exports = { SwitchBot };
//////////////////////////////////////////////////////////////////////
// EOF
//////////////////////////////////////////////////////////////////////
