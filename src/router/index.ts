import { createRouter, createWebHistory } from 'vue-router';

const APP_NAME = 'Google Books';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
    	path: '/home',
    	name: 'home',
    	component: () => import('../views/Home.vue'),
    },
    {
      path: '/book/:id',
      name: 'book-details',
      component: () => import('../views/BookDetails.vue')
    }
  ],
});

router.afterEach((to) => {
  document.title = (to.meta.title as string) || APP_NAME;
});

export default router;
