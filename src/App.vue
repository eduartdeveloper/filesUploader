<template>
  <main class="bg-blue-100">
    <files-header />
    <router-view class="container px-5 sm:px-20 py-20 flex justify-center" />
  </main>
</template>

<script>
import FilesHeader from './components/FilesHeader'
export default {
  name: 'App',
  components: {
    FilesHeader
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
