<template>
  <div class="container">
    <div class="container-2">
      <router-link :to="to" class="link">
        <div class="view">
          <span class="material-symbols-outlined">{{ icon }}</span>
          <span class="name">{{ name }}</span>
        </div>
      </router-link>
      <button v-if="subMenu.length > 0" class="expand-btn" @click="toggleSubMenuExpand">
        <span v-show="!isSubMenuExpanded" class="material-symbols-outlined">expand_less</span>
        <span v-show="isSubMenuExpanded" class="material-symbols-outlined">expand_more</span>
      </button>
    </div>
    <ul v-if="subMenu.length > 0" v-show="isSubMenuExpanded" class="sub-menu-list">
      <li v-for="subMenuItem in subMenu">
        <router-link :to="subMenuItem.to" class="link">
          <div class="view">
            <span class="material-symbols-outlined">{{ subMenuItem.icon }}</span>
            <span class="name">{{ subMenuItem.name }}</span>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "NavBarLink",
  props: {
    icon: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    subMenu: {
      type: Array,
      default: [],
    },
  },
  methods: {
    toggleSubMenuExpand() {
      this.isSubMenuExpanded = !this.isSubMenuExpanded;
    },
  },
  data() {
    return {
      isSubMenuExpanded: false,
    };
  },
};
</script>

<style lang="scss">
.expand-btn {
  background: transparent;
  border: none;
}

.navbar {
  .container {
    display: flex;
    flex-direction: column;

    .container-2 {
      display: flex;
    }

    .link {
      flex: 1;
      display: flex;
      border-radius: 0.5em;
      transition: all 250ms;

      .view {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.5em;
        text-transform: capitalize;
        padding: 0.5em 0.5em 0.5em 0.5rem;

        & .material-symbols-outlined {
          font-size: 1.5em;
        }
      }

      &.router-link-exact-active {
        color: white;
        box-shadow: 0 0 0.5em rgb(0, 122, 255);
        background-color: rgb(0, 122, 255);
      }

      &:hover {
        color: white;
        box-shadow: 0 0 0.5em rgb(106, 178, 255);
        background-color: rgb(106, 178, 255);
      }

      &:active {
        opacity: 70%;
      }
    }

    .expand-btn {
      padding: 0.25em;
      border-radius: 0.5em;
      transition: all 250ms;

      &:hover {
        color: white;
        box-shadow: 0 0 0.5em rgb(106, 178, 255);
        background-color: rgb(106, 178, 255);
      }

      &:active {
        opacity: 70%;
      }
    }

    .sub-menu-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: 0.65rem;

      .link {
        $color: rgb(255, 45, 85);

        &.router-link-exact-active {
          color: white;
          box-shadow: 0 0 0.5em $color;
          background-color: $color;
        }

        &:hover {
          color: white;
          box-shadow: 0 0 0.5em $color;
          background-color: lighten($color, 10);
        }
      }
    }
  }
}
</style>
