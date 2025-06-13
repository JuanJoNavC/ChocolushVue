<script setup>
import { ref, onMounted } from 'vue';
import NavBarComponent from '../components/NavBarComponent.vue';
import HeroComponent from '../components/HeroComponent.vue';

const heroSectionRef = ref(null);
onMounted(() => {
  console.log('IndexView mounted, HeroComponent ref:', heroSectionRef.value);
});
</script>

<template>
    <div>
        <NavBarComponent :heroElementRef="heroSectionRef" />
        <HeroComponent ref="heroSectionRef" />
        <div style="background-color: #feebd0; height: 100vh; padding-top:6em ;">
            <div class="container">
                <h1>Welcome to Chocolush</h1>
                <p>Your one-stop shop for all things chocolate!</p>
            </div>
        </div>
    </div>

</template>