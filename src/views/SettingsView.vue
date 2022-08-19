<template>
  <div class="settings">
    <h1>Settings</h1>
    <div class="settings-overview">
      <!-- Account settings, i.e., user information, password, etc. -->
      <ul class="settings-account settings-list">
        <li class="settings-list-item">
          <h4>Username:</h4>
          <input class="settings-change-input" type="text" name="new-username" :value="$store.state.username"
            spellcheck="false" autocomplete="username" @change="newUsername" />
          <button class="settings-change-btn" type="button" @click="changeUsername">Change</button>
        </li>
        <li class="settings-list-item">
          <h4>Locale:</h4>
          <p>{{ $store.state.locale }}</p>
        </li>
        <li class="settings-list-item">
          <h4>Show Clock:</h4>
          <toggle-button @click="$store.commit('toggleShowClock')" :isActive="$store.state.showClock">
          </toggle-button>
        </li>
        <li class="settings-list-item">
          <h4>Show Clock Seconds:</h4>
          <toggle-button @click="$store.commit('toggleShowClockSeconds')" :isActive="$store.state.showClockSeconds">
          </toggle-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.settings {
  display: flex;
  flex-direction: column;
  // align-items: flex-start;
  gap: 0.5rem;

  h1 {
    align-self: flex-start;
  }

  .settings-overview {
    display: flex;
    flex-direction: row;
    background-color: whitesmoke;
    border-radius: 1rem;
    padding: 1rem;
    flex: 1;

    .settings-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      // align-items: flex-start;
      gap: 1rem;
      flex: 1;

      .settings-list-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: space-between;

        .toggle-button {
          //   font-size: 2rem;
          display: flex;
          font-size: 2rem;
        }

        .settings-change-input {
          outline: none;
          border: none;
          background-color: transparent;
          display: flex;
        }

        .settings-change-btn {
          border: none;
          color: white;
          background-color: rgb(0, 122, 255);
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          text-transform: uppercase;
          font-weight: bold;
        }
      }
    }
  }
}
</style>

<script>
import ToggleButton from "@/components/ToggleButton.vue";

export default {
  name: "SettingsView",
  components: { ToggleButton },
  methods: {
    changeUsername() {
      if (this.$store.state.username.toLowerCase() === this.newUsername.toLowerCase()) {
        alert('Same username');
      } else {
        this.$http.post('http://localhost:8090/auth/change-username', {
          username: this.$store.state.username,
          newUsername: this.newUsername,
        }, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          }
        }).then(response => {
          console.debug('Successfully renamed user');
          this.$store.commit('setUsername', this.newUsername);
        }).catch(error => {
          console.error(error);
        });
      }
    }
  },
  data() {
    return {
      newUsername: this.$store.state.username,
    }
  }
}
</script>