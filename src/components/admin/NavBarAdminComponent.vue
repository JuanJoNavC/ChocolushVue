<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar__logo">
      <img src="/src/assets/images/ChocoLushLogo.png" alt="Chocolush Logo" />
    </div>

    <button class="navbar__hamburger" @click="toggleMenu">
      <i :class="isMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'"></i>
    </button>

    <ul class="navbar__nav-list desktop-nav-items">
      <li class="nav-item">
        <router-link to="/">
          <DefaultButtonComponent text="Home"/>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/productos">
          <DefaultButtonComponent text="Productos"/>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/facturas">
          <DefaultButtonComponent text="Facturas"/>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/clientes">
          <DefaultButtonComponent text="Clientes"/>
        </router-link>
      </li>
    </ul>

    <ul class="navbar__user-section desktop-nav-items">
      <li class="nav-item">
        <router-link to="/iniciarSesion">
          <i class="fas fa-user"></i>
        </router-link>
      </li>
    </ul>

    <div class="offcanvas-backdrop" :class="{ 'offcanvas-backdrop--open': isMenuOpen }" @click="toggleMenu"></div>

    <div class="offcanvas-menu" :class="{ 'offcanvas-menu--open': isMenuOpen }">
      <ul class="offcanvas-nav-list">
        <li class="offcanvas-close-button">
          <button @click="toggleMenu"><i class="fa-solid fa-times"></i></button>
        </li>
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
        <li class="nav-item offcanvas-user-icon" @click="isMenuOpen = false">
          <router-link to="/iniciarSesion">
            <i class="fas fa-user"></i>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue';
import DefaultButtonComponent from '../DefaultButtonComponent.vue';

const props = defineProps({
  heroElementRef: {
    type: Object,
    default: null
  }
});

const isMenuOpen = ref(false);
const isScrolled = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  // Prevent scrolling on the body when the menu is open on mobile
  // and reset when closed or when screen size changes to desktop
  if (window.innerWidth <= 768) { // Only apply this for mobile sizes
    if (isMenuOpen.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
};

const handleScroll = () => {
  if (props.heroElementRef && props.heroElementRef.value) {
    const heroBottom = props.heroElementRef.value.getBoundingClientRect().bottom;
    isScrolled.value = heroBottom <= 0;
  } else {
    const scrollThreshold = 600;
    isScrolled.value = window.scrollY > scrollThreshold;
  }
};

const handleResize = () => {
  // If screen size becomes larger than mobile, close menu and reset overflow
  if (window.innerWidth > 768 && isMenuOpen.value) {
    isMenuOpen.value = false;
    document.body.style.overflow = '';
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize); // Add resize listener
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize); // Remove resize listener
  document.body.style.overflow = ''; // Ensure body overflow is reset
});
</script>

<style scoped>
/* Base Navbar Styles (apply to both desktop and mobile as default) */
.navbar {
  display: flex;
  align-items: center;
  height: 6em;
  padding: 0 1.5em;
  top: 0;
  left: 0;
  width: 100%;
  justify-content: space-between;
  background-color: white;
  transition: background-color 0.3s ease-in-out;
  z-index: 1000;
}

.navbar--scrolled {
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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

/* Hamburger button - Hidden by default on desktop */
.navbar__hamburger {
  display: none;
  background: none;
  border: none;
  color: #4a2c2a;
  font-size: 1.5em;
  cursor: pointer;
  z-index: 1002; /* Ensure hamburger is above offcanvas */
}

/* Desktop navigation specific items (visible by default) */
.desktop-nav-items {
  display: flex; /* Default for desktop */
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar__user-section.desktop-nav-items {
  margin-left: auto; /* Push user section to the right */
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
  color: #a0522d;
}

/* Offcanvas related elements - Hidden by default on desktop */
.offcanvas-backdrop,
.offcanvas-menu {
  display: none; /* Hide offcanvas elements on desktop by default */
}


/* ---------------------------------------------------- */
/* Mobile Styles (Max-width 768px) */
@media (max-width: 768px) {
  .navbar {
    padding: 1em;
  }

  .navbar__logo img {
    height: 1.5em;
  }

  /* Show hamburger button on mobile */
  .navbar__hamburger {
    display: block;
  }

  /* Hide desktop-specific nav elements on mobile */
  .desktop-nav-items {
    display: none;
  }

  /* Offcanvas Backdrop - ONLY display on mobile when menu is open */
  .offcanvas-backdrop {
    display: block; /* Show the backdrop for mobile */
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
    z-index: 1000; /* Below the offcanvas menu */
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .offcanvas-backdrop--open {
    opacity: 1;
    visibility: visible;
  }

  /* Offcanvas Menu - ONLY display on mobile and slide in/out */
  .offcanvas-menu {
    display: flex; /* Show the offcanvas menu for mobile */
    position: fixed;
    top: 0;
    left: 0; /* Start from the left edge */
    width: 70%; /* Adjust width as needed */
    max-width: 300px; /* Max width for tablets */
    height: 100vh;
    background-color: white;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    z-index: 1001;
    transform: translateX(-100%); /* Initially hidden off-screen to the left */
    transition: transform 0.3s ease-in-out;
    padding: 1em;
    flex-direction: column;
    overflow-y: auto;
  }

  .offcanvas-menu--open {
    transform: translateX(0); /* Slide into view */
  }

  .offcanvas-nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .offcanvas-nav-list .nav-item {
    margin: 0;
    padding: 0.8em 0;
    border-bottom: 1px solid #eee;
  }

  .offcanvas-nav-list .nav-item:last-of-type {
    border-bottom: none;
  }

  .offcanvas-nav-list .nav-item a {
    display: block;
    padding: 0.5em 1em;
    color: #4a2c2a;
    text-decoration: none;
    font-size: 1.1em;
    transition: background-color 0.2s ease;
  }

  .offcanvas-nav-list .nav-item a:hover {
    background-color: #f0f0f0;
  }

  .offcanvas-nav-list .nav-item .default-button {
    width: 100%;
    text-align: left;
    padding: 0.5em 1em;
    justify-content: flex-start;
    background: none;
    border: none;
    color: #4a2c2a;
    font-size: 1.1em;
  }
  .offcanvas-nav-list .nav-item .default-button:hover {
      background-color: #f0f0f0;
  }

  .offcanvas-close-button {
    text-align: right;
    padding-bottom: 1em;
  }

  .offcanvas-close-button button {
    background: none;
    border: none;
    font-size: 1.8em;
    color: #4a2c2a;
    cursor: pointer;
    padding: 0.5em;
  }

  .offcanvas-user-icon {
    padding-top: 1em;
    text-align: left;
  }
  .offcanvas-user-icon i {
    font-size: 1.8em;
    padding-left: 1em;
  }
}
</style>