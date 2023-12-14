<template>
  <q-page class="q-pa-xl">
    <div class="column fit content-center">
      <!-- 題目部分 -->
      <div class="title mh300 flex items-center q-mb-md relative-position">
        <div class="absolute-top-left q-mx-sm">{{ currentTime }}</div>
        <p class="q-px-xl">
          <b v-if="!randomQuestion">{{ listIndex + 1 }}. </b
          >{{ questions[currentQuestionIndex].題目 }}
        </p>
      </div>
      <div class="row q-mt-md fit content-center">
        <!-- 上一題下一題按鈕 -->
        <div
          class="column col col-1 q-px-md q-gutter-lg items-center"
          style="width: 100px"
        >
          <q-btn
            class="col-1 q-px-sm vertical"
            @click="firstQuestion"
            icon="skip_previous"
          />
          <q-btn class="col q-px-sm" @click="prevQuestion" icon="expand_less" />
          <q-btn class="col q-px-sm" @click="nextQuestion" icon="expand_more" />
          <q-btn
            class="col-1 q-px-sm vertical"
            @click="lastQuestion"
            icon="skip_next"
          />
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
            ><b>{{ option + ". " }}</b
            >{{ questions[currentQuestionIndex][`選項${option}`] }}</q-radio
          >
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
let lastQuestion = null,
  timeclip = 0,
  intervalFn;

export default {
  setup() {
    const min = Number(ls.getItem("nMin"));
    const tested = new Set(testHistory.map((e) => e.index));
    const normalList = Array(ls.getItem("nMax") - min + 1)
      .fill()
      .map((_, i) => i + min - 1)
      .filter((e) => !tested.has(e));
    const randomList = normalList.slice().sort(() => Math.random() - 0.5);
    console.log(tested, randomList);
    const listIndex = ref(0);
    ls.setItem("status", `目前: 1 / ${randomList.length}`);
    window.dispatchEvent(new Event("lsStatusChanged"));
    const passTimes = ref(0);
    const ans = ref(null);
    const questions = data3211;
    console.log(questions);
    const randomQuestion = ref(ls.getItem("randomQuestion") === "true");
    return {
      ans,
      questions,
      listIndex,
      normalList,
      randomList,
      passTimes,
      randomQuestion,
    };
  },
  mounted() {
    intervalFn = setInterval(() => {
      if (++timeclip === 10) {
        timeclip = 0;
        this.passTimes++;
      }
      // console.log(timeclip, this.passTimes);
    }, 100);
    window.addEventListener("randomQuestionChanged", () => {
      const tf = ls.getItem("randomQuestion") === "true";
      if (tf)
        this.listIndex = this.randomList.indexOf(
          this.normalList[this.listIndex]
        );
      else
        this.listIndex = this.normalList.indexOf(
          this.randomList[this.listIndex]
        );
      this.randomQuestion = tf;
    });
  },
  unmounted() {
    clearInterval(intervalFn);
  },
  computed: {
    currentQuestionIndex() {
      return this.randomQuestion
        ? this.randomList[this.listIndex]
        : this.normalList[this.listIndex];
    },
    currentTime() {
      return `${String(Math.floor(this.passTimes / 60)).padStart(
        2,
        "0"
      )}:${String(this.passTimes % 60).padStart(2, "0")}`;
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
      timeclip = 0;
      this.passTimes = 0;
    },
  },
  methods: {
    selectOption(option) {
      if (lastQuestion === this.currentQuestionIndex) return;
      testHistory.push({
        index: this.currentQuestionIndex,
        choose: option,
        usedTime: this.passTimes,
        timestamp: Date.now(),
      });
      lastQuestion = this.currentQuestionIndex;
      ls.setItem("testHistory", JSON.stringify(testHistory));
      // console.log("選擇了：" + option);
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
    firstQuestion() {
      this.listIndex = 0;
    },
    lastQuestion() {
      this.listIndex = this.randomList.length - 1;
    },
  },
};
</script>

<style scoped>
* {
  text-align: center;
}
.vertical {
  writing-mode: vertical-lr;
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
