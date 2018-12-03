<template>
   <p class="_value">Cancelled order {{ item.payload.order }}</p>
</template>

<script>
export default {
  name: 'HistoryCancelOrder',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
</style>
