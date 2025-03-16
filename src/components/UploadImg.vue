<template>
  <div class="upload-img">
    <div class="img-box">
      <img :src="img_path" />
    </div>

    <label>
      <span>圖片上傳:</span>
      <input type="file" class="upload-btm" @change="upload" /><br />
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { preset_images } from '@/utils/img_base64';
let props = defineProps({
  img: { type: String, default: '' },
});
let emit = defineEmits(['upload']);

let img_path = ref(props.img || preset_images);

//上傳圖片 修改預覽圖
function upload(e) {
  const file = e.target.files[0]; //上傳的檔案

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      //解析成功後回調
      img_path.value = reader.result; //修改預覽圖
      emit('update', reader.result); //提供圖片源給父組件
    };
    reader.readAsDataURL(file); //異步 等瀏覽器解析
  }
}
</script>

<style scoped>
.upload-img {
  width: 100%;
  height: 100%;
}

.img-box {
  width: 100%;
  height: 90%;
  margin: 5px;
  border: 1px solid #bcbcbc;
}
.img-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
