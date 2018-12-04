const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'balances', component: () => import('pages/Balances.vue') },
      { path: 'login', component: () => import('pages/Login.vue'), meta: { noAuth: true } },
      { path: 'transfer', component: () => import('pages/Transfer.vue') },
      { path: 'voting', component: () => import('pages/Voting.vue') },
      { path: 'history', component: () => import('pages/History.vue') },
      { path: 'confirm-transfer', component: () => import('components/ConfirmTransfer.vue') },
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

