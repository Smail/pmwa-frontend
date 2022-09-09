<template>
  <div class="settings">
    <h1>Settings</h1>
    <div class="settings-overview">
      <!-- Account settings, i.e., user information, password, etc. -->
      <ul class="settings-account settings-list">
        <li class="settings-list-item">
          <h4>Username:</h4>
          <input v-model="newUser.username" class="settings-change-input"
                 name="new-username" spellcheck="false" type="text"/>
          <button class="settings-change-btn" type="button" @click="updateUser">Change</button>
        </li>
        <li class="settings-list-item">
          <h4>Display name:</h4>
          <input v-model="newUser.displayName" class="settings-change-input"
                 name="new-display-name" spellcheck="false" type="text"/>
          <button class="settings-change-btn" type="button" @click="updateUser">Change</button>
        </li>
        <li class="settings-list-item">
          <h4>Locale:</h4>
          <p>{{ $store.state.locale }}</p>
        </li>
        <li class="settings-list-item">
          <h4>Show Clock:</h4>
          <toggle-button :isActive="$store.state.showClock" @click="$store.commit('toggleShowClock')">
          </toggle-button>
        </li>
        <li class="settings-list-item">
          <h4>Show Clock Seconds:</h4>
          <toggle-button :isActive="$store.state.showClockSeconds" @click="$store.commit('toggleShowClockSeconds')">
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
    margin: 0;
    align-self: stretch;
    text-align: left;
    background-color: whitesmoke;
    padding: 1rem;
    border-radius: 1rem;
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
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
  },
  methods: {
    async updateUser() {
      try {
        await this.$store.dispatch("updateUser", this.newUser);
      } catch (error) {
        console.error(error);
        this.newUser.displayName = this.$store.state.user.displayName;
        alert("Could not update the display name. Please try again.");
      }
    },
  },
  data() {
    return {
      newUser: {
        username: this.$store.state.user.username,
        displayName: this.$store.state.user.displayName,
      },
    };
  },
};
</script>
