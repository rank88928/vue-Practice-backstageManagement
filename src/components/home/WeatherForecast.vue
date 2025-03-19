<template>
  <div v-if="show" class="weather">
    即時天氣
    <div class="city">
      <span>{{ weather_data.city }}</span>
    </div>
    <div class="temp">
      <img src="@/assets/clouds.png" alt="" />
      <span>氣溫:{{ temp }}</span>
      <span class="text">{{ weather_data.weather[0].ci.name }}</span>
    </div>
    <div class="state">
      <span><img src="@/assets/humidity.png" alt="" />濕度:{{ weather_data.weather[0].pop.name }}%</span>
      <span>天候:{{ weather_data.weather[0].wx.name }}</span>
    </div>
  </div>

  <div v-else>資料加載中</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import weather_api from '../../api/weather_api';

let props = defineProps(['city']);
let data = reactive([]);
let show = ref(false);

let weather_data = computed(() => {
  return data.find((item) => item.city === props.city);
});

let temp = computed(() => {
  if (!weather_data.value) {
    return;
  }
  let highest = weather_data.value.weather[0].max.name;
  let lowest = weather_data.value.weather[0].mix.name;

  return `${lowest}°C ~ ${highest}°C`;
});

async function get_weather() {
  // let nwe_data = (await weather_api.get()).data;
  // data.splice(0, data.length, ...nwe_data);
  // show = true;
}

onMounted(() => {
  get_weather();
});
</script>

<style scoped>
.weather {
  width: 100%;
  height: 100%;
}

.city {
  margin-top: 16px;
  text-align: center;
  font-size: 28px;
  font-weight: 600;
}
.temp {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}
.temp img {
  width: 40%;
}
.temp .text {
  margin-top: 16px;
  font-size: 16px;
}

.state {
  display: flex;
  justify-content: space-around;
}
.state span img {
  width: 20px;
}
</style>
