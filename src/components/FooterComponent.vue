<template>
  <footer class="app-footer">
    <div class="footer-content-area">
      <div class="footer-left">
        <div class="ferrero-logo">
          <img src="/src/assets/images/ChocoLushLogo.png" alt="Chocolush Logo" />
        </div>
        <p class="copyright">&copy; Chocolush - Todos los derechos reservados</p>
      </div>

      <div class="footer-links-grid">
        <ul>
          <li><a href="#">Chocolush</a></li>
          <li><a href="#">Mapa del Sitio</a></li>
          <li><a href="#">Visita Nuestro Local</a></li>
        </ul>
        <ul>
          <li><a href="#">Política Sobre Cookies</a></li>
          <li><a href="#">Política de Privacidad</a></li>
        </ul>
        <ul>
          <li><a href="#">Requerimientos Técnicos</a></li>
          <li><a href="#">Sobre Nuestra Publicidad</a></li>
        </ul>
        <ul>
          <li><a href="#">Aspectos Legales</a></li>
        </ul>
      </div>

      <div class="footer-right">
        <div class="language-selector">
          <span>EN</span> | <span>ES</span>
        </div>
        <div class="globe-icon-container">
          <svg class="globe-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.83-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.93-2.31c-.57-.27-1.1-.96-1.6-1.63L11 10.93V8h3c1.1 0 2 .9 2 2v2.16l2.16 2.16c.36-.62.64-1.28.84-1.95L18 9l-.69-.9L14 5.92V5h-2v1.92l-3.31 3.31C8.24 10.02 8 10.49 8 11c0 1.2.66 2.5 1.5 3.5l1.09 1.09 3.09 3.09c1.03-.69 1.83-1.6 2.53-2.67zM15 13h-2v-2h2v2z"/>
          </svg>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script specific logic needed for this static footer component
</script>

<style scoped>
.app-footer {
  width: 100%;
  background-color: #f3410e; /* The primary red/orange color from your screenshot */
  color: white;
  position: relative; /* Essential for positioning the wave container */
  padding-top: 0; /* No top padding here; wave will overlap from the top */
  overflow: hidden; /* Ensures wave doesn't spill out horizontally */
  font-family: 'Inter', sans-serif;
}


/* This targets the main wave path, which should be the color of the section ABOVE the footer */
.footer-wave-svg path:first-child {
  /* IMPORTANT: Set this to the exact background color of the section immediately above the footer */
  fill: #feebd0; /* This should match the background of the div directly above your footer */
}

.footer-content-area {
  position: relative; /* Z-index works on positioned elements */
  z-index: 2; /* Make sure content is above the wave */
  max-width: 1200px;
  margin: 0 auto;
  padding: 2em;
  padding-top: 6em; /* Add top padding here to push content down below the wave */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 2em;
}

.footer-left {
  flex-basis: 20%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.ferrero-logo {
  font-family: 'Arial Black', sans-serif;
  font-size: 1.8em;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5em;
  letter-spacing: 1px;
}

.ferrero-logo img {
  height: 2em;
  width: auto;
  margin-right: 0.5em;
}

.copyright {
  font-size: 0.85em;
  opacity: 0.8;
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1em 2em;
  flex-basis: 50%;
  min-width: 400px;
}

.footer-links-grid ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links-grid a {
  color: white;
  text-decoration: none;
  font-size: 0.9em;
  line-height: 1.8;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.footer-links-grid a:hover {
  opacity: 1;
  color: var(--main-color);
}

.footer-right {
  flex-basis: 15%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1em;
}

.language-selector {
  font-size: 0.9em;
  color: white;
  opacity: 0.9;
}

.language-selector span {
  cursor: pointer;
  padding: 0 0.3em;
  transition: opacity 0.3s ease;
}

.language-selector span:hover {
  opacity: 1;
}

.globe-icon-container {
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.globe-icon {
  width: 24px;
  height: 24px;
  color: #f3410e;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .footer-content-area {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .footer-left,
  .footer-right {
    align-items: center;
    flex-basis: auto;
  }
  .footer-links-grid {
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    max-width: 600px;
    text-align: center;
  }
  .footer-links-grid ul {
    align-items: center;
  }
}

@media (max-width: 576px) {
  .footer-links-grid {
    grid-template-columns: 1fr;
    gap: 0.5em 0;
  }
  .ferrero-logo {
    font-size: 1.5em;
  }
}
</style>