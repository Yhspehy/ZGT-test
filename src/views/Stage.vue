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

// 生成rect的基准，默认放大5倍，基数是1px
const benchmarkOfRect = ref(5);
// 箱区的基准，避免rect变大，而箱区靠拢
const benchmarkOfArea = ref(2);

// stageRef
const stageRef = ref<Element | null>(null);
// stage scale
const scale = ref(1);

// 贝位modal的展示
const visible = ref(false);
const areaNo = ref("");
const bayeNo = ref("");
const endBay = ref("");

onMounted(() => {
  getAreaList();
});

/**
 * 获取stage数据
 */
function getAreaList() {
  fetch("/stage.json")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      walkTree(res.data);
    });
}

/**
 * 遍历数据，初始化state，绘制canvas
 * 如果需要刷新，则需要将state状态提取出来
 * @param data  StageType
 */
function walkTree(data: StageType) {
  const { berthesInfo, yardAreasInfo } = data;

  const stage = new Konva.Stage({
    container: "container",
    // width: app.scrollWidth,
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
  });

  const layer = new Konva.Layer();

  // 遍历泊场
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
          // 自定义数据
          bayeNo: bayeInfo.YBY_BAYNO,
          areaNo: bayeInfo.YBY_ARE_AREANO,
          endBay: areaInfo.ARE_EDBAY,
        });
        layer.add(rect);
      }
    }
  }

  /**
   * Event Delegation
   * 避免多个rect绑定
   */
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
    (stageRef.value as HTMLElement).onwheel = zoom;
  });
}

function zoom(event: WheelEvent) {
  event.preventDefault();

  /**
   * 防止展示弹窗的时候滚动canvas
   */
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
