import Vue from 'vue';
import Vuex from 'vuex';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import vuexBitshares from 'vuex-bitshares';
import app from './app';
// import orderHistory from './orderHistory';

Vue.filter('relativeTime', (value) => {
  let time = distanceInWordsStrict(new Date(), value);
  time = time.replace('hours', 'h');
  time = time.replace('hour', 'h');
  time = time.replace('minutes', 'm');
  time = time.replace('minute', 'm');
  return time;
});

Vue.filter('historyIcon', (value) => {
  switch (value) {
    case 'limit_order_create':
      return 'add';
    case 'fill_order':
      return 'check';
    case 'limit_order_cancel':
      return 'remove';
    case 'transfer':
      return 'redo';
    default:
      return value;
  }
});

Vue.filter('typeTitle', (value) => {
  switch (value) {
    case 'limit_order_create':
      return 'Place order';
    case 'fill_order':
      return 'Fill order';
    case 'limit_order_cancel':
      return 'Cancel order';
    case 'transfer':
      return 'Transfer';
    default:
      return value;
  }
});

const { modules } = vuexBitshares;

Vue.use(Vuex);

window.crypto.randomBytes = require('randombytes');

const store = new Vuex.Store({
  modules: {
    ...modules,
    app,
    // orderHistory,
  },
});

export default store;
