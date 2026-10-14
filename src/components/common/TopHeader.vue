<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const leftMenus = [
  { name: '在线监测', path: '/monitor', activePrefix: '/monitor' },
  { name: 'PHM', path: '/phm/overview', activePrefix: '/phm' },
  { name: '历史记录', path: '/history/collection', activePrefix: '/history' },
]

const rightMenus = [
  { name: '设备管理', path: '/device/resume', activePrefix: '/device' },
  { name: '配置管理', path: '/config/station', activePrefix: '/config' },
  { name: '检修管理', path: '/maintenance/inspection', activePrefix: '/maintenance' },
]

function isMenuActive(item) {
  return route.path.startsWith(item.activePrefix)
}
</script>

<template>
  <header class="top-header">
    <div class="top-light-line"></div>

    <nav class="top-nav left-nav">
      <RouterLink
        v-for="item in leftMenus"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ 'menu-active': isMenuActive(item) }"
      >
        <span class="nav-text">{{ item.name }}</span>
      </RouterLink>
    </nav>

    <div class="system-title">
      <div class="title-center">
        <div class="title-main">PHM系统管理系统</div>
        <div class="title-sub">石家庄牵引变电所</div>
      </div>
    </div>

    <nav class="top-nav right-nav">
      <RouterLink
        v-for="item in rightMenus"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ 'menu-active': isMenuActive(item) }"
      >
        <span class="nav-text">{{ item.name }}</span>
      </RouterLink>
    </nav>

    <div class="bottom-light-line"></div>
  </header>
</template>

<style scoped>
.top-header {
  position: relative;
  width: 100%;
  height: 64px;
  display: grid;
  grid-template-columns: minmax(430px, 1fr) 350px minmax(430px, 1fr);
  overflow: hidden;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background: linear-gradient(180deg, #062d4f 0%, #05243f 48%, #03192f 100%);
  border-bottom: 1px solid rgba(0, 157, 214, 0.35);
  box-shadow: 0 3px 14px rgba(0, 131, 207, 0.1);
}

.top-light-line {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #0787ba 18%,
    #1bdcff 50%,
    #0787ba 82%,
    transparent 100%
  );
  box-shadow: 0 0 6px rgba(22, 218, 255, 0.55);
}

.top-nav {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  align-items: flex-start;
}

.left-nav {
  justify-content: flex-end;
}

.right-nav {
  justify-content: flex-start;
}

.nav-item {
  position: relative;
  width: 130px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #79a7c7;
  font-size: 15px;
  text-decoration: none;
  background: linear-gradient(180deg, rgba(5, 54, 94, 0.24), rgba(3, 30, 55, 0.08));
  border-left: 1px solid rgba(14, 93, 145, 0.16);
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.left-nav .nav-item {
  transform: skewX(25deg);
}

.left-nav .nav-item .nav-text {
  transform: skewX(-25deg);
}

.right-nav .nav-item {
  transform: skewX(-25deg);
}

.right-nav .nav-item .nav-text {
  transform: skewX(25deg);
}

.nav-text {
  position: relative;
  z-index: 2;
  display: inline-block;
  white-space: nowrap;
}

.nav-item:hover {
  color: #d6f5ff;
  background: linear-gradient(180deg, rgba(0, 123, 188, 0.24), rgba(0, 72, 119, 0.12));
}

.nav-item.menu-active {
  color: #fff;
  font-weight: 600;
  background: linear-gradient(180deg, #0785b9 0%, #076899 50%, #064a76 100%);
  box-shadow: inset 0 -2px 0 #17d9ff;
}

.nav-item.menu-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #22dcff;
  box-shadow: 0 0 7px rgba(0, 218, 255, 0.75);
}

.nav-item.menu-active::after {
  content: '';
  position: absolute;
  left: 8%;
  bottom: 0;
  width: 84%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #15d8ff, transparent);
}

.system-title {
  position: relative;
  z-index: 20;
  height: 64px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.title-center {
  position: relative;
  width: 330px;
  height: 58px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(180deg, #075483 0%, #06446f 45%, #053455 75%, #042842 100%);
  clip-path: polygon(5% 0, 95% 0, 88% 100%, 12% 100%);
  box-shadow: inset 0 1px 0 rgba(75, 219, 255, 0.3);
}

.title-center::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15%;
  width: 70%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    #20dcff 25%,
    #87f3ff 50%,
    #20dcff 75%,
    transparent
  );
  box-shadow: 0 0 7px rgba(23, 215, 255, 0.5);
}

.title-center::after {
  content: '';
  position: absolute;
  left: 22%;
  bottom: 0;
  width: 56%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(30, 189, 235, 0.55), transparent);
}

.title-main {
  position: relative;
  z-index: 2;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  line-height: 25px;
  text-shadow: 0 0 6px rgba(39, 206, 255, 0.28);
}

.title-sub {
  position: relative;
  z-index: 2;
  color: #b7ddec;
  font-size: 12px;
  letter-spacing: 1px;
  line-height: 16px;
}

.bottom-light-line {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #0877a9 18%,
    #0fc6eb 50%,
    #0877a9 82%,
    transparent 100%
  );
  box-shadow: 0 0 4px rgba(0, 179, 226, 0.22);
}

@media (max-width: 1500px) {
  .top-header {
    grid-template-columns: minmax(350px, 1fr) 330px minmax(350px, 1fr);
  }

  .nav-item {
    width: 110px;
    font-size: 14px;
  }

  .title-center {
    width: 310px;
  }

  .title-main {
    font-size: 19px;
  }
}
</style>
