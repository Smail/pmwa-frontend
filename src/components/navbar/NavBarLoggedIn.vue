<template>
  <nav class="navbar">
    <user-avatar></user-avatar>

    <hr v-if="$store.state.showClock">
    <clock v-if="$store.state.showClock"></clock>

    <hr>

    <ul class="links">
      <li v-for="menuItem in menu" class="menu">
        <nav-bar-link :icon="menuItem.icon" :name="menuItem.name" :sub-menu="menuItem.subMenu" :to="menuItem.routeName"
                      class="wrapper"></nav-bar-link>

        <!--        <router-link :to="menuItem.href" class="menu-link">-->
        <!--          <div class="menu-title">-->
        <!--            <span v-if="menuItem.icon" class="material-symbols-outlined">{{ menuItem.icon }}</span>-->
        <!--            {{ menuItem.name }}-->
        <!--          </div>-->
        <!--          <ul v-show="menuItem.subMenu && menuItem.subMenu.length > 0" class="sub-menu-list">-->
        <!--            <li v-for="subMenu in menuItem.subMenu">-->
        <!--              <router-link :to="`${menuItem.href}/filter/tags/${subMenu}`" class="menu-link">-->
        <!--                {{ subMenu }}-->
        <!--              </router-link>-->
        <!--            </li>-->
        <!--          </ul>-->
        <!--        </router-link>-->
      </li>

      <!-- Log out button -->
      <li class="menu" style="margin-top: auto">
        <nav-bar-link class="wrapper" icon="logout" name="Log out" to="logout"
                      @click="$store.dispatch('logOut')"></nav-bar-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import UserAvatar from "@/components/navbar/UserAvatar";
import Clock from "@/components/navbar/Clock";
import NavBarLink from "@/components/navbar/NavBarLink";

export default {
  name: "NavBarLoggedIn",
  components: { NavBarLink, Clock, UserAvatar },
  data() {
    const tasks = {
      name: "Todo", href: "/tasks", icon: "check", routeName: "tasks"
    };

    const data = {
      menu: [
        { name: "Dashboard", href: "/dashboard", icon: "space_dashboard", routeName: "dashboard" },
        tasks,
        { name: "Calendar", href: "/calendar", icon: "calendar_month", routeName: "calendar" },
        { name: "Flashcards", href: "/flashcards", icon: "school", routeName: "flashcards" },
        { name: "Projects", href: "/projects", icon: "view_kanban", routeName: "projects" },
        { name: "Settings", href: "/settings", icon: "settings", routeName: "settings" },
      ],
    };

    // Load tasks submenu
    // axios.get('tasks/tags/names').then(response => {
    //   for (const tagName of response.data) {
    //     this.menu[1].subMenu.push({
    //       name: tagName,
    //       icon: 'sell',
    //       to: 'filter'
    //     });
    //   }
    //   console.log(data.menu[1])
    // });

    return data;
  },
};
</script>

<style scoped>
.wrapper {
  flex: 1;
}

.logged-in {
  flex-direction: column;
}

.menu-link {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.menu-title {
  display: flex;
  align-items: center;
  justify-items: center;
  gap: 0.5rem;
}

.sub-menu-list {

}
</style>
