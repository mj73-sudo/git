<template>
  <v-locale-provider rtl>
    <v-app>
      <AppBar />
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
<script setup lang="ts">
  import AppBar from '../components/AppBar.vue'
</script>
