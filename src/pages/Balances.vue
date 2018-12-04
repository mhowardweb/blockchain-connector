<template>
  <q-page padding>
    <h4 class=" shadow-2 heading">Account Balance ${{totalFiatValue.toFixed(2)}}</h4>
    <vc-donut :sections="donutItems" hasLegend legendPlacement="top">100%</vc-donut>
    <q-toggle class="toggle" v-model="showSmallAssets" label="Hide Small Assets" />

    <q-table
    title="Account Balances"
    :data="filteredItems"
    :columns="columns"
    row-key="assetId"
  />
  </q-page>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';

Vue.use(Donut);

export default {
  name: 'Main',
  data() {
    return {
      columns: [
        {
          name: 'ticker', align: 'left', label: 'Ticker', field: 'ticker', sortable: true,
        },
        {
          name: 'tokens',
          label: 'Tokens',
          align: 'left',
          field: 'tokens',
          sortable: true,

        },
        {
          name: 'fiatValue',
          label: '$ Value',
          align: 'left',
          field: 'fiatValue',
          sortable: true,

        },
        {
          name: 'share',
          label: 'Share',
          align: 'left',
          field: 'share',
          sortable: true,

        },
        {
          name: 'price',
          label: '$ Price',
          align: 'left',
          field: 'tokenPrice',
          sortable: true,

        },
        {
          name: '24h',
          label: '24h',
          align: 'left',
          field: 'change1',
          sortable: true,

        },
        {
          name: '7day',
          label: '7 day',
          align: 'left',
          field: 'change7',
          sortable: true,

        },
      ],
      showSmallAssets: false,
    };
  },
  created() {
    this.$store.dispatch('app/initUserData');
  },
  computed: {
    ...mapGetters({
      historyLoaded: 'history/initialLoaded',
      items: 'balances/getItems',
      totalFiatValue: 'balances/getTotalFiatValue',
      donutItems: 'balances/getItemsDonut',
    }),
    filteredItems() {
      if (!this.showSmallAssets) return this.items;
      return this.items.filter(item => item.fiatValue >= 5);
    },

  },
  methods: {
    getFloatCurrency(n) {
      const value = n.toString().replace(/0+$/, '');
      if (value[0] === '0' && value.length > 9) return value.slice(1, 10);
      return value.slice(0, 9);
    },
    formattedTokens(tokens) {
      return this.getFloatCurrency(tokens);
    },
  },
};
</script>

<style scoped>
.heading {
  background-color: goldenrod;
  text-align: center;
  color: black;
  text-transform: uppercase;
  padding-top: 10px;
  padding-bottom: 10px;
}
.toggle {
  padding-bottom: 30px;
}

</style>
