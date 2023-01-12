<script lang="ts">
export default {
  name: "StageContainer",
};
</script>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";

import BayesInfoModalVue from "./BayesInfoModal.vue";
import Konva from "konva/lib/Core";
import "konva/lib/shapes/Rect";

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

const visible = ref(false);

const width = window.innerWidth;
const height = window.innerHeight;

onMounted(() => {
  getAreaList();
  // for (let n = 0; n < 300; n++) {
  //   list.value.push({
  //     id: n,
  //     x: Math.random() * width,
  //     y: Math.random() * height,
  //     rotation: Math.random() * 180,
  //     scale: Math.random(),
  //   });
  // }

  const stage = new Konva.Stage({
    container: "container",
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
  });

  const layer = new Konva.Layer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rect1 = new (Konva as any).Rect({
    x: 20,
    y: 20,
    width: 100,
    height: 50,
    fill: "green",
    stroke: "black",
    strokeWidth: 4,
  });
  // add the shape to the layer
  layer.add(rect1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rect2 = new (Konva as any).Rect({
    x: 150,
    y: 40,
    width: 100,
    height: 50,
    fill: "red",
    shadowBlur: 10,
    cornerRadius: 10,
  });
  layer.add(rect2);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rect3 = new (Konva as any).Rect({
    x: 50,
    y: 120,
    width: 100,
    height: 100,
    fill: "blue",
    cornerRadius: [0, 10, 20, 30],
  });
  layer.add(rect3);

  // add the layer to the stage
  stage.add(layer);
});

function getAreaList() {
  fetch("/stage.json")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
    });
}

// function handleCacheChange(e: any) {
//   const shouldCache = e.target.checked;
//   if (shouldCache) {
//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     groupRef.value!.getNode().cache();
//   } else {
//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     groupRef.value!.getNode().clearCache();
//   }
// }
</script>

<template>
  <div>
    <div id="container"></div>

    <!-- <v-stage ref="stageRef" :config="stageConfig">
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
    </v-stage> -->
    <!-- <div class="cache">
      <input type="checkbox" @change="handleCacheChange" /> cache shapes
    </div> -->

    <BayesInfoModalVue v-model="visible" bayeNo="A103" />

    <div @click="visible = true">visible</div>
  </div>
</template>

<style scoped></style>
