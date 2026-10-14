<script setup>
import { RouterView } from 'vue-router'
import ConfigNav from '@/components/config/ConfigNav.vue'
</script>

<template>
  <div class="config-page">
    <main class="config-dashboard">
      <ConfigNav />
      <section class="config-router-area">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped>
.config-page {
  width: 100%;
  min-width: 1200px;
  min-height: calc(100vh - 64px);
  padding: 10px 12px;
  box-sizing: border-box;
  color: #d9f5ff;
  background: linear-gradient(rgba(4, 34, 62, 0.88), rgba(1, 18, 34, 0.97));
}

.config-dashboard {
  width: 100%;
  min-height: 760px;
  display: grid;
  grid-template-rows: 44px minmax(0, 1fr);
  gap: 10px;
}

.config-router-area {
  min-width: 0;
  min-height: 0;
}
</style>