import axios from 'axios';
import { defineStore } from 'pinia';
import router from '../router';

export const useUserStore = defineStore('users', {
  state: () => ({
    user: {},
    error: ""
  }),
  actions: {
    async login(payload) {
      try {
        await axios.post('/login/', payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        router.push('/admin/products');
      } catch (err) {
        this.error = err.response.data.detail
      }
    },
    logout() {
      $cookies.remove('token');
      router.push('/');
    },
  },
});
