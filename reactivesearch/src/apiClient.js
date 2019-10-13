import axios from 'axios';

const BASE_URI = 'http://localhost:5000';

const client = axios.create({
    baseURL: BASE_URI,
    json: true
});

class APIClient {
    constructor(text) {
        this.text = text
    }

    emmitLogs(data) {
        return this.perform('post', '/emitlogs', data)
    }

    // createKudo(repo) {
    //     return this.perform('post', '/kudos', repo);
    // }

    // deleteKudo(repo) {
    //     return this.perform('delete', `/kudos/${repo.id}`);
    // }

    // getKudos() {
    //     return this.perform('get', '/kudos');
    // }

    async perform(method, resource, data) {
        return client({
            method,
            url: resource,
            data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(resp => {
            return resp.data ? resp.data : [];
        })
    }
}

export default APIClient;