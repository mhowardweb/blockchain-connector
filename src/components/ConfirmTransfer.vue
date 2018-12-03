<template>
<div class="confirm">
  <div v-if="!hasPendingTransfer">NO PENDING TRANSFER !</div>
     <q-list v-else>
      <q-list-header>Confirm Transfer</q-list-header>
      <q-item>
        Send {{ transfer.realamount }} {{ transfer.asset.symbol }}
      </q-item>
      <q-item>
        To {{ transfer.to }}
      </q-item>
      <q-item v-if="transfer.memo">
        With Memo: {{ transfer.memo }}
      </q-item>
      <q-item>
        Transaction Fee: {{ transferFee.base }} BTS
      </q-item>
      <q-item>
        <q-btn color="primary" icon="check" label="Confirm" v-show="!pending" @click="confirm" />
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters({
      pendingTransfer: 'transactions/getPendingTransfer',
      hasPendingTransfer: 'transactions/hasPendingTransfer',
      pending: 'transactions/areTransactionsProcessing',
      getAssetById: 'assets/getAssetById',
      getMarketPriceById: 'market/getPriceById',
      getMemoFee: 'transactions/getMemoPrice',
      transferPrice: 'transactions/getTransferFee',
      getHistoryAssetMultiplier: 'history/getHistoryAssetMultiplier',
    }),
    transfer() {
      const {
        assetId, amount, to, memo,
      } = this.pendingTransfer;
      const asset = this.getAssetById(assetId);
      console.log('Asset', asset);
      const realamount = (amount * (10 ** -asset.precision)).toFixed(asset.precision);
      return {
        asset, realamount, to, memo,
      };
    },
    transferFee() {
      console.log('Transfer Price', this.transferPrice);
      const transferFeeBase = (this.transferPrice * (10 ** -5));
      return {
        base: transferFeeBase.toFixed(5),
      };
    },
  },
  methods: {
    ...mapActions({
      processPendingOrders: 'transactions/processPendingOrders',
      removePendingDistribution: 'transactions/removePendingDistribution',
      transferAsset: 'transactions/transferAsset',
      clearPendingTransfer: 'transactions/clearPendingTransfer',
    }),
    async confirm() {
      if (this.hasPendingTransfer) this.processTransfer();
    },
    async processTransfer() {
      console.log('TRANSFER!');
      console.log(this.pendingTransfer.to);
      const params = {
        to: this.pendingTransfer.to,
        assetId: this.pendingTransfer.assetId,
        amount: this.pendingTransfer.amount,
      };

      if (this.pendingTransfer.memo) {
        params.memo = this.pendingTransfer.memo;
      }

      const result = await this.transferAsset(params);
      if (result.success) {
        this.$q.notify('Transaction completed');
        // this.$router.push({ name: 'entry' });
      } else {
        this.$q.notify(`Transaction error: ${result.error}`);
      }
    },
  },
  beforeDestroy() {
    this.clearPendingTransfer();
    this.removePendingDistribution();
  },
  created() {
    if (!this.hasPendingTransfer) {
      this.$q.notify('Unable to create Transfer, try again');
    }
  },
};
</script>

<style scoped>
.confirm {
  padding: 10px;
}
</style>
