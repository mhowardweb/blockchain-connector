<template>
  <q-page padding>
    <!-- <q-modal v-model="opened" :content-css="{minWidth: '50vw'}">
    <transfer />
    <q-btn style="margin: 20px;"
      color="secondary"
      @click="opened = false"
      label="Cancel"
    />
  </q-modal> -->

    <h4 class="shadow-2 heading">Transfer Tokens</h4>
    <q-field
      icon="rotate_right"
      label="Sender"
      helper="Username to send tokens from"
      :error="$v.sender.$error"
      error-label="Please type a valid Username"
      count
    >
      <q-input
        type="text"
        lower-case
        v-model.trim="sender"
        @blur="$v.sender.$touch"
      />
    </q-field>

    <q-field
      icon="rotate_left"
      label="Receiver"
      helper="Username to receive tokens"
      :error="$v.receiver.$error"
      error-label="Please type a valid Username"
      count
    >
      <q-input
        type="text"
        lower-case
        v-model.trim="receiver"
        @blur="$v.receiver.$touch"
      />
    </q-field>

    <q-field
      icon="attach_money"
      label="Amount"
      helper="Amount to Send"
      :error="$v.amount.$error"
      error-label="Please type a valid Amount"
    >
      <div class="row no-wrap">
        {{balances.tokens}}
        <q-input
          type="number"
          v-model.trim="amount"
          @blur="$v.amount.$touch"
        />

        <q-select
          radio
          v-model="assetId"
          :options="selectOptions"
          separator
          inverted
        />
      </div>
    </q-field>

    <q-field
      icon="border_color"
      label="Memo (optional)"
      helper="Memo to Send (optional)"
      :error="$v.memo.$error"
      error-label="Please type a valid Memo"
      count
    >
      <q-input
        type="text"
        v-model.trim="memo"
        @blur="$v.memo.$touch"
      />
    </q-field>

    <q-field
      icon="border_color"
      label="Fee"
      helper="Fee"
      :error="$v.fee.$error"
      error-label=""
     >
      <q-input
        type="number"
        disabled
        v-model.trim="fee"
        @blur="$v.fee.$touch"
      />
    </q-field>


    <q-field>
      <q-btn
      color="green"
      :disable="$v.sender.$error || $v.receiver.$error || $v.$invalid"
      @click="handleTransfer"
      >
      Transfer
    </q-btn>
    </q-field>


  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
// import ConfirmTransfer from '../components/ConfirmTransfer.vue';

export default {
  name: 'Transfer',
  // components: { transfer: ConfirmTransfer },
  validations: {
    sender: { required },
    receiver: {
      required,
      isUnique(value) {
        if (value === '') return true;
        return new Promise((resolve) => {
          this.checkUsername({ username: value.toLowerCase() }).then(result => resolve(!result));
        });
      },
      notSelf(value) {
        return value.toLowerCase() !== this.userName;
      },
    },
    amount: { required },
    memo: {},
    fee: {},
  },
  data() {
    return {
      opened: false,
      // sender: '',
      receiver: '',
      amount: '',
      memo: null,
      fee: null,
      assetId: '1.3.0',
      selectOptions: [],
    };
  },
  computed: {
    ...mapGetters({
      sender: 'acc/getCurrentUserName',
      userId: 'acc/getAccountUserId',
      getAssetById: 'assets/getAssetById',
      balances: 'balances/getItems',
    }),
  },
  methods: {
    ...mapActions({
      checkUsername: 'acc/checkIfUsernameFree',
      setTransaction: 'transactions/setPendingTransfer',
    }),
    handleTransfer() {
      this.$v.$touch();
      if (!this.$v.$invalid && this.amount) {
        const asset = this.getAssetById(this.assetId);
        const transaction = {
          assetId: this.assetId,
          amount: (this.amount * (10 ** asset.precision)),
          to: this.receiver.toLowerCase(),
          memo: this.memo,
          fee: this.fee,
        };
        this.setTransaction({ transaction });
        this.$q.notify('Transaction Pending ...');
        // this.opened = 'true';
        this.$router.push('confirm-transfer');
      }
    },
    setOptions() {
      const setBalances = this.balances;
      for (let i = 0; i < setBalances.length; i += 1) {
        setBalances[i].value = setBalances[i].assetId;
        delete setBalances[i].assetId;
        setBalances[i].label = setBalances[i].ticker;
        delete setBalances[i].ticker;
        setBalances[i].sublabel = setBalances[i].tokens;
        delete setBalances[i].tokens;
      }
      const removed = setBalances.map((data) => {
        const { value, label, sublabel } = data;
        return { value, label, sublabel };
      });
      this.selectOptions = removed;
    },
  },
  created() {
    this.$store.dispatch('app/initUserData');
    this.setOptions();
    if (!this.userId) {
      this.$q.notify('You are not Logged in !');
    }
  },
};
</script>

<style scoped>
.heading {
  background-color: green;
  text-align: center;
  color: white;
  text-transform: uppercase;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>

