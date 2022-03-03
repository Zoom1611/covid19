<template>
  <div class="nav">
    <el-menu
      :default-active="activeIndex1"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1"
        ><router-link :to="{ name: 'Summary' }"
          >Summary
        </router-link></el-menu-item
      >
      <el-menu-item index="2"
        ><router-link :to="{ name: 'Confirmed' }"
          >Confirmed
        </router-link></el-menu-item
      >
      <el-menu-item index="3"
        ><router-link :to="{ name: 'Recovered' }"
          >Recovered
        </router-link></el-menu-item
      >
      <el-menu-item index="4"
        ><router-link :to="{ name: 'Deaths' }"
          >Deaths
        </router-link></el-menu-item
      >
    </el-menu>
  </div>
  <router-view />
</template>

<script>
import { ref } from "vue";
import { ElMenu, ElMenuItem } from "element-plus";
export default {
  components: {
    ElMenu,
    ElMenuItem,
  },
  setup() {
    const activeIndex = ref("1");
    return {
      activeIndex,
    };
  },
};
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
el-menu-item router-link {
  text-decoration: none;
}
</style>
