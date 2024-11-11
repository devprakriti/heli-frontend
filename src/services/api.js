import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cmsapidev.luckyluy.net/', // Example API
});

export default {
  getRules() {
    return api.get('/posts'); // Example: replace with real API
  },
  createRule(data) {
    return api.post('/posts', data); // Example
  },
  updateRule(id, data) {
    return api.put(`/posts/${id}`, data); // Example
  }
};
