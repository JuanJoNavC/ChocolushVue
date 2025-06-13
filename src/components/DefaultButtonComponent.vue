<template>
  <button>
    <p>{{ text }}</p>
  </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: 'Subscribe'
  }
});
</script>

<style scoped>
button {
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;
}

button {
  --primary-color: #3c0d0d;
  --hovered-color: #a0522d;
  position: relative;
  display: flex;
  font-weight: 600;
  font-size: 18px;
  gap: 1rem;
  align-items: center;
}

button p {
  margin: 0;
  position: relative;
  font-size: 18px;
  color: var(--primary-color);
}

button::after {
  position: absolute;
  content: "";
  width: 0;
  left: 0;
  bottom: -7px;
  background: var(--hovered-color);
  height: 2px;
  transition: 0.3s ease-out;
}

button p::before {
  position: absolute;
  content: var(--text-content, "Subscribe"); /* Use a CSS variable for content */
  width: 0%;
  inset: 0;
  color: var(--hovered-color);
  overflow: hidden;
  transition: 0.3s ease-out;
}

button:hover::after {
  width: 100%;
}

button:hover p::before {
  width: 100%;
}
</style>

<script>
export default {
  mounted() {
    this.$el.style.setProperty('--text-content', `"${this.text}"`);
  },
  watch: {
    text(newText) {
      this.$el.style.setProperty('--text-content', `"${newText}"`);
    }
  }
};
</script>