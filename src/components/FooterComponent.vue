<template>
  <footer class="main-footer">
    <div class="footer-content-wrapper">
      <div class="footer-top-section">
        <div class="footer-brand">
          <img src="/src/assets/images/ChocoLushLogo.png" alt="ChocoLush Logo" class="footer-logo">
          <div class="social-icons">
            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          </div>
        </div>

        <div class="footer-links">
          <div class="footer-column">
            <h5>Empresa</h5>
            <ul>
              <li><a href="#">Sobre Nosotros</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Nuestra Historia</a></li>
              <li><a href="#">Carreras</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h5>Productos</h5>
            <ul>
              <li><a href="#">Chocolates</a></li>
              <li><a href="#">Dulces</a></li>
              <li><a href="#">Ediciones Especiales</a></li>
              <li><a href="#">Personalizados</a></li>
              <li><a href="#">Tiendas</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h5>Soporte</h5>
            <ul>
              <li><a href="#">Preguntas Frecuentes</a></li>
              <li><a href="#">Contacto</a></li>
              <li><a href="#">Envíos</a></li>
              <li><a href="#">Devoluciones</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-cta">
          <button class="cta-button">¡Compra Ahora!</button>
          <p class="cta-slogan">Endulza tu día con ChocoLush.</p>
        </div>
      </div>

      <div class="footer-bottom-section">
        <p class="copyright">© {{ currentYear }} ChocoLush. Todos los derechos reservados.</p>
        <div class="legal-links">
          <a href="#">Términos y Condiciones</a>
          <a href="#">Política de Privacidad</a>
          <a href="#">Política de Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.main-footer {
  background-color: #fffaf7; /* A light, creamy color, similar to the image's background */
  padding: 3em 2em; /* Ample padding */
  color: #5C4033; /* Dark brown for text */
  font-family: Arial, sans-serif; /* Example font */
}

.footer-content-wrapper {
  max-width: 1200px; /* Max width to center content */
  margin: 0 auto;
}

.footer-top-section {
  display: flex;
  flex-wrap: wrap; /* Allows wrapping on smaller screens */
  justify-content: space-between;
  gap: 2em; /* Space between flex items */
  padding-bottom: 2em;
  border-bottom: 1px solid rgba(92, 64, 51, 0.1); /* Subtle divider */
}

.footer-brand {
  flex-shrink: 0; /* Prevents shrinking */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 150px; /* Ensures brand section doesn't get too small */
}

.footer-logo {
  height: 3em; /* Adjust size as needed */
  width: auto;
  margin-bottom: 1em;
}

.social-icons a {
  color: #A65300; /* Orange-brown for icons */
  font-size: 1.5em;
  margin-right: 1em;
  transition: color 0.3s ease;
}

.social-icons a:hover {
  color: #8C4500; /* Darker orange-brown on hover */
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  flex-grow: 1; /* Allows link columns to take up available space */
  justify-content: space-around; /* Distribute columns evenly */
}

.footer-column {
  min-width: 120px; /* Minimum width for each column */
}

.footer-column h5 {
  color: #A60000; /* Dark red for column titles */
  font-size: 1.1em;
  margin-bottom: 1em;
  white-space: nowrap; /* Prevent title from wrapping */
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 0.8em;
}

.footer-column a {
  text-decoration: none;
  color: #5C4033;
  font-size: 0.95em;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: #A65300; /* Orange-brown on hover */
}

.footer-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-width: 180px; /* Ensure CTA button space */
  margin-left: 2em; /* Space from link columns */
}

.cta-button {
  background-color: #F47B20; /* Bright orange for CTA, similar to example */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 1em 2em;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  white-space: nowrap; /* Prevent button text from wrapping */
}

.cta-button:hover {
  background-color: #E06A1C; /* Slightly darker on hover */
  transform: translateY(-2px);
}

.cta-slogan {
  margin-top: 0.8em;
  font-size: 0.9em;
  color: #7D5D4E; /* Lighter brown for slogan */
}

.footer-bottom-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5em;
  font-size: 0.85em;
}

.copyright {
  margin-bottom: 0.5em; /* Space on small screens */
}

.legal-links a {
  color: #5C4033;
  text-decoration: none;
  margin-left: 1.5em;
  white-space: nowrap; /* Prevent links from wrapping */
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: #A65300;
}

/* ---------------------------------------------------- */
/* Mobile Styles (Adjustments for smaller screens) */
@media (max-width: 768px) {
  .footer-top-section {
    flex-direction: column; /* Stack sections vertically */
    align-items: center; /* Center items when stacked */
    text-align: center;
  }

  .footer-brand {
    align-items: center; /* Center logo and social icons */
    margin-bottom: 2em;
  }

  .social-icons {
    margin-top: 1em; /* Space below logo */
  }

  .footer-links {
    flex-direction: column; /* Stack link columns */
    align-items: center; /* Center link columns */
    margin-bottom: 2em;
  }

  .footer-column {
    margin-bottom: 1.5em; /* Space between stacked columns */
    width: 100%; /* Full width for columns */
    max-width: 250px; /* Constrain width of stacked columns */
  }

  .footer-column h5 {
    text-align: center; /* Center column titles */
  }

  .footer-column ul {
    text-align: center; /* Center list items */
  }

  .footer-cta {
    margin-left: 0; /* Remove left margin */
    width: 100%;
    margin-bottom: 2em; /* Space before bottom section */
  }

  .footer-bottom-section {
    flex-direction: column; /* Stack copyright and legal links */
    text-align: center;
  }

  .legal-links {
    display: flex; /* Keep legal links in a row if possible */
    flex-wrap: wrap; /* Allow wrapping of legal links */
    justify-content: center;
    margin-top: 1em;
  }

  .legal-links a {
    margin: 0.5em 0.8em; /* Adjust spacing for stacked legal links */
  }
}

/* Adjustments for very small screens */
@media (max-width: 480px) {
  .main-footer {
    padding: 2em 1em; /* Reduce padding on very small screens */
  }

  .social-icons a {
    font-size: 1.3em;
    margin: 0 0.5em; /* Closer spacing for social icons */
  }

  .cta-button {
    padding: 0.8em 1.5em; /* Smaller padding for button */
    font-size: 0.9em;
  }
}
</style>