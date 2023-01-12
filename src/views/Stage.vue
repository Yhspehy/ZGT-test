<script lang="ts">
export default {
  name: "StageContainer",
};
</script>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import VueKonva from "vue-konva";
// import Konva from 'konva/lib/Core';

// fetch("/stage.json")
//   .then((res) => {
//     return res.json();
//   })
//   .then((res) => {
//     console.log(res);
//   });

const stageConfig = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true,
});

const list = ref<any[]>([]);
const dragItemId = ref(null);
const groupRef = ref(null);
const stageRef = ref(null);
const layerRef = ref(null);

const width = window.innerWidth;
const height = window.innerHeight;

onMounted(() => {
  for (let n = 0; n < 300; n++) {
    list.value.push({
      id: n,
      x: Math.random() * width,
      y: Math.random() * height,
      rotation: Math.random() * 180,
      scale: Math.random(),
    });
  }
});

function handleCacheChange(e: any) {
  const shouldCache = e.target.checked;
  if (shouldCache) {
    groupRef.value.getNode().cache();
  } else {
    groupRef.value.getNode().clearCache();
  }
}
</script>

<template>
  <div>
    <v-stage ref="stageRef" :config="stageConfig">
      <v-layer ref="layerRef">
        <v-group ref="groupRef">
          <v-star
            v-for="item in list"
            :key="item.id"
            :config="{
              x: item.x,
              y: item.y,
              rotation: item.rotation,
              id: item.id,
              numPoints: 5,
              innerRadius: 30,
              outerRadius: 50,
              fill: '#89b717',
              opacity: 0.8,
              shadowColor: 'black',
              shadowBlur: 10,
              shadowOpacity: 0.6,
              scaleX: item.scale,
              scaleY: item.scale,
            }"
          />
        </v-group>
      </v-layer>
    </v-stage>
    <div class="cache">
      <input type="checkbox" @change="handleCacheChange" /> cache shapes
    </div>
  </div>
</template>

<style scoped></style>
