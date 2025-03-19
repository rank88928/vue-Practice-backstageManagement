<template>
  <div class="block text-center tourism-card">
    <slot name="title"></slot>
    <el-carousel motion-blur indicator-position="none" :interval=6000 autoplay:="false">
      <el-carousel-item v-for="(item, index) in data" :key="index">
        <div class="box">
          <img class="card-img" :src="item.picture_url" alt="" />
          <div class="mask">
            <span class="name">{{ item.name }}</span>
            <span class="description">{{ item.description }}</span>
            <span class="address">{{ item.address }}</span>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
let props = defineProps(['data']);

const currentIndex = ref(0);
</script>

<style scoped>
.tourism-card {
  padding: 8px;
}
.el-carousel__container {
  height: 300px;
}

.box {
  width: 100%;
  width: 100%;
  position: relative;
}
.card-img {
  width: 100%;
  height: 300px;
  object-fit: fill;
}
.mask {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  color: #bdbdbd;
  top: 0;
  left: 0;
  background-color: #00000082;
  z-index: 999;
  flex-direction: column;
  align-items: center;
  opacity: 0; 
  transition: opacity 1s ease; 
}
.box:hover .mask {
  opacity: 1;
}

.name,
.address {
  margin: 30px;
}
.name {
  font-size: 24px;
  font-weight: 600;
}
.address {
  font-size: 16px;
}

.description {
  width: 70%;
  height: 39%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}

.el-collapse-item__content{
    padding-bottom: 0;
}
</style>
