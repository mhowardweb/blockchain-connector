<template>
  <q-page padding>
    <h4 class="shadow-2 heading">Account History for {{userName}}</h4>

      <div
        v-show="error || !filteredOperations.length">
        <div
          v-show="!filteredOperations.length">
          No transactions yet
        </div>
        <div
          v-show="error">
          Error when fetching user's transactions
        </div>
      </div>

      <q-list highlight>
      <q-item multiline inset-separator v-for="item in filteredOperations" :key="item.id">
        <q-item-side>
          <q-chip dense square :icon="item.type | historyIcon" color="primary">
            {{item.type | typeTitle}}
          </q-chip>
        </q-item-side>

        <q-item-main>
          <app-history-items
            :item="item"
            :key="item.id"
            :user-id="userId"/>
        </q-item-main>


        <q-item-side right>{{ item.date | relativeTime }} ago</q-item-side>

          </q-item>
       </q-list>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import HistoryItems from '../components/history/HistoryItems.vue';

export default {
  name: 'History',
  components: { appHistoryItems: HistoryItems },
  data() {
    return {

    };
  },
  props: {
    limit: {
      type: Number,
      required: false,
      default: 100,
    },
  },
  computed: {
    ...mapGetters({
      userId: 'acc/getAccountUserId',
      operations: 'operations/getOperations',
      pending: 'operations/isFetching',
      error: 'operations/isError',
      userName: 'acc/getCurrentUserName',
    }),
    sortedOperations() {
      return this.operations.slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
    },
    filteredOperations() {
      if (!this.userId) return [];
      if (this.limit) return this.sortedOperations.slice(0, this.limit);
      return this.sortedOperations;
    },

  },
};
</script>

<style scoped>
.heading {
  background-color: red;
  text-align: center;
  color: white;
  text-transform: uppercase;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
