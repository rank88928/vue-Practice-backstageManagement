<template>
  <div class="stars" ref="stars_box"></div>

  <div class="start">
    <el-popover placement="bottom-start" title="設置" :width="250" trigger="click">
      <template #reference>
        <el-icon :size="24"><Setting /> </el-icon>
      </template>

      <el-button @click="add_config">新增</el-button>

      <template class="panel">
        <div class="demo-collapse">
          <el-collapse v-for="(star, index) in star_resource_pool" :key="index" v-model="activeName" accordion @mousedown.stop @click.stop>
            <el-collapse-item :title="`配置項 ${index + 1}`" :name="String(index + 1)">
              <div class="slider-demo-block">
                <span class="demonstration">生成數</span>
                <el-slider v-model="star.config.limit_sum" />
              </div>

              <div class="slider-demo-block">
                <span class="demonstration">持續</span>
                <el-slider v-model="star.config.fall_duration" :min="1" :max="5" />
              </div>

              <template class="color-control">
                <span class="demonstration">顏色</span>
                <el-color-picker v-model="star.config.color" show-alpha @click.stop @mousedown.stop :teleported="false" />
                <el-button class="delete-btn" @click="delete_config(index)">刪除配置</el-button>
              </template>
            </el-collapse-item>
          </el-collapse>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';

const stars_box = ref(null);
const activeName = ref('1'); //同時只能展開一項
let global_star_sum = ref(0);
let star_resource_pool = reactive([]);
//背景星星
class Star_config {
  constructor() {
    this.config = reactive({
      limit_sum: 30, //限制數量
      create_sum: 0, //實例數
      tail_length: 6, //尾焰長度  width: em
      top_offset: 50, //定位偏移    top: vh
      fall_duration: 4, //持續 --fall_duration: s
      fall_delay: 2, //延遲 --fall-delay: s
      color: 'rgba(23, 223, 200, 0.8)',
    });

    this.stop_watch = watch(
      () => this.config.create_sum,
      (newValue) => {
        if (newValue < this.config.limit_sum) {
          this.generate_star();
        }
      }
    );
    this.generate_star();
  }

  jitter_amount(x, gap) {
    function rand(min, max) {
      return (Math.random() * (max - min) + min).toFixed(2);
    }
    return rand(x - gap, x + gap);
  }

  generate_star() {
    let self = this.config;

    let div = document.createElement('div');
    div.classList.add('meteor');
    div.style.color = self.color;
    let width = this.jitter_amount(self.tail_length, 3); //長度
    div.style.width = String(width) + 'em';
    let top = this.jitter_amount(self.top_offset, 45); //定位
    div.style.top = String(top) + 'vh';
    let fall_duration = this.jitter_amount(self.fall_duration, 1); //動畫
    let fall_delay = this.jitter_amount(self.fall_delay, 2);
    div.style.setProperty('--fall-duration', fall_duration + 's');
    div.style.setProperty('--fall-delay', fall_delay + 's');

    div.addEventListener('animationend', function (event) {
      if (event.animationName === 'fall') {
        div.remove();
        self.create_sum -= 1;
      }
    });

    stars_box.value.appendChild(div);
    self.create_sum += 1;
  }
}

function add_config() {
  star_resource_pool.push(new Star_config());
}
function delete_config(index) {
  star_resource_pool[index].stop_watch();
  star_resource_pool.splice(index, 1);
}

onMounted(() => {
  star_resource_pool.push(new Star_config());
});
</script>

<style scoped>
.panel {
  display: block;
}
.slider-demo-block,
.color-control {
  display: flex;
  padding-right: 8px;
}
.el-color-picker {
  padding-left: 24px;
}
.slider-demo-block .demonstration {
  width: 30%;
}
.delete-btn {
  margin-right: 0;
  margin-left: auto;
}

::v-deep .el-collapse-item__header {
  border-radius: 0;
}

/* 齒輪 */
.start {
  position: fixed;
  top: 20px;
  right: 20px;
  color: #ffffff;
}
.el-popper__arrow {
  display: none;
}

/* 星星容器 */
.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 150%;
  transform: rotate(-45deg);
}

.stars .meteor:nth-child(even) {
  color: #8bb4b3;
}
.meteor::before,
.meteor::after {
  position: absolute;
  content: '';
  top: 0;
  left: calc(1em / -2);
  width: 1em;
  height: 100%;
  background: linear-gradient(45deg, transparent, currentColor, transparent);
  border-radius: inherit;
  animation: blink 1s linear infinite;
}
.meteor::before {
  transform: rotate(45deg);
}
.meteor::after {
  transform: rotate(-45deg);
}
</style>

<style>
.meteor {
  position: absolute !important;
  left: 0;
  height: 2px; /*線條粗細*/
  color: #2afaf2;
  background: linear-gradient(45deg, currentColor, transparent); /*尾焰*/
  border-radius: 50%;
  filter: drop-shadow(0 0 6px currentColor);
  transform: translate3d(104em, 0, 0);
  animation:
    fall var(--fall-duration) var(--fall-delay) linear 2,
    tail-fade var(--fall-duration) var(--fall-delay) ease-out 2;
}

@keyframes fall {
  to {
    transform: translate3d(10em, 0, 0);
  }
  100% {
    transform: translate3d(-30em, 0, 0);
  }
}
@keyframes tail-fade {
  0%,
  50% {
    width: 6em;
    opacity: 1;
  }
  70%,
  80% {
    width: 0;
    opacity: 0.4;
  }
  100% {
    width: 0;
    opacity: 0;
  }
}
@keyframes blink {
  50% {
    opacity: 0.6;
  }
}
</style>
