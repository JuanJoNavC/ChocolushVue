<template>
  <div class="brands-view">
    <NavBarComponent class="navbar-products"/>

    <div class="promociones">
      <h2 class="titulo-promociones">Todas nuestras marcas</h2>
      <p style="font-size: small !important;">Un portafolio de las marcas mas delicionas</p>
      <div class="logo-row">
        <div class="logo-card hover-red" data-brand="KitKat" @click="navigateToBrand('KitKat')">
          <img src="../assets/images/kitkat2.png" alt="Logo KitKat">
        </div>
        <div class="logo-card hover-purple" data-brand="Brachs" @click="navigateToBrand('Brachs')">
          <img src="../assets/images/brachs-logo.png" alt="Logo Brachs">
        </div>
        <div class="logo-card hover-blue" data-brand="Nerds" @click="navigateToBrand('Nerds')">
          <img src="../assets/images/nerds-logo.png" alt="Logo Nerds">
        </div>
        <div class="logo-card hover-red2" data-brand="JellyBelly" @click="navigateToBrand('JellyBelly')">
          <img src="../assets/images/jelly-belly-logo.png" alt="Logo Jelly Belly">
        </div>
        <div class="logo-card hover-cian" data-brand="Feastables" @click="navigateToBrand('Feastables')">
          <img src="../assets/images/Feastables_logo_2023_Upscaled.png" alt="Logo Feastables">
        </div>
        <div class="logo-card hover-red" data-brand="ChupaChups" @click="navigateToBrand('ChupaChups')">
          <img src="../assets/images/Chupa_Chups_logo.png" alt="Logo ChupaChups">
        </div>
        <div class="logo-card hover-purple" data-brand="Milka" @click="navigateToBrand('Milka')">
          <img src="../assets/images/Milka-logo.png" alt="Logo Milka">
        </div>
        <div class="logo-card hover-yellow" data-brand="Twix" @click="navigateToBrand('Twix')">
          <img src="../assets/images/twix-logo.png" alt="Logo Twix">
        </div>
      </div>
    </div>

    <div class="pie">
      <FooterComponent />
    </div>
  </div>
</template>

<script>
import NavBarComponent from '../components/NavBarComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'BrandsView',
  components: {
    NavBarComponent,
    FooterComponent
  },
  methods: {
    navigateToBrand(brand) {
      this.$router.push({ path: '/products', query: { brand: brand } });
    }
  }
};
</script>

<style scoped>
.navbar-products {
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}


.promociones {
  background-color: #feebd0;
  padding: 20px;
  margin-top: 6em;
  text-align: center;
}

.titulo-promociones {
  color: #3f000b;
  font-size: 2em !important;
  font-weight: bold;
  margin-bottom: 20px;
}

.logo-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2em;
  padding: 2em;
}

.logo-card {
  background-color: #f8f3f0;
  border-radius: 1em;
  width: 20em;
  height: 20em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.5s ease;
}

/* Hover color variants */
.logo-card.hover-red:hover {
  background-color: #e62125;
}

.logo-card.hover-purple:hover {
  background-color: #ce97e4;
}

.logo-card.hover-cian:hover {
  background-color: #7bcdda;
}

.logo-card.hover-yellow:hover {
  background-color: #f7a900;
}

.logo-card.hover-red2:hover {
  background-color: #ed1c24;
}

.logo-card.hover-purple2:hover {
  background-color: #684ea4;
}

.logo-card.hover-blue:hover {
  background-color: #003088;
}

.logo-card img {
  max-width: 40%;
  height: auto;
}

@media (max-width: 768px) {
  .logo-card {
    width: 50%;
    margin-bottom: 0.5em;
  }
}

@media (max-width: 480px) {
  .logo-card {
    width: 80%;
  }
}

/* Footer */
.pie {
  background-color: #ffffff;
  color: #3f000b;
  text-align: center;
  padding: 10px 0;
  position: relative;
  bottom: 0;
  width: 100%;
}

/* General Body Styling (from your provided CSS) */
body {
  font-family: "DynaPuff", system-ui;
  margin: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: #feebd0; /* Apply the light background to the body */
}
</style>