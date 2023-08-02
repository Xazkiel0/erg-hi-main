import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DetailProductView from '../views/DetailProductView.vue';
import LoginView from '../views/LoginView.vue';

import ProductListView from '../views/admin/ProductListView.vue';
import ProductNewView from '../views/admin/ProductNewView.vue';
import ProductDetailView from '../views/admin/ProductDetailView.vue';
import HeroView from '../views/admin/content/HeroView.vue';
import AboutUsView from '../views/admin/content/AboutUsView.vue';
import ContactUsListView from '../views/admin/content/ContactUsListView.vue';
import ContactUsNewView from '../views/admin/content/ContactUsNewView.vue';

function requireAuth(to, from, next) {
  if ($cookies.get('token')) next();
  else next({ name: 'Login' });
}

function preventAuthPage(to, from, next) {
  if (!$cookies.get('token')) next();
  else next({ name: 'AdminProductList' });
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      beforeEnter: preventAuthPage,
    },
    {
      path: '/',
      name: 'DefaultLayout',
      component: () => import('../layouts/Default.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeView,
        },
        {
          path: ':productId',
          name: 'DetailProduct',
          component: DetailProductView,
        },
      ],
    },
    {
      path: '/admin',
      name: 'AdminLayout',
      component: () => import('../layouts/Admin.vue'),
      beforeEnter: requireAuth,
      children: [
        {
          path: 'products',
          name: 'AdminProductList',
          component: ProductListView,
        },
        {
          path: 'products/new',
          name: 'AdminProductNew',
          component: ProductNewView,
        },
        {
          path: 'products/:productId/edit',
          name: 'AdminProductEdit',
          component: ProductNewView,
        },
        {
          path: 'products/:productId',
          name: 'AdminProductDetail',
          component: ProductDetailView,
        },
        {
          path: 'hero',
          name: 'AdminHero',
          component: HeroView,
        },
        {
          path: 'about-us',
          name: 'AdminAboutUs',
          component: AboutUsView,
        },
        {
          path: 'contact-us',
          name: 'AdminContactUsList',
          component: ContactUsListView,
        },
        {
          path: 'contact-us/new',
          name: 'AdminContactUsNew',
          component: ContactUsNewView,
        },
        {
          path: 'contact-us/:contactId/edit',
          name: 'AdminContactUsEdit',
          component: ContactUsNewView,
        },
      ],
    },
  ],
});

export default router;
