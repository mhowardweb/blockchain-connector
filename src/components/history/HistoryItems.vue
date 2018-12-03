<template>
  <div class="operation-item">

    <history-transfer
      v-if="type === 'transfer'"
      :user-id="userId"
      :item="item"/>

    <history-place-order
      v-if="type === 'limit_order_create'"
      :item="item"/>

    <history-fill-order
      v-if="type === 'fill_order'"
      :item="item"/>

    <history-cancel-order
      v-if="type === 'limit_order_cancel'"
      :item="item"/>

  </div>
</template>

<script>
import HistoryTransfer from './HistoryTransfer';
import HistoryPlaceOrder from './HistoryPlaceOrder';
import HistoryFillOrder from './HistoryFillOrder';
import HistoryCancelOrder from './HistoryCancelOrder';

export default {
  name: 'HistoryItems',
  components: {
    HistoryTransfer,
    HistoryPlaceOrder,
    HistoryFillOrder,
    HistoryCancelOrder,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    type() {
      return this.item.type;
    },


  },

};
</script>

<style>
</style>
