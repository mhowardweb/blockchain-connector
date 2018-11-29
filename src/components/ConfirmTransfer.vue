<template>
<div class="">
        <div v-if="hasPendingTransfer">
            <div>
                <p class="">Send {{ transfer.realamount }}
                   {{ transfer.asset.symbol }} to {{ transfer.to }}</p>
                <p></p>
                <p class="_value" v-if="transfer.memo">With memo: {{ transfer.memo }}</p>
                <p class="_value">Transaction fee {{ transferFee.base }} BTS
                  ({{ transferFee.fiat }}$)</p>
                </div>
        </div>
        <div v-else>NO PENDING TRANSFER !</div>

      <q-btn color="primary" icon="check" label="Confirm" v-show="!pending" @click="confirm" />

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
      const realamount = (amount * (10 ** -asset.precision)).toFixed(asset.precision);
      return {
        asset, realamount, to, memo,
      };
    },
    withdrawFee() {
      const fee = this.getMemoFee(this.withdraw.memo);
      return (fee * (10 ** -5)).toFixed(5);
    },
    withdraw() {
      const { fee, address, memo } = this.pendingTransfer;
      const { realamount, asset } = this.transfer;
      const finalamount = realamount - fee;
      const amount = finalamount.toFixed(asset.precision);
      return {
        amount, address, fee, memo,
      };
    },
    isWithdraw() {
      const { withdraw } = this.pendingTransfer;
      if (withdraw) {
        return true;
      }
      return false;
    },
    transferFee() {
      const transferFeeBase = (this.transferPrice * (10 ** -5));
      const transferFeeFiat = transferFeeBase * this.fiatMultiplier;
      return {
        base: transferFeeBase.toFixed(5),
        fiat: transferFeeFiat.toFixed(5),
      };
    },
    totalOrderFees() {
      const baseValue = (this.orders.length * this.orderFee) / (10 ** 5);
      const fiatValue = baseValue * this.fiatMultiplier;
      return {
        base: baseValue.toFixed(5),
        fiat: fiatValue.toFixed(5),
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
