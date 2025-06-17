<script setup>
import { ref, onMounted } from 'vue';
import NavBarComponent from '../components/NavBarComponent.vue';
import HeroComponent from '../components/HeroComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

const heroSectionRef = ref(null);
onMounted(() => {
  console.log('IndexView mounted, HeroComponent ref:', heroSectionRef.value);
});
</script>

<template>
  <div style="background-color: #FFF2E0;">
    <NavBarComponent :heroElementRef="heroSectionRef" />
    <HeroComponent ref="heroSectionRef" />
    <div style="padding-top: 1em;">
      <div class="container">
        <h1 style="color: #A63700; text-align: center; margin-bottom: 1em;">Bienvenido a Chocolush</h1>
        <p style="color: #664400; text-align: center; font-size: 1.2em; margin-bottom: 2em;">Estas a un paso de probar los mejores dulces</p>

        <div class="cards-grid-container">
          <div class="card product-card">
            <img src="/src/assets/images/ProductosCard1.png" alt="Chocolate and Candy" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">Nuestra Exquisita Selección</h5>
              <p class="card-text">Explore una curada colección de los más finos dulces y chocolates, diseñados para deleitar todos los paladares.</p>
              <div class="card-button-wrapper">
                <a href="#" class="btn btn-primary">Descubrir Productos</a>
              </div>
            </div>
          </div>

          <div class="card product-card">
            <img src="/src/assets/images/BrandsCard2.png" alt="Chocolate and Candy" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">Marcas de Prestigio</h5>
              <p class="card-text">Conozca las renombradas marcas que conforman nuestra oferta, garantizando calidad y sabor inigualables.</p>
              <div class="card-button-wrapper">
                <a href="#" class="btn btn-primary">Explorar Marcas</a>
              </div>
            </div>
          </div>

          <div class="card product-card">
            <img src="/src/assets/images/CalidadCard3.png" alt="Chocolate and Candy" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">Calidad Garantizada</h5>
              <p class="card-text">Nuestra promesa: solo los productos de la más alta calidad, seleccionados de las mejores fuentes a nivel global.</p>
              <div class="card-button-wrapper">
                <a href="#" class="btn btn-primary">Ver Novedades</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="candy-banner">
        <img src="/src/assets/images/bg2x.avif" alt="Mountain of Chocolates and Candies" class="banner-image">
        <div class="banner-content">
            <h2>Deléitese con la Exquisita Dulzura</h2>
            <p>Descubra nuestra selección curada de chocolates gourmet y dulces artesanales, elaborados para deleitar cada paladar.</p>
            <button class="shop-now-btn">Explora Nuestra Colección</button>
        </div>
    </div>
    <div class="feature-box-wrapper">
    <div class="feature-box">
      <div class="text-content">
        <h2 class="feature-title">Verano de S'mores</h2>
        <p class="feature-description">
          Aplasta tus S'mores y crea recuerdos inolvidables, porque ha llegado el momento de reunirse alrededor de la fogata para disfrutar del dulce favorito de todos.
        </p>
        <button class="explore-button">Explore S'mores</button>
      </div>
      <div class="image-content">
        <div class="circular-image-container">
          <img src="/src/assets/images/smores2.png" alt="Delicious S'mores" class="feature-image">
        </div>
      </div>
    </div>
    </div>
    <FooterComponent /> 
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2em;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.col-md-4 {
  flex: 0 0 calc(33.333% - 1em);
  flex-direction: row;
  margin-bottom: 1em;
}


.cards-grid-container {
  display: grid;
  /* On mobile, stack items in a single column */
  grid-template-columns: 1fr;
  gap: 2em; /* Spacing between cards */
  padding: 1em; /* Padding around the grid */
  max-width: 1200px; /* Max width for the container */
  margin: 2em auto; /* Center the container and add vertical margin */
}

/* Media query for tablet and desktop screens */
@media (min-width: 768px) {
  .cards-grid-container {
    /* On larger screens, create 3 columns */
    grid-template-columns: repeat(3, 1fr);
    gap: 2em; /* Spacing between cards */
    padding: 2em; /* Adjust padding for larger screens */
  }
}

/* Card styles */
.product-card {
  border: none;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: box-shadow 0.3s ease;
  display: flex; /* Make card content flex for internal layout */
  flex-direction: column; /* Stack image and body vertically */
  height: 100%; /* Ensure cards fill grid cell height */
}

.product-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  background-color: #FAD0C4;
  padding: 1.5em; /* Add padding to card body */
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Allow card body to grow and fill available space */
  justify-content: space-between; /* Push button to bottom if content varies */
}

.card-title {
  color: #A60000;
  text-align: center;
  font-weight: bold;
  margin-bottom: 0.5em; /* Space below title */
}

.card-text {
  color: #5C4033;
  text-align: center;
  font-size: 0.95em;
  margin-bottom: 1em; /* Space below text */
  flex-grow: 1; /* Allow text to grow, pushing button down */
}

.card-button-wrapper {
  text-align: center;
  margin-top: auto; /* Push the button to the bottom of the card-body */
}

