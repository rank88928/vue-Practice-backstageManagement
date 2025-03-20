<template>
  <div class="data-map">
    <WeatherForecast v-on:get="weather" :class="{ weather: true, anim: anim_switch }" :city="specify_city" />
    <Map class="map" v-on:click="pick"></Map>
    <div class="tourism-card-container" v-if="travel_data.length > 0">
      <div class="collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="景點文物" name="1">
            <TourismCard :data="travel_data"> </TourismCard>
          </el-collapse-item>
          <el-collapse-item title="美食餐飲" name="2">
            <TourismCard :data="travel_data"> </TourismCard>
          </el-collapse-item>
          <el-collapse-item title="旅遊住宿" name="3">
            <TourismCard :data="travel_data"> </TourismCard>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue';
import Map from '@/components/home/map.vue';
import WeatherForecast from '@/components/home/WeatherForecast.vue';
import TourismCard from '../components/home/TourismCard.vue';
import { travel_format, travel_upload, travel_api as travel_serve } from '@/api/travel_api.js';

let travel_api = travel_serve();

let specify_city = ref('嘉義市');
let anim_switch = ref(false);
let travel_data = reactive([]);
function pick(e) {
  if (anim_switch.value === false) {
    anim_switch.value = true;
  }

  setTimeout(() => {
    anim_switch.value = false;
    specify_city.value = e.properties.COUNTYNAME;
  }, 500);
}

function weather() {
  if (anim_switch.value === false) {
    anim_switch.value = true;
  }
  setTimeout(() => {
    anim_switch.value = false;
    specify_city.value = '嘉義市';
  }, 500);
}

onMounted(async () => {
  let data = await travel_api.get_all_travel_data();

  travel_data.splice(0, 0, ...data.attractions); //資料格式在api轉換
});

// attractions_format();
</script>

<style scoped>
.data-map {
  display: flex;
  justify-content: space-between;
}
.weather {
  width: 250px;
  height: 280px;
  border-radius: 20px;
  margin: 16px;
  overflow: hidden;
  transition: 0.5s ease;
  background: linear-gradient(135deg, #00fed8aa, #5b548a5c);
  color: #517d79;
}

.anim {
  opacity: 0;
  height: 0px !important;
}

.map {
  width: 40%;
  margin-top: 60px;
}

.tourism-card-container {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  width: 35%;
  max-height: calc(100vh - 120px);
  overflow: auto;
  padding-right: 15px;
  box-sizing: border-box;
  scrollbar-gutter: stable;
}

::v-deep .el-collapse-item__header {
  background-color: #d7ecff;
  border-radius: 0;
  font-size: 24px;
  text-align: center;
  padding-left: 50px;
}
</style>
