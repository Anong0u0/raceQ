<template>
  <div class="row">
    <div class="col-1">歷史紀錄</div>
    <q-btn class="col-1" :label="123" />
  </div>
  <q-list bordered class="fit">
    <q-item clickable v-for="(item, index) in history" :key="index">
      <q-item-section>
        <q-item-label
          >{{ item.index + 1 }}. {{ questions[item.index].題目 }}</q-item-label
        >
        <q-item-label
          v-for="option in [1, 2, 3, 4]"
          :key="option"
          :class="{
            correct: questions[item.index].正確答案 == option,
            wrong:
              item.choose == option &&
              item.choose != questions[item.index].正確答案,
          }"
          >{{ option }}.
          {{ questions[item.index][`選項${option}`] }}</q-item-label
        >
        <q-item-label
          >使用時間: {{ item.usedTime }}秒,
          {{ new Date(item.timestamp).toLocaleString("sv") }}</q-item-label
        >
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { ref } from "vue";
import data3211 from "../assets/data3211.json";
const ls = localStorage;

export default {
  setup() {
    const questions = data3211;
    const history = JSON.parse(ls.getItem("testHistory"));
    console.log(history);
    return {
      history,
      questions,
    };
  },
};
</script>

<style scoped>
* {
  text-align: center;
}
.correct {
  color: green;
}
.wrong {
  color: red;
}
.q-item {
  border: 1px solid #ccc;
}
</style>
