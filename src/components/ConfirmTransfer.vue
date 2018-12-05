<template>
  <q-page padding>
    <q-dialog
      v-model="dialogShow"
      prevent-close
      @ok="confirm"
      @cancel="cancel"
    >
      <span slot="title">Confirm Transfer</span>
        <div slot="body">
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
        </div>

        <template slot="buttons" slot-scope="props">
          <q-btn color="primary" label="TRANSFER" @click=props.ok />
          <q-btn flat label="No thanks" @click="props.cancel" />
        </template>
      </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { QSpinnerGrid } from 'quasar';

export default {
  data() {
    return {
      dialogShow: false,
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
    transferFee() {
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
      this.$q.loading.show({
        spinner: QSpinnerGrid,
        message: 'Processing Transfer ...',
        messageColor: 'blue',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
      });
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
      } else {
        this.$q.notify(`Transaction error: ${result.error}`);
      }
      this.$q.loading.hide();
      this.$router.replace('balances');
    },
    cancel() {
      this.$router.replace('transfer');
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
  mounted() {
    this.dialogShow = true;
  },
};
</script>

<style scoped>
.confirm {
  padding: 10px;
}
</style>
