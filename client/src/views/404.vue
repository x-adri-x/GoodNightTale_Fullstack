<template>
  <div class="main">
    <h1>Seems you got lost.</h1>
    <a href="/home">Go to home page.</a>
    <img src="../assets/panda.jpg" />
  </div>
</template>
<style scoped>
.main {
  background: #e5e5e5;
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

h1,
a {
  color: #515151;
  font-size: 3.5rem;
}

a {
  cursor: pointer;
  text-decoration: none;
}

a:hover {
  color: var(--vt-c-black-soft);
}
</style>