.btn-primary {
  background-color: #A65300;
  border: none;
  padding: 0.75em 1.5em;
  font-weight: bold;
  transition: background-color 0.3s ease;
  display: inline-block; /* Ensure button behaves correctly */
  text-decoration: none; /* Remove underline for links acting as buttons */
  color: white; /* Ensure text color is white */
}

.btn-primary:hover {
  background-color: #8C4500;
}


.candy-banner {
  position: relative;
  width: 100%;
  height: 400px; /* Adjust height as needed */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the area without distortion */
  filter: brightness(0.8); /* Slightly darkens the image for text readability */
}

.banner-content {
  position: absolute;
  text-align: center;
  color: #FFF; /* White text for contrast */

  padding: 0 1em;
  max-width: 80%; /* Prevents text from being too wide */
}

.banner-content h2 {
  font-size: 3em; /* Large, impactful headline */
  margin-bottom: 0.5em;
  color: #FFF8DC; /* Pinkish hue for fun */
}

.banner-content p {
  font-size: 1.5em;
  margin-bottom: 1.5em;
  line-height: 1.4;
  color: #FFF8DC; /* Creamy white */
}

.shop-now-btn {
  background-color: var(--main-color); /* Hot pink button! */
  color: white;
  border: none;
  padding: 1em 2em;
  font-size: 1.2em;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.shop-now-btn:hover {
  background-color: var(--second-color); /* Darker pink on hover */
  transform: translateY(-2px); /* Slight lift on hover */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .candy-banner {
    height: 300px;
  }
  .banner-content h2 {
    font-size: 2em;
  }
  .banner-content p {
    font-size: 1em;
  }
  .shop-now-btn {
    padding: 0.8em 1.5em;
    font-size: 1em;
  }
}

@media (max-width: 480px) {
  .candy-banner {
    height: 250px;
  }
  .banner-content h2 {
    font-size: 1.5em;
  }
  .banner-content p {
    font-size: 0.9em;
  }
  .shop-now-btn {
    padding: 0.7em 1.2em;
    font-size: 0.9em;
  }
}

.feature-box-wrapper {
  padding: 1em; /* Vertical padding */
  margin: 3em 0 3em 0;
  display: flex;
  justify-content: center; /* Center the feature box horizontally */
  width: 100%;
}

.feature-box {
  background-color: #FFECB3; /* Light yellow background for the box itself */
  border-radius: 15px; /* Slightly rounded corners for the box */
  max-width: 1000px; /* Max width to ensure it doesn't take full screen */
  width: 90%; /* Responsive width */
  padding: 3em;
  display: flex;
  align-items: center; /* Vertically align content in the middle */
  gap: 3em; /* Space between text and image */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); /* Subtle shadow for depth */
}

.text-content {
  flex: 1; /* Takes up available space */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start; /* Aligns text to the left */
  padding-right: 2em; /* Space between text and image */
}

.feature-title {
  font-size: 2.8em;
  color: #8B4513; /* Dark brown, similar to chocolate */
  margin-bottom: 0.5em;
  line-height: 1.2;
}

.feature-description {
  font-size: 1.1em;
  color: #5C4033; /* Medium brown for description */
  line-height: 1.6;
  margin-bottom: 2em;
}

.explore-button {
  background-color: #3498db; /* Blue button */
  color: white;
  border: none;
  padding: 0.8em 1.8em;
  font-size: 1.05em;
  font-weight: bold;
  border-radius: 25px; /* Rounded button */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.explore-button:hover {
  background-color: #2980b9; /* Darker blue on hover */
  transform: translateY(-2px);
}

.image-content {
  flex-shrink: 0; /* Prevents image content from shrinking */
  display: flex;
  justify-content: center;
  align-items: center;
}

.circular-image-container {
  width: 300px; /* Size of the circle */
  height: 300px;
  background-color: #FFA000; /* Vibrant orange background for the circle */
  border-radius: 50%; /* Makes it a perfect circle */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Ensures image stays within the circle */
  box-shadow: 0 0 20px rgba(255, 160, 0, 0.6); /* Glow effect for the circle */
}

.circular-image-container img {
  height: 90%;
  width: auto;
}

.feature-image {
  width: 90%; /* Image slightly smaller than container to show orange border */
  height: 90%;
  object-fit: cover; /* Ensures image covers the area */
  border-radius: 50%; /* Make the image itself circular too, for safety */
  display: block; /* Remove extra space below image */
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .feature-box {
    flex-direction: column; /* Stack content vertically on smaller screens */
    text-align: center;
    padding: 2em;
    gap: 2em;
  }
  .text-content {
    padding-right: 0;
    align-items: center; /* Center text on smaller screens */
  }
  .feature-title {
    font-size: 2.2em;
  }
  .feature-description {
    font-size: 1em;
  }
}

@media (max-width: 576px) {
  .feature-box {
    padding: 1.5em;
  }
  .feature-title {
    font-size: 1.8em;
  }
  .circular-image-container {
    width: 200px;
    height: 200px;
  }
}
</style>