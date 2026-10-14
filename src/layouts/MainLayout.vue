<script setup>
import TopHeader from '@/components/common/TopHeader.vue'
</script>

<template>
  <div class="main-layout">

    <TopHeader />

    <div class="page-container">

      <RouterView />

    </div>

  </div>
</template>

<style scoped>
.main-layout {
  width: 100%;
  min-width: 1200px;
  min-height: 100vh;

  box-sizing: border-box;

  overflow-x: hidden;

  background: #03182b;
}


.page-container {
  width: 100%;
}
</style>