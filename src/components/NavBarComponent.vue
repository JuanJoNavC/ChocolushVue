<script setup>
import { ref } from 'vue';
import DefaultButtonComponent from './DefaultButtonComponent.vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar__logo">
      <img src="/src/assets/images/ChocoLushLogo.png" alt="Chocolush Logo" />
    </div>

    <button class="navbar__hamburger" @click="toggleMenu">
      <i :class="isMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'"></i>
    </button>

    <ul class="navbar__nav-list" :class="{ 'navbar__nav-list--open': isMenuOpen }">
      <li class="nav-item" @click="isMenuOpen = false">
        <router-link to="/">
          <DefaultButtonComponent text="Home"/>
        </router-link>
      </li>
      <li class="nav-item" @click="isMenuOpen = false">
        <router-link to="/brands">
          <DefaultButtonComponent text="Brand"/>
        </router-link>
      </li>
      <li class="nav-item" @click="isMenuOpen = false">
        <router-link to="/products">
          <DefaultButtonComponent text="Productos"/>
        </router-link>
      </li>
    </ul>

    <ul class="navbar__user-section" :class="{ 'navbar__user-section--hidden': isMenuOpen }">
      <li class="nav-item" @click="isMenuOpen = false">
        <router-link to="/user-profile">
          <i class="fas fa-user"></i>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  height: 6em;
  padding: 0 1.5em;
  position: relative;
  justify-content: space-between;
}

.navbar__logo {
  display: flex;
  align-items: center;
  font-size: 1.8em;
  font-weight: bold;
  color: #4a2c2a;
  margin-right: 20px;
}

.navbar__logo img {
  height: 2em;
  width: auto;
  margin-right: 0.5em;
}

.navbar__hamburger {
  display: none; /* Hidden by default on desktop */
  background: none;
  border: none;
  color: #4a2c2a;
  font-size: 1.5em;
  cursor: pointer;
}

.navbar__nav-list {
  display: flex; /* Always flex on desktop */
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar__user-section {
  display: flex; /* Always flex on desktop */
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-left: auto;
}

.navbar .nav-item {
  margin-left: 3em;
}

.navbar .nav-item a {
  text-decoration: none;
}

.navbar .nav-item i {
  font-size: 1.5em;
  color: #3c0d0d;
}
.navbar .nav-item i:hover {
  font-size: 1.5em;
  color: #a0522d;
}

/* ---------------------------------------------------- */
/* Mobile Styles (Max-width 768px) */
@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap; /* Allows items to wrap to the next line */
    padding: 1em;
    justify-content: space-between; /* Keeps logo and hamburger on opposite ends */
  }

  .navbar__logo {
    margin-right: 0; /* Remove margin on mobile */
  }

  .navbar__logo img {
    height: 1.5em;
    width: auto;
  }

  .navbar__hamburger {
    display: block; /* Show hamburger button on mobile */
  }

  .navbar__nav-list {
    display: none; /* Hidden by default on mobile */
    flex-direction: column;
    width: 100%; /* Takes full width when displayed */
    margin-top: 1em;
    text-align: center; /* Center the buttons/links */
  }

  /* When menu is open, display the nav list */
  .navbar__nav-list--open {
    display: flex;
  }

  .navbar__user-section {
    display: none; /* Hide user section by default on mobile */
  }

  /* Optionally show user section within the open menu if desired,
     or keep it hidden like this. If you want it in the menu, move
     its HTML into navbar__nav-list and handle its display there. */
  .navbar__user-section--hidden {
    display: none;
  }

  .navbar .nav-item {
    margin: 0.5em 0; /* Adjust vertical spacing for menu items */
    width: 100%; /* Make each item take full width */
    text-align: center;
  }

  .navbar .nav-item a {
    display: block; /* Make router-link fill the item space */
    width: 100%;
    padding: 1em 0; /* Add padding for clickable area */
  }
}
</style>