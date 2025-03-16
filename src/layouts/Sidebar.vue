<template>
  <div class="sidebar">
    <ul>
      <li><RouterLink to="/home" active-class="active-link">首頁</RouterLink></li>
      <li><RouterLink to="/product" active-class="active-link">商品管理</RouterLink></li>
      <li><RouterLink to="/order" active-class="active-link">訂單管理</RouterLink></li>
      <li><RouterLink to="/account" active-class="active-link">帳號管理</RouterLink></li>
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
  height: 100%;
  background-color: #001529;
  overflow: hidden;
}

ul {
  padding-top: 60px;
}

ul li {
  margin-bottom: 8px;
  color: #828282;
  border-radius: 8px;
}

ul li:hover {
  background-color: #1677ff;
  cursor: pointer;
}
ul li:hover:hover a {
  color: #fff;
}

ul li a {
  font-size: 24px;
  padding: 8px 16px;
  text-align: center;
  color: #828282;
}

.active-link {
  color: #646cff;
}
</style>
