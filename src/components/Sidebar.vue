<template>
  <div class="sidebar">
    <ul>
      <li>商品管理</li>
      <li>訂單管理</li>
      <li>帳號管理</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'sidebar',
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #001529;
  padding-top: 60px;
}

ul li {
  font-size: 24px;
  text-align: center;
  margin: 16px 0 16px 0;
  color: #828282;
  padding: 8px;
  border-radius: 8px;
}

ul li:hover {
  background-color: #1677ff;
  cursor: pointer;
  color: #ffffff;
}
</style>
