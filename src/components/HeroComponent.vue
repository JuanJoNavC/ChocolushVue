<script setup>
import { onMounted, ref } from 'vue'; // Import ref

const heroSectionRef = ref(null); // Create a ref
onMounted(() => {
  console.log('HeroComponent mounted, ref:', heroSectionRef.value);
});
</script>

<template>
  <div class="page-container">
    <section ref="heroSectionRef" class="hero-section">
      <div class="hero-content-wrapper">

        <div class="hero-text-container">
          <div class="hero-background-lines">
            <img class="lines-img" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/3/curved-lines.png" alt="" />
          </div>

          <div class="hero-text-content">
            <h1 class="hero-title">
              Los mejores productos<br />
              En chocolush
            </h1>
            <p class="hero-description">En Chocolush, te ofrecemos los mejores productos para satisfacer tus antojos de chocolate. Descubre una selección exquisita y de alta calidad, pensada para los verdaderos amantes del chocolate.</p>

            <form action="#" method="POST" class="email-signup-form">
              <div class="form-input-wrapper">
                <div class="form-input-group">
                  <div class="form-input-field">
                    <label for="email" class="sr-only">Email address</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter email to get started"
                      class="email-input"
                      required=""
                    />
                  </div>
                </div>
                <button type="submit" class="submit-button">
                  Try 14 days free
                </button>
              </div>
            </form>
            <p class="form-info">Instant access . No credit card required</p>
          </div>

          <div class="hero-circular-text">
            <img class="circular-text-img" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/3/circular-text.png" alt="" />
          </div>
        </div>

        <div class="hero-image-container">
          <div class="hero-image-overlay">
            <img class="hero-main-img" src="../assets/images/bannerimg2.png" alt="" />
          </div>

          <div class="hero-stats">
            <div class="stats-content">
              <div class="stats-icon-number">
                <svg class="stats-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                </svg>
                <h2 class="stats-number">+ 340</h2>
              </div>
              <p class="stats-description">Han comprado nuestros productos y estan satisfechos</p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  </div>
</template>

<style>
/* Basic Reset & Body Styles */
body {
  margin: 0;
  font-family: sans-serif; /* You can pick a specific font */
  line-height: 1.5;
  color: #000; /* Default text color */
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap; /* added line */
  border-width: 0;
}

/* --- Header Section --- */
.main-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10; /* Ensures header is on top */
  width: 100%;
}

.header-inner {
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem; /* px-4 */
  margin-left: auto;
  margin-right: auto;
  max-width: 1280px; /* Equivalent to a common Tailwind max-w-screen-xl, adjust as needed */
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem; /* h-16 */
}

/* Larger screens (lg:h-20) */
@media (min-width: 1024px) {
  .header-inner {
    height: 5rem; /* h-20 */
  }
}

.header-logo {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
}

.logo-img {
  width: auto;
  height: 2rem; /* h-8 */
}

.hamburger-menu-button {
  display: inline-flex;
  padding: 0.5rem; /* p-2 */
  color: #000;
  transition: all 0.2s; /* transition-all duration-200 */
  border-radius: 0.375rem; /* rounded-md */
  background: none;
  border: none;
  cursor: pointer;
}

/* Hide on larger screens (lg:hidden) */
@media (min-width: 1024px) {
  .hamburger-menu-button {
    display: none;
  }
}

.hamburger-menu-button:focus,
.hamburger-menu-button:hover {
  background-color: #f3f4f6; /* focus:bg-gray-100 hover:bg-gray-100 */
}

.hamburger-icon-closed {
  display: block; /* block w-6 h-6 */
  width: 1.5rem;
  height: 1.5rem;
}

.hamburger-icon-open {
  display: none; /* hidden w-6 h-6 */
  width: 1.5rem;
  height: 1.5rem;
}

/* You'd need JavaScript to toggle these classes based on menu open/close state */
/* For example, if a parent has .menu-open class:
.menu-open .hamburger-icon-closed { display: none; }
.menu-open .hamburger-icon-open { display: block; }
*/

.main-nav {
  display: none; /* hidden ml-auto lg:flex */
  margin-left: auto; /* ml-auto */
  align-items: center; /* lg:items-center */
  justify-content: center; /* lg:justify-center */
}

/* Show on larger screens (lg:flex) */
@media (min-width: 1024px) {
  .main-nav {
    display: flex;
    gap: 2.5rem; /* lg:space-x-10 (40px) */
  }
}

.nav-link {
  font-size: 1rem; /* text-base */
  font-weight: 600; /* font-semibold */
  color: #000;
  transition: all 0.2s; /* transition-all duration-200 */
  text-decoration: none;
}

.nav-link:hover {
  opacity: 0.8; /* hover:text-opacity-80 */
}

