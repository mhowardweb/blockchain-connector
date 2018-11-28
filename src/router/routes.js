const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 'main', component: () => import('pages/Main.vue') },
      { path: 'transfer', component: () => import('pages/Transfer.vue') },
      { path: 'voting', component: () => import('pages/Voting.vue') },
      { path: 'history', component: () => import('pages/History.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;

