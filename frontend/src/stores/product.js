import axios from 'axios';
import { defineStore } from 'pinia';
import router from '../router';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    product: {},
    tdidf: {},
    total: 0,
    hasMore: false,
  }),
  actions: {
    async getAll() {
      try {
        const response = await axios.get('/products/?limit=0');
        const data = await response.data;
        if (response.status === 200) {
          this.products = [...data.data];
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async getSome(page = 1, update = false) {
      try {
        const response = await axios.get(`/products/?page=${page}&limit=10`);
        const data = await response.data;
        if (response.status === 200) {
          if (update) {
            this.products = [...data.data];
            this.total = data.total;
          } else {
            this.products.push(...data.data);
          }
          this.hasMore = data.has_more;
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async getOneById(payload) {
      try {
        const response = await axios.get(`/products/${payload.id}/`);
        const data = await response.data;
        if (response.status === 200) {
          this.product = data;
        }
      } catch (err) {
        console.error('[ERROR]: ' + err);
      }
    },
    async getTfIdf(payload) {
      try {
        const response = await axios.get('/products/tfidf/', {
          params: {
            query: payload.query,
          },
        });
        const data = await response.data;
        if (response.status === 200) {
          this.tdidf = { ...data };
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
        const response = await axios.post('/products/', payload, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 201) {
          router.push({ name: 'AdminProductList' });
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
        const response = await axios.put(`/products/${id}/`, payload, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 202) {
          router.push({
            name: 'AdminProductDetail',
            params: { productId: id },
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
        const response = await axios.delete(`/products/${id}/`, {
          headers: {
            Authorization: `Bearer ${$cookies.get('token')}`,
          },
        });
        if (response.status === 200) {
          router.push({ name: 'AdminProductList' });
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
