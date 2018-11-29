<template>
  <q-page padding>
    <h4 class="shadow-2 heading">Transfer Tokens</h4>
    <q-field
      icon="rotate_right"
      label="Sender"
      helper="Username to send tokens from"
      :placeholder="userName"
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
        <q-input
          type="number"
          v-model.trim="amount"
          @blur="$v.amount.$touch"
        />

        <q-select
          v-model="select"
          :options="selectOptions"
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

    <q-field>
      <q-btn
      color="green"
      :disable="$v.sender.$error || $v.receiver.$error || $v.$invalid"
      @click="handleTransfer"
      >
      Transfer
    </q-btn>
    </q-field>

    <q-modal v-model="opened">
    <h4>Basic Modal</h4>
    <transfer />
    <q-btn
      color="primary"
      @click="opened = false"
      label="Close"
    />
  </q-modal>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import ConfirmTransfer from '../components/ConfirmTransfer.vue';

export default {
  name: 'Transfer',
  components: { transfer: ConfirmTransfer },
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
  },
  data() {
    return {
      opened: 'false',
      sender: '',
      receiver: '',
      amount: '',
      assetId: '',
      memo: '',
      select: '',
      selectOptions: [
        {
          label: 'BTS',
          value: 'BTS',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      userName: 'acc/getCurrentUserName',
      userId: 'acc/getAccountUserId',
      getAssetById: 'assets/getAssetById',
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
        const transaction = {
          assetId: this.coin,
          amount: this.amount,
          to: this.receiver.toLowerCase(),
          memo: this.memo,
        };
        this.setTransaction({ transaction });
        console.log(transaction);
        this.$q.notify('Transaction Pending ...');
        this.opened = 'true';
        // this.$router.push({ name: 'confirm-transactions' });
      }
    },
  },
  mounted() {
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

