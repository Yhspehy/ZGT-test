<script lang="ts">
export default {
  name: "StageContainer",
};
</script>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

import BayesInfoModalVue from "./BayesInfoModal.vue";
import Konva from "konva/lib/Core";
import "konva/lib/shapes/Rect";
import "konva/lib/shapes/Text";

import { bayeColorList } from "@/utils/dict";
import type { StageType } from "./type";

const benchmarkOfRect = ref(5);
const benchmarkOfArea = ref(2);

const stageRef = ref<Element | null>(null);
const scale = ref(1);

// 贝位信息
const visible = ref(false);
const areaNo = ref("");
const bayeNo = ref("");
const endBay = ref("");

onMounted(() => {
  getAreaList();
});

function getAreaList() {
  fetch("/stage.json")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      walkTree(res.data);
    });
}

function walkTree(data: StageType) {
  console.log(data);
  const { berthesInfo, yardAreasInfo } = data;
  const app = document.querySelectorAll("#app")[0];

  const stage = new Konva.Stage({
    container: "container",
    width: app.scrollWidth,
    height: window.innerHeight,
    draggable: true,
  });

  const layer = new Konva.Layer();

  for (let idx = 0; idx < berthesInfo.length; idx++) {
    const berthes = berthesInfo[idx];
    const rect = new (Konva as any).Rect({
      x: parseInt(berthes.BTH_STPST) * benchmarkOfArea.value,
      y: 10,

      width:
        (parseInt(berthes.BTH_EDPST) - parseInt(berthes.BTH_STPST)) *
        benchmarkOfArea.value,
      height: 20,
      fill: "rgb(135,206,250)",
    });

    const name = new (Konva as any).Text({
      x: (parseInt(berthes.BTH_STPST) + 36) * benchmarkOfArea.value,
      y: 14,
      text: berthes.BTH_NAME,
      fontSize: 14,
      fill: "black",
    });

    layer.add(rect);
    layer.add(name);
  }

  // 箱区
  for (let areaIdx = 0; areaIdx < yardAreasInfo.length; areaIdx++) {
    const areaInfo = yardAreasInfo[areaIdx];
    const areaX = areaInfo.ARE_STARTX;
    const areaY = areaInfo.ARE_STARTY;
    const bayeList = areaInfo.yardBayesInfo;

    // 每个箱区的贝
    // 因为贝是从右往左，所以倒序
    for (let bayeIdx = bayeList.length - 1; bayeIdx >= 0; bayeIdx--) {
      const bayeInfo = bayeList[bayeIdx];
      const bayeRowList = bayeInfo.yardRowsInfo;
      /**
       * 每个贝的列，包含层高
       * -----
       * 这里的strokeWidth是按照边界左右延伸，如果设置成大于1，这样每次排列后x和y都要加上strokeWidth/2
       * 但是如果设置成1的话就不需要了，这样的话两个边界的stocke会重合，等于还是1px
       */
      for (let rowIdx = 0; rowIdx < bayeRowList.length; rowIdx++) {
        const rowInfo = bayeRowList[rowIdx];
        const rect = new (Konva as any).Rect({
          x:
            parseInt(areaX) * benchmarkOfArea.value +
            bayeIdx * benchmarkOfRect.value * 2,
          y:
            parseInt(areaY) * benchmarkOfArea.value +
            rowIdx * benchmarkOfRect.value,
          width: benchmarkOfRect.value * 2,
          height: benchmarkOfRect.value,
          fill: bayeColorList[rowInfo.ContainerNum],
          stroke: "grey",
          strokeWidth: 1,
          bayeNo: bayeInfo.YBY_BAYNO,
          areaNo: bayeInfo.YBY_ARE_AREANO,
          endBay: areaInfo.ARE_EDBAY,
        });
        layer.add(rect);
      }
    }
  }

  layer.on("click", (evt: any) => {
    const rect = evt.target;
    if (rect) {
      bayeNo.value = rect.attrs.bayeNo;
      areaNo.value = rect.attrs.areaNo;
      endBay.value = rect.attrs.endBay;
      visible.value = true;
    }
  });

  stage.add(layer);

  nextTick(() => {
    document.body.onwheel = zoom;
  });
}

function zoom(event: WheelEvent) {
  event.preventDefault();

  if (visible.value) return;

  scale.value += event.deltaY * -0.01 * 0.1;

  scale.value = Math.min(Math.max(0.125, scale.value), 4);

  (stageRef.value as HTMLElement).style.transform = `scale(${scale.value})`;
}
</script>

<template>
  <div>
    <div id="container" ref="stageRef"></div>

    <BayesInfoModalVue
      v-model="visible"
      :areaNo="areaNo"
      :bayeNo="bayeNo"
      :endBay="endBay"
    />
  </div>
</template>

<style scoped></style>
