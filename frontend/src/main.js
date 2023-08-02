import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';

import './style.css';
import router from './router';
import App from './App.vue';
import VueCookies from 'vue-cookies';

import { env } from './utils'

axios.defaults.baseURL = env.api_url;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE";
axios.defaults.headers.common["Access-Control-Allow-Headers"] = "Content-Type, X-Requested-With";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(VueCookies);

app.mount('#app');
