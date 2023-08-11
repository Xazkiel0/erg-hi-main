import axios from 'axios';
import { defineStore } from 'pinia';
import router from '../router';

export const useContactUsStore = defineStore('contact-us', {
  state: () => ({
    contactUs: [],
    contact: {},
  }),
  actions: {
    async getAll() {
      try {
        const response = await axios.get('/contact-us/');
        const data = await response.data;
        if (response.status === 200) {
          this.contactUs = [...data];
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async getOneById(payload) {
      try {
        const response = await axios.get(`/contact-us/${payload.id}/`);
        const data = await response.data;
        if (response.status === 200) {
          this.contact = data;
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async uploadFileAndCreate(payload, file) {
      try {
        const response = await axios.post(
          '/images/',
          { file, category: 'contact-us' },
          {
            headers: {
              Authorization: `Bearer ${$cookies.get('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const data = await response.data;
        if (response.status === 201) {
          payload.filename = data.filename;
          this.create(payload);
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async create(payload) {
      try {
        const response = await axios.post(`/contact-us/`, payload, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 201) {
          router.push({ name: 'AdminContactUsList' });
        }
      } catch (err) {
        if (payload.filename) {
          this.deleteFile(payload.filename);
        }
        console.error('[ERROR]: ' + err);
      }
    },
    async uploadFileAndUpdate(id, payload, file) {
      try {
        const response = await axios.post(
          '/images/',
          { file },
          {
            headers: {
              Authorization: `Bearer ${$cookies.get('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        const data = await response.data;
        if (response.status === 201) {
          payload.filename = data.filename;
          this.update(id, payload);
          this.deleteFile(payload.oldFile);
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async update(id, payload) {
      try {
        const response = await axios.put(`/contact-us/${id}/`, payload, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 202) {
          router.push({ name: 'AdminContactUsList' });
        }
      } catch (err) {
        if (payload.filename) {
          this.deleteFile(payload.filename);
        }
        console.error('[ERROR]: ' + err);
      }
    },
    async delete(id) {
      try {
        const response = await axios.delete(`/contact-us/${id}/`, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 200) {
          window.location.reload();
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async deleteFile(filename) {
      try {
        await axios.delete(`/images/${filename}/`, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
  },
});
