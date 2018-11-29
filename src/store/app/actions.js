export function init(store) {
  store.dispatch('connection/initConnection', null, { root: true });
}

export async function initUserData({ rootGetters, dispatch }) {
  console.log('init user data');
  const userId = rootGetters['acc/getAccountUserId'];
  dispatch('assets/fetchDefaultAssets', null, { root: true });
  // dispatch('marketsMonitor/initialize', null, { root: true });
  await dispatch('acc/fetchCurrentUser', userId, { root: true });
  // await Promise.all([
  // dispatch('transactions/fetchComissions', null, { root: true }),
  dispatch('operations/fetchAndSubscribe', { userId, limit: 100 }, { root: true });
  // ])
  // const defaultAssetsIds = rootGetters['assets/getDefaultAssetsIds']
  // defaultAssetsIds.forEach(id => {
  //   if (balances[id]) return
  //   balances[id] = { balance: 0 }
  // })

  const balances = { ...rootGetters['acc/getUserBalances'] };
  await dispatch(
    'assets/fetchAssets',
    {
      assets: Object.keys(balances),
    },
    { root: true },
  );

  const balancesIds = Object.keys(balances);
  balancesIds.push('1.3.121');
  dispatch(
    'history/fetchAll',
    {
      baseId: '1.3.0',
      assetsIds: balancesIds,
      daysArr: [1, 7],
    },
    { root: true },
  );
}

export function unsubFromUserData({ dispatch }) {
  dispatch('operations/unsubscribeFromUserOperations', null, { root: true });
}

export function resetUserData({ dispatch }) {
  dispatch('history/resetHistory', null, { root: true });
  dispatch('operations/unsubscribeFromUserOperations', null, { root: true });
  dispatch('operations/resetState', null, { root: true });
  dispatch('orderBook/deinit', null, { root: true });
}
