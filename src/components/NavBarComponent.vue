<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue'; // Import defineProps
import DefaultButtonComponent from './DefaultButtonComponent.vue';

// Define the prop that will receive the HeroComponent's DOM element ref
const props = defineProps({
  heroElementRef: {
    type: Object, // It's a ref object, so type Object is appropriate
    default: null
  }
});

const isMenuOpen = ref(false);
const isScrolled = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleScroll = () => {
  if (props.heroElementRef && props.heroElementRef.value) {
    const heroBottom = props.heroElementRef.value.getBoundingClientRect().bottom;
    isScrolled.value = heroBottom <= 0;
  } else {
    // Fallback: This part should ideally not be hit if the ref passing works.
    // If you still want a fallback, keep a default pixel threshold or handle accordingly.
    const scrollThreshold = 600; // Fallback value
    isScrolled.value = window.scrollY > scrollThreshold;
  }
  console.log('isScrolled:', isScrolled.value);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Call once on mount to set initial state
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
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
  position: fixed; 
  top: 0;         
  left: 0;     
  width: 100%;    
  justify-content: space-between;
  background-color: transparent;
  transition: background-color 0.3s ease-in-out;
  z-index: 1000;
}

.navbar--scrolled {
  background-color: white; /* White background when scrolled past hero */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Optional: add a subtle shadow */
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