.call-to-action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem; /* px-5 py-2.5 */
  font-size: 1rem; /* text-base */
  font-weight: 600; /* font-semibold */
  transition: all 0.2s; /* transition-all duration-200 */
  border-radius: 9999px; /* rounded-full */
  background-color: #f97316; /* bg-orange-500 */
  color: #fff;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.call-to-action-button:hover,
.call-to-action-button:focus {
  background-color: #ea580c; /* hover:bg-orange-600 focus:bg-orange-600 */
}

/* --- Hero Section --- */
.hero-section {
  background-color: #fffbeb; /* bg-yellow-50 */
  overflow: hidden;
}

.hero-content-wrapper {
  display: flex;
  flex-direction: column; /* flex-col */
  min-height: 800px; /* lg:min-h-[800px] - applied to section instead of inner div to simplify */
}

/* Larger screens (lg:flex-row lg:items-stretch) */
@media (min-width: 1024px) {
  .hero-content-wrapper {
    flex-direction: row;
    align-items: stretch;
  }
}

.hero-text-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* Larger screens (lg:order-2 lg:w-7/12) */
@media (min-width: 1024px) {
  .hero-text-container {
    order: 1;
    width: 58.333333%; /* 7/12 */
  }
}

.hero-background-lines {
  position: absolute;
  bottom: 0;
  right: 0;
  display: none; /* hidden lg:block */
}

/* Show on larger screens (lg:block) */
@media (min-width: 1024px) {
  .hero-background-lines {
    display: block;
  }
}

.lines-img {
  object-fit: contain;
  width: auto;
  height: 12rem; /* h-48 */
}

.hero-text-content {
  position: relative;
  padding: 6rem 1rem 4rem 1rem; /* pt-24 pb-16 px-4 */
  text-align: center; /* text-center */
  width: 100%; /* Ensure it takes full width */
}

/* Small screens (sm:px-6 md:px-24 2xl:px-32 lg:py-24 lg:text-left) */
@media (min-width: 640px) {
  .hero-text-content {
    padding-left: 1.5rem; /* sm:px-6 */
    padding-right: 1.5rem; /* sm:px-6 */
  }
}
@media (min-width: 768px) {
  .hero-text-content {
    padding-left: 6rem; /* md:px-24 */
    padding-right: 6rem; /* md:px-24 */
  }
}
@media (min-width: 1024px) {
  .hero-text-content {
    padding-top: 6rem; /* lg:py-24 */
    padding-bottom: 6rem; /* lg:py-24 */
    text-align: left; /* lg:text-left */
  }
}
@media (min-width: 1536px) { /* 2xl breakpoint */
  .hero-text-content {
    padding-left: 8rem; /* 2xl:px-32 */
    padding-right: 8rem; /* 2xl:px-32 */
  }
}


.hero-title {
  font-size: 2.25rem; /* text-4xl */
  font-weight: 700; /* font-bold */
  color: #000;
}

/* Small screens (sm:text-6xl xl:text-8xl) */
@media (min-width: 640px) {
  .hero-title {
    font-size: 3.75rem; /* sm:text-6xl (60px) */
    line-height: 1; /* Adjust line-height as needed for tight fit */
  }
}
@media (min-width: 1280px) {
  .hero-title {
    font-size: 5rem; /* xl:text-8xl (80px) */
    line-height: 1;
  }
}

.hero-description {
  margin-top: 2rem; /* mt-8 */
  font-size: 1.25rem; /* text-xl */
  color: #000;
}

.email-signup-form {
  max-width: 28rem; /* max-w-xl */
  margin-left: auto; /* mx-auto */
  margin-right: auto; /* mx-auto */
  margin-top: 2rem; /* mt-8 */
  background-color: #fff; /* bg-white */
  border-radius: 0.75rem; /* rounded-xl */
}

/* Larger screens (lg:mx-0 sm:bg-transparent lg:mt-12) */
@media (min-width: 640px) {
  .email-signup-form {
    background-color: transparent; /* sm:bg-transparent */
  }
}
@media (min-width: 1024px) {
  .email-signup-form {
    margin-left: 0; /* lg:mx-0 */
    margin-right: 0; /* lg:mx-0 */
    margin-top: 3rem; /* lg:mt-12 */
  }
}


.form-input-wrapper {
  padding: 1rem; /* p-4 */
  display: flex;
  flex-direction: column; /* flex-col items-start */
  align-items: flex-start;
}

/* Small screens (sm:p-2 sm:bg-white sm:border-2 sm:border-transparent sm:rounded-full) */
@media (min-width: 640px) {
  .form-input-wrapper {
    padding: 0.5rem; /* sm:p-2 */
    background-color: #fff; /* sm:bg-white */
    border: 2px solid transparent; /* sm:border-2 sm:border-transparent */
    border-radius: 9999px; /* sm:rounded-full */
    flex-direction: row; /* sm:flex-row */
  }
  .form-input-wrapper:focus-within {
    border-color: #f97316; /* sm:focus-within:border-orange-500 */
    box-shadow: 0 0 0 1px #f97316; /* sm:focus-within:ring-1 sm:focus-within:ring-orange-500 */
  }
}


