import axios from 'axios';
import { defineStore } from 'pinia';
import router from '../router';

export const useMemberStore = defineStore('members', {
  state: () => ({
    members: [],
    member: {},
    total: 0,
    hasMore: false,
  }),
  actions: {
    async getAll() {
      try {
        const response = await axios.get('/members/');
        const data = await response.data;
        if (response.status === 200) {
          this.members = [...data.data];
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async getSome(query = '',page = 1, update = false) {
      try {
        const response = await axios.get(`/members/?query=${query}&page=${page}&limit=10`);
        const data = await response.data;
        if (response.status === 200) {
          if (update) {
            this.members = [...data.data];
            this.total = data.total;
          } else {
            this.members.push(...data.data);
          }
          this.hasMore = data.has_more;
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async getOneById(payload) {
      try {
        const response = await axios.get(`/members/${payload.id}/`);
        const data = await response.data;
        if (response.status === 200) {
          this.member = data;
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async uploadFileAndCreate(payload, file) {
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
          this.create(payload);
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async create(payload) {
      try {
        const response = await axios.post('/members/', payload, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 201) {
          router.push({ name: 'AdminMemberList' });
        }
      } catch (err) {
        this.deleteFile(payload.filename);
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
          this.deleteFile(payload.oldFile);
          this.update(id, payload);
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async update(id, payload) {
      try {
        const response = await axios.put(`/members/${id}/`, payload, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 202) {
          router.push({
            name: 'AdminMemberDetail',
            params: { memberId: id },
          });
        }
      } catch (err) {
        if (payload.filename) {
          this.deleteFile(payload.filename);
        }
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
    async delete(id) {
      try {
        const response = await axios.delete(`/members/${id}/`, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 200) {
          router.push({ name: 'AdminMemberList' });
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    resetProduct() {
      this.products = [];
    },
  },
});
