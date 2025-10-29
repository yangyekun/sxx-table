import {createRouter, createWebHashHistory} from 'vue-router';
import Khzdlxsl from '../views/khzdlxsl/index.vue';
import Tbqxyl from '../views/tbqxyl/index.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/khzdlxsl', name: 'khzdlxsl',component: Khzdlxsl },
    { path: '/tbqxyl', name: 'tbqxyl',component: Tbqxyl },
    { path: '/', name: 'root', redirect: '/tbqxyl' },
    { path: '/:pathMatch(.*)*', name: 'notFound', redirect: '/tbqxyl' }
  ]
});

export default router;
