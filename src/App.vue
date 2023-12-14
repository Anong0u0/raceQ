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
        <q-toggle
          class="q-mx-xs"
          v-model="randomQuestion"
          color="green-5"
          label="亂序出題"
          dense
        />
        <div class="q-mx-md" style="font-size: 20px">{{ status }}</div>
        <q-input
          outlined
          type="number"
          :rules="[
            (val) => val > 0 || '最小不能低於1',
            (val) => val <= nMax || `最大不能超過${nMax}`,
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
            (val) => val >= nMin || `最小不能低於${nMin}`,
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
        <q-item clickable rel="noopener" to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>主頁</q-item-label>
            <q-item-label caption>歡迎回家</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable rel="noopener" to="/history">
          <q-item-section avatar>
            <q-icon name="history" />
          </q-item-section>
          <q-item-section>
            <q-item-label>刷題記錄</q-item-label>
            <q-item-label caption>目前至少能動</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable target="_blank" rel="noopener" @click="exportHistory">
          <q-item-section avatar>
            <q-icon name="publish" />
          </q-item-section>
          <q-item-section>
            <q-item-label>導出刷題記錄</q-item-label>
            <q-item-label caption>Save</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable target="_blank" rel="noopener" @click="importHistory">
          <q-item-section avatar>
            <q-icon name="download" />
          </q-item-section>
          <q-item-section>
            <q-item-label>導入刷題記錄</q-item-label>
            <q-item-label caption>Load</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable target="_blank" rel="noopener" @click="clearHistory">
          <q-item-section avatar>
            <q-icon name="delete_forever" />
          </q-item-section>
          <q-item-section>
            <q-item-label>清空刷題記錄</q-item-label>
            <q-item-label caption>人生重來</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import * as fs from "file-saver";
const ls = localStorage;

export default {
  setup() {
    if (!ls.getItem("nMin")) {
      ls.setItem("nMin", 1);
    }
    if (!ls.getItem("nMax")) {
      ls.setItem("nMax", 3211);
    }
    if (!ls.getItem("randomQuestion")) {
      ls.setItem("randomQuestion", true);
    }
    const leftDrawerOpen = ref(false),
      status = ref("loading...");
    const nMin = ref(Number(ls.getItem("nMin")));
    const nMax = ref(Number(ls.getItem("nMax")));
    const randomQuestion = ref(ls.getItem("randomQuestion") === "true");

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    return {
      leftDrawerOpen,
      status,
      toggleLeftDrawer,
      nMin,
      nMax,
      randomQuestion,
    };
  },
  methods: {
    exportHistory() {
      fs.saveAs(
        new Blob([ls.getItem("testHistory")], {
          type: "text/json;charset=utf-8",
        }),
        `刷題記錄${new Date().toLocaleString("sv").replace(/[\/:]/g, "-")}.json`
      );
    },
    importHistory() {
      const file = document.createElement("input");
      file.type = "file";
      file.accept = ".json";
      file.onchange = () => {
        const reader = new FileReader();
        reader.onload = () => {
          ls.setItem("testHistory", reader.result);
          window.location.reload();
        };
        reader.readAsText(file.files[0]);
      };
      file.click();
    },
    clearHistory() {
      if (!confirm("確定要清空刷題記錄嗎？")) return;
      ls.setItem("testHistory", "[]");
      window.location.reload();
    },
  },
  mounted() {
    window.addEventListener("lsStatusChanged", () => {
      this.status = ls.getItem("status");
    });
  },
  watch: {
    nMin() {
      ls.setItem("nMin", this.nMin);
    },
    nMax() {
      ls.setItem("nMax", this.nMax);
    },
    randomQuestion() {
      ls.setItem("randomQuestion", this.randomQuestion);
      window.dispatchEvent(new Event("randomQuestionChanged"));
    },
  },
};
</script>

<style scoped>
.q-toggle {
  font-size: 20px;
}
</style>
