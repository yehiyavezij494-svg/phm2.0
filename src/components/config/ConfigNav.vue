<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menus = [
  { name: '所亭管理', icon: '▥', path: '/config/station' },
  { name: '监测项管理', icon: '◉', path: '/config/monitor-item' },
]

function handleClick(item) {
  if (route.path !== item.path) router.push(item.path)
}
</script>

<template>
  <nav class="config-nav">
    <button
      v-for="item in menus"
      :key="item.path"
      type="button"
      class="nav-item"
      :class="{ active: route.path === item.path }"
      @click="handleClick(item)"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span>{{ item.name }}</span>
    </button>
  </nav>
</template>

<style scoped>
.config-nav {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  box-sizing: border-box;
  background: rgba(2, 33, 58, 0.96);
  border: 1px solid #075786;
}

.nav-item {
  position: relative;
  min-width: 135px;
  height: 100%;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #6795b5;
  font-family: "Microsoft YaHei", Arial, sans-serif;
  font-size: 12px;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-right: 1px solid rgba(18, 93, 137, 0.22);
  transition: color 0.2s ease, background 0.2s ease;
}

.nav-item:hover {
  color: #bdeeff;
  background: rgba(0, 112, 169, 0.14);
}

.nav-item.active {
  color: #fff;
  font-weight: 600;
  background: linear-gradient(135deg, #0788c5 0%, #086ba7 72%, #064a7a 100%);
}

.nav-item.active::after {
  content: "";
  position: absolute;
  left: 15%;
  right: 15%;
  bottom: 0;
  height: 2px;
  background: #19dcff;
  box-shadow: 0 0 7px rgba(25, 220, 255, 0.7);
}

.nav-icon {
  color: #42c8ee;
  font-size: 13px;
}

.nav-item.active .nav-icon {
  color: #fff;
}
</style>