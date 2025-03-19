<template>
  <svg ref="map_svg" width="400" height="500"></svg>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import json_data from '@/assets/COUNTY_MOI_0001.json';
let map_svg = ref(null);
let emit = defineEmits(['click']);

function generate_map() {
  var svg = d3.select(map_svg.value);
  const g = svg.append('g');

  var projectmethod = d3.geoMercator().center([122, 23.5]).scale(7000);
  var pathGenerator = d3.geoPath().projection(projectmethod);

  const geometries = topojson.feature(json_data, json_data.objects['COUNTY_MOI_1130718']);

  const paths = g.selectAll('path').data(geometries.features);

  paths
    .enter()
    .append('path')
    .attr('d', pathGenerator)
    .attr('class', 'county')
    .attr('data-index', (d, index) => index)
    .on('click', function (e, county_data) {
      emit('click', county_data); //回傳點擊縣市資料
    })
    .append('title')
    .text((d) => d.properties['COUNTYNAME']);
}

onMounted(() => {
  generate_map();
});
</script>

<style scoped>
::v-deep .county {
  fill: #00000078;
  stroke: #36e2c5;
  stroke-width: 0.3px;
  filter: drop-shadow(0 0 1px #b2f0f2) drop-shadow(0 0 1px #dbdb22);
}

::v-deep .county:hover {
  fill: #d1ae95;
}
</style>
