<script lang="ts">
export default {
  name: "StageContainer",
};
</script>

<script setup lang="ts">
import VueKonva from "vue-konva";
// import Konva from 'konva/lib/Core';

// import { Button } from "ant-design-vue";
// import "ant-design-vue/lib/button/style/css";

fetch("/stage.json")
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    console.log(res);
  });
</script>

<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer>
      <v-shape
        :config="{
          sceneFunc: function (context, shape) {
            context.beginPath();
            context.moveTo(20, 50);
            context.lineTo(220, 80);
            context.quadraticCurveTo(150, 100, 260, 170);
            context.closePath();

            // special Konva.js method
            context.fillStrokeShape(shape);
          },
          fill: '#00D2FF',
          stroke: 'black',
          strokeWidth: 4,
        }"
      />
    </v-layer>
  </v-stage>
</template>

<style scoped></style>
