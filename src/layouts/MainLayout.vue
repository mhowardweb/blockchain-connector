<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        inverted
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Bitshares Connect
          <div slot="subtitle">A simpler way.</div>
        </q-toolbar-title>

        <div class="person" v-if="userName">
          <q-icon
            size="22px"
            name="person"
          />
          {{userName}}
        </div>

        <div v-if="connected">
          <q-icon
            size="22px"
            color="green"
            name="thumb_up"
          >
            <q-tooltip anchor="bottom left">Connected</q-tooltip>
          </q-icon>
        </div>
        <div v-else>
          <q-icon
            size="22px"
            color="red"
            name="thumb_down"
          >
            <q-tooltip anchor="bottom left">No Connection</q-tooltip>
          </q-icon>
        </div>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Menu</q-list-header>
        <q-item v-if="!isLoggedIn" to="login">
          <q-item-side icon="lock" />
          <q-item-main
            label="Login"
            sublabel="Login to Bitshares"
          />
        </q-item>
        <template v-else>
          <q-item to="balances">
          <q-item-side icon="account_balance_wallet" />
          <q-item-main
            label="Balances"
            sublabel="My Account Balance"
          />
        </q-item>

        <q-item to="transfer">
          <q-item-side icon="payment" />
          <q-item-main
            label="Transfer"
            sublabel="Transfer Funds"
          />
        </q-item>

        <q-item to="voting">
          <q-item-side icon="how_to_vote" />
          <q-item-main
            label="Voting"
            sublabel="Vote for Bitshares "
          />
        </q-item>

        <q-item to="history">
          <q-item-side icon="history" />
          <q-item-main
            label="History"
            sublabel="Account History "
          />
        </q-item>

        <q-item @click.native="handleLogout">
          <q-item-side icon="exit_to_app" />
          <q-item-main
            label="Logout"
            sublabel="Logout "
          />
        </q-item>
        </template>

      </q-list>
    </q-layout-drawer>

    <q-page-container>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
    };
  },
  methods: {
    openURL,
    ...mapActions({
      logout: 'acc/logout',
    }),
    handleLogout() {
      this.$router.replace('login');
      this.logout();
    },
  },
  computed: {
    ...mapGetters({
      connected: 'connection/isReady',
      userName: 'acc/getCurrentUserName',
      isLoggedIn: 'acc/isLoggedIn',
    }),
  },
};
</script>

<style scoped>
.person {
  padding-right: 20px;
  color: rebeccapurple;
}
</style>
