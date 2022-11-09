import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from '@/plugins/axios';
import VueAxios from 'vue-axios';
import App from '@/App.vue';

import '@/styles/main.scss';

const app = createApp(App);

app.use(createPinia());

app.use(VueAxios, axios);

app.provide('axios', app.config.globalProperties.axios);

app.mount('#app');
