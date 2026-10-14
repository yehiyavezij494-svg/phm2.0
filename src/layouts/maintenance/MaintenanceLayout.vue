<script setup>
import { RouterView } from 'vue-router'
import MaintenanceNav from '@/components/maintenance/MaintenanceNav.vue'
</script>

<template>
  <div class="maintenance-page">
    <main class="maintenance-dashboard">
      <MaintenanceNav />
      <section class="maintenance-router-area">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped>
.maintenance-page {
  width: 100%;
  min-width: 1200px;
  min-height: calc(100vh - 64px);
  padding: 10px 12px;
  box-sizing: border-box;
  color: #d9f5ff;
  background: linear-gradient(rgba(4, 34, 62, 0.88), rgba(1, 18, 34, 0.97));
}

.maintenance-dashboard {
  width: 100%;
  min-height: 760px;
  display: grid;
  grid-template-rows: 44px minmax(0, 1fr);
  gap: 10px;
}

.maintenance-router-area {
  min-width: 0;
  min-height: 0;
}
</style>
