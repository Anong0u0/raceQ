<template>
  <q-page class="q-pa-xl">
    <div class="column fit content-center">
      <!-- 題目部分 -->
      <div class="title mh300 flex items-center q-mb-md">
        <p class="q-px-xl">
          {{ questions[currentQuestionIndex].題目 }}
        </p>
      </div>
      <div class="row q-mt-md fit content-center">
        <!-- 上一題下一題按鈕 -->
        <div
          class="column col col-1 q-px-md q-gutter-xl items-center"
          style="min-width: 130px"
        >
          <q-btn class="col" @click="prevQuestion" label="上一題" />
          <q-btn class="col" @click="nextQuestion" label="下一題" />
        </div>

        <!-- 選項部分 -->
        <div class="column col q-ml-md q-gutter-sm content-start mh300">
          <q-radio
            class="col fit q-pl-md"
            :class="{
              correct:
                ans && option === questions[currentQuestionIndex].正確答案,
              wrong:
                ans === option &&
                ans !== questions[currentQuestionIndex].正確答案,
            }"
            @click="selectOption(option)"
            v-for="option in [1, 2, 3, 4]"
            :key="option"
            v-model="ans"
            :val="option"
            :label="
              option + '. ' + questions[currentQuestionIndex][`選項${option}`]
            "
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import data3211 from "../assets/data3211.json";
const ls = window.localStorage;
const testHistory = JSON.parse(ls.getItem("testHistory")) || [];
let lastQuestion = null;

export default {
  setup() {
    const min = Number(ls.getItem("nMin"));
    const tested = new Set(testHistory.map((e) => e.index));
    const randomList = Array(ls.getItem("nMax") - min + 1)
      .fill()
      .map((_, i) => i + min - 1)
      .filter((e) => !tested.has(e))
      .sort(() => Math.random() - 0.5);
    console.log(tested, randomList);
    const listIndex = ref(0);
    ls.setItem("status", `目前: 1 / ${randomList.length}`);
    window.dispatchEvent(new Event("lsStatusChanged"));
    return {
      listIndex,
      randomList,
    };
  },
  data() {
    console.log(data3211);
    return {
      questions: data3211,
      ans: null,
    };
  },
  computed: {
    currentQuestionIndex() {
      return this.randomList[this.listIndex];
    },
  },
  watch: {
    listIndex() {
      this.ans = null;
      ls.setItem(
        "status",
        `目前: ${this.listIndex + 1} / ${this.randomList.length}`
      );
      window.dispatchEvent(new Event("lsStatusChanged"));
      window.dispatchEvent(new Event("lsStatusChanged"));
    },
  },
  methods: {
    selectOption(option) {
      if (lastQuestion === this.currentQuestionIndex) return;
      testHistory.push({
        index: this.currentQuestionIndex,
        choose: option,
        timestamp: Date.now(),
      });
      lastQuestion = this.currentQuestionIndex;
      ls.setItem("testHistory", JSON.stringify(testHistory));
      console.log("選擇了：" + option);
    },
    prevQuestion() {
      if (this.listIndex > 0) {
        this.listIndex--;
      }
    },
    nextQuestion() {
      if (this.listIndex < this.randomList.length - 1) {
        this.listIndex++;
      }
    },
  },
};
</script>

<style scoped>
* {
  text-align: center;
}
.mh300 {
  min-height: 300px;
}
.title {
  font-size: 30px;
  background-color: rgb(255, 195, 250);
}
.title,
.q-radio {
  border-radius: 10px;
}
.q-radio,
.q-btn {
  font-size: 25px;
}

.q-radio {
  background-color: rgb(230, 240, 255);
}
.correct {
  background-color: rgb(180, 255, 180);
}
.wrong {
  background-color: rgb(255, 170, 170);
}
.q-btn {
  width: min-content;
  background-color: wheat;
  font-weight: bold;
}
</style>
