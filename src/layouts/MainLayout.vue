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

        <div v-if="userName">
          <q-icon
            size="22px"
            color="red"
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
        <q-item to="login">
          <q-item-side icon="lock" />
          <q-item-main
            label="Login"
            sublabel="Login to Bitshares"
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
      </q-list>
    </q-layout-drawer>

    <q-page-container>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar';
import { mapGetters } from 'vuex';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
    };
  },
  methods: {
    openURL,
  },
  computed: {
    ...mapGetters({
      connected: 'connection/isReady',
      userName: 'acc/getCurrentUserName',
    }),
  },
};
</script>

<style>
</style>
