<template>
  <q-page padding>
    <h4 class=" shadow-2 heading">Bitshares Login</h4>
    <q-tabs inverted>
      <q-tab
        label="Cloud Login"
        default
        slot="title"
        name="tab-1"
        icon="cloud"
      />
      <q-tab
      disabled
        label="File Login"
        slot="title"
        name="tab-2"
        icon="vpn_key"
      />
      <q-tab
      disabled
        label="Sign Up"
        slot="title"
        name="tab-3"
        icon="create_new_folder"
      />

      <q-tab-pane name="tab-1">
        <q-field
          icon="person"
          label="Name"
          helper="Type your name"
          :error="$v.name.$error"
          error-label="Please type a valid name"
          count
        >
          <q-input
            type="text"
            lower-case
            v-model.trim="name"
            @blur="$v.name.$touch"
          />
        </q-field>

        <q-field
          icon="lock"
          label="Password"
          helper="Type your password"
          :error="$v.password.$error"
          error-label="Please type a valid password"
          count
        >
          <q-input
            type="password"
            v-model.trim="password"
            @blur="$v.password.$touch"
          />
        </q-field>
        <q-btn
          color="secondary"
          :disable="$v.name.$error || $v.password.$error || $v.$invalid"
          @click="handleLogin"
        >
          Login
        </q-btn>
      </q-tab-pane>
      <q-tab-pane name="tab-2">File Login</q-tab-pane>
      <q-tab-pane name="tab-3">
        <signup />
      </q-tab-pane>
    </q-tabs>

  </q-page>
</template>

<script>
import { mapActions } from 'vuex';
import { required, minLength, sameAs } from 'vuelidate/lib/validators';
import Signup from '../components/Signup.vue';

export default {
  name: 'Login',
  components: { Signup },
  validations() {
    if (this.type === 'simple cloud') {
      return {
        name: {
          required,
          isUnique(value) {
            if (value === '') return true;
            return new Promise((resolve) => {
              this.checkUsername({ username: value.toLowerCase() })
                .then(result => resolve(!result));
            });
          },
        },
        password: { required },
        brainkey: {},
        pin: {},
        confirmPin: {},
      };
    }
    if (this.file) {
      return {
        name: {},
        password: {},
        brainkey: {},
        pin: { required, minLength: minLength(6) },
        confirmPin: {},
      };
    }
    return {
      name: {},
      password: {},
      brainkey: {
        required: (value) => {
          if (this.file) return true;
          return required(value);
        },
        brainkeyValidator: value => value.split(' ').length - 1 >= 15,
      },
      pin: { required, minLength: minLength(6) },
      confirmPin: { sameAsPin: sameAs('pin') },
    };
  },
  data() {
    return {
      name: '',
      password: '',
      brainkey: '',
      pin: '',
      confirmPin: '',
      inProgress: false,
      type: 'simple cloud',
      file: null,
      showFileField: true,
    };
  },
  methods: {
    ...mapActions({
      checkUsername: 'acc/checkIfUsernameFree',
      cloudLogin: 'acc/cloudLogin',
      brainkeyLogin: 'acc/brainkeyLogin',
      fileLogin: 'acc/fileLogin',
    }),
    async handleLogin() {
      this.$v.$touch();
      if (this.$v.$error) {
        this.$q.notify('Please review fields again.');
        return;
      }
      this.$q.loading.show();
      if (this.type === 'simple cloud') {
        const { error } = await this.cloudLogin({
          name: this.name.toLowerCase(),
          password: this.password,
        });
        if (error) {
          this.$q.notify('Invalid username or password');
          this.name = null;
          this.password = null;
        } else this.$router.push('balances');
      } else {
        if (this.file) {
          this.handleLoginFile();
          return;
        }
        const { error } = await this.brainkeyLogin({
          brainkey: this.brainkey.toLowerCase(),
          password: this.pin,
        });
        if (error) this.$q.notify('Invalid brainkey');
        else this.$router.push('login');
      }
      this.$q.loading.hide();
    },
  },
};
</script>

<style scoped>
.heading {
  background-color: blue;
  text-align: center;
  color: white;
  text-transform: uppercase;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
