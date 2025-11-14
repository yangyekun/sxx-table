import {createRouter, createWebHashHistory} from 'vue-router';
import Khzdlxsl from '../views/khzdlxsl/index.vue';
import Tbqxyl from '../views/tbqxyl/index.vue';
import Zdsltj from '../views/zdsltj/index.vue';
import Zrzxs from '../views/zrzxs/index.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/khzdlxsl', name: 'khzdlxsl',component: Khzdlxsl },
    { path: '/tbqxyl', name: 'tbqxyl',component: Tbqxyl },
    { path: '/zdsltj', name: 'zdsltj',component: Zdsltj },
    { path: '/zrzxs', name: 'zrzxs',component: Zrzxs },
    { path: '/', name: 'root', redirect: '/tbqxyl' },
    { path: '/:pathMatch(.*)*', name: 'notFound', redirect: '/tbqxyl' }
  ]
});

export default router;
