<template>
  <q-layout view="lHh Lpr lFf" class="bg-white">
    <q-header elevated>
      <q-toolbar class="q-py-xs">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title> 金融刷題 </q-toolbar-title>
        <q-space />
        <q-input
          outlined
          type="number"
          :rules="[
            (val) => val > 0 || '最小不能低於1',
            (val) => val < nMax || `最大不能超過${nMax - 1}`,
          ]"
          bg-color="white"
          v-model="nMin"
          debounce="500"
          label="題號最小值"
          class="q-ma-sm q-pb-xs"
          dense
        />
        <q-text color="grey-7"> ~ </q-text>
        <q-input
          outlined
          type="number"
          :rules="[
            (val) => val > nMin || `最小不能低於${nMin + 1}`,
            (val) => val < 3212 || '最大不能超過3211',
          ]"
          bg-color="white"
          v-model="nMax"
          debounce="500"
          label="題號最大值"
          class="q-ma-sm q-pb-xs"
          dense
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-2">
      <q-list>
        <q-item-label header>那啥</q-item-label>
        <q-item clickable rel="noopener" href="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>主頁</q-item-label>
            <q-item-label caption>歡迎回家</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable rel="noopener" onclick="alert(`還沒做`)">
          <q-item-section avatar>
            <q-icon name="history" />
          </q-item-section>
          <q-item-section>
            <q-item-label>刷題記錄</q-item-label>
            <q-item-label caption>???</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          target="_blank"
          rel="noopener"
          onclick="alert(`還沒做`)"
        >
          <q-item-section avatar>
            <q-icon name="publish" />
          </q-item-section>
          <q-item-section>
            <q-item-label>導出刷題記錄</q-item-label>
            <q-item-label caption>Save</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          target="_blank"
          rel="noopener"
          onclick="alert(`還沒做`)"
        >
          <q-item-section avatar>
            <q-icon name="download" />
          </q-item-section>
          <q-item-section>
            <q-item-label>導入刷題記錄</q-item-label>
            <q-item-label caption>Load</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          target="_blank"
          rel="noopener"
          onclick="alert(`還沒做`)"
        >
          <q-item-section avatar>
            <q-icon name="delete_forever" />
          </q-item-section>
          <q-item-section>
            <q-item-label>清空刷題記錄</q-item-label>
            <q-item-label caption>人生重來</q-item-label>
          </q-item-section>
        </q-item>
        <!--  <q-item clickable target="_blank" rel="noopener" href="https://facebook.quasar.dev">
          <q-item-section avatar>
            <q-icon name="public" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Facebook</q-item-label>
            <q-item-label caption>@QuasarFramework</q-item-label>
          </q-item-section>
        </q-item> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
const ls = localStorage;
export default {
  setup() {
    if (!ls.getItem("nMin")) {
      ls.setItem("nMin", 1);
    }
    if (!ls.getItem("nMax")) {
      ls.setItem("nMax", 3211);
    }
    const leftDrawerOpen = ref(false);
    const nMin = ref(ls.getItem("nMin"));
    const nMax = ref(ls.getItem("nMax"));

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      nMin,
      nMax,
    };
  },
  watch: {
    nMin() {
      ls.setItem("nMin", this.nMin);
    },
    nMax() {
      ls.setItem("nMax", this.nMax);
    },
  },
};
</script>

<style scoped></style>