.form-input-group {
  flex: 1; /* flex-1 */
  width: 100%; /* w-full */
  min-width: 0; /* min-w-0 */
}

.form-input-field {
  position: relative;
  color: #9ca3af; /* text-gray-400 */
}

.form-input-field:focus-within {
  color: #4b5563; /* focus-within:text-gray-600 */
}

.email-input {
  display: block;
  width: 100%;
  padding: 1rem; /* px-4 py-4 */
  font-size: 1rem; /* text-base */
  text-align: center; /* text-center */
  color: #000;
  transition: all 0.2s; /* transition-all duration-200 */
  border: 1px solid transparent; /* border-transparent */
  border-radius: 9999px; /* rounded-full */
  outline: none; /* Remove default outline */
  caret-color: #f97316; /* caret-orange-500 */
}

.email-input::placeholder {
  color: #6b7280; /* placeholder-gray-500 */
}

/* Small screens (sm:text-left focus:border-transparent focus:ring-0) */
@media (min-width: 640px) {
  .email-input {
    text-align: left; /* sm:text-left */
    border-color: transparent; /* focus:border-transparent */
    box-shadow: none; /* focus:ring-0 */
  }
}

.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%; /* w-full */
  padding: 1rem 1rem; /* px-4 py-4 */
  margin-top: 1rem; /* mt-4 */
  font-weight: 600; /* font-semibold */
  color: #fff;
  transition: all 0.2s; /* transition-all duration-200 */
  background-color: #f97316; /* bg-orange-500 */
  border: 1px solid transparent; /* border border-transparent */
  border-radius: 9999px; /* rounded-full */
  cursor: pointer;
}

/* Small screens (sm:w-auto sm:ml-4 sm:mt-0) */
@media (min-width: 640px) {
  .submit-button {
    width: auto; /* sm:w-auto */
    margin-left: 1rem; /* sm:ml-4 */
    margin-top: 0; /* sm:mt-0 */
  }
}

.submit-button:hover,
.submit-button:focus {
  background-color: #ea580c; /* hover:bg-orange-600 focus:bg-orange-600 */
}

.form-info {
  margin-top: 1.25rem; /* mt-5 */
  font-size: 1rem; /* text-base */
  color: #000;
}

.hero-circular-text {
  position: absolute;
  right: 0;
  z-index: 10; /* z-10 */
  bottom: -4rem; /* -bottom-16 */
}

/* Larger screens (lg:top-24 lg:-left-20) */
@media (min-width: 1024px) {
  .hero-circular-text {
    top: 6rem; /* lg:top-24 */
    left: -5rem; /* lg:-left-20 */
    bottom: auto; /* Reset bottom */
  }
}

.circular-text-img {
  width: 8rem; /* w-32 */
  height: 8rem; /* h-32 */
}

/* Medium screens (md:w-40 md:h-40) */
@media (min-width: 768px) {
  .circular-text-img {
    width: 10rem; /* md:w-40 */
    height: 10rem; /* md:h-40 */
  }
}

.hero-image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 24rem; /* h-96 */
}

/* Larger screens (lg:order-1 lg:h-auto lg:w-5/12) */
@media (min-width: 1024px) {
  .hero-image-container {
    order: 2;
    height: auto; /* lg:h-auto */
    width: 41.666667%; /* 5/12 */
  }
}

.hero-image-overlay {
  position: absolute;
  inset: 0; /* top:0; right:0; bottom:0; left:0; */
}

.hero-main-img {
  object-fit: cover;
  width: auto;
  height: 100%;

}

.hero-image-overlay::after { /* Using pseudo-element for gradient */
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to top, rgb(129, 63, 17), transparent, transparent); /* bg-gradient-to-t from-black via-transparent to-transparent */
}

.hero-stats {
  position: absolute;
  bottom: 0;
  left: 0;
}

.stats-content {
  padding: 1rem; /* p-4 */
}

/* Small screens (sm:p-6 lg:p-8) */
@media (min-width: 640px) {
  .stats-content {
    padding: 1.5rem; /* sm:p-6 */
  }
}
@media (min-width: 1024px) {
  .stats-content {
    padding: 2rem; /* lg:p-8 */
  }
}

.stats-icon-number {
  display: flex;
  align-items: center;
}

.stats-icon {
  width: 2.5rem; /* w-10 */
  height: 2.5rem; /* h-10 */
  color: #f97316; /* text-orange-500 */
}

.stats-number {
  font-weight: 700; /* font-bold */
  color: #fff;
  font-size: 4.375rem; /* text-7xl */
  margin-left: 0.625rem; /* ml-2.5 */
}

.stats-description {
  max-width: 16rem; /* max-w-xs */
  margin-top: 0.375rem; /* mt-1.5 */
  font-size: 1.25rem; /* text-xl */
  color: #fff;
}
</style>