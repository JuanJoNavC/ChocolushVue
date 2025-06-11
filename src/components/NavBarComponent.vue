<script setup>

</script>

<template>
    <nav class="navContainer">
        <div class="logo">
            <i class="fa-brands fa-slack"></i>
            <img src="" alt="Logo" />
            <span>Chocolush</span>
        </div>
        <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/about">About</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
            <li><router-link to="/login">Login</router-link></li>
        </ul>
    </nav>
</template>

<style scoped>
.navContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4em;
}

.navContainer .logo {
    display: flex;
    align-items: center;
    font-size: 1.5em;
    color: #333;
}
.navContainer .logo i {
    padding: 10px;
}
.navContainer ul {
    font-size: 1em;
    display: flex;
    align-items: center;
    list-style: none;
    padding: 20px;
}
.navContainer li {
    margin-right: 20px;
}
.navContainer a {
    text-decoration: none;
    color: #333;
}

</style>