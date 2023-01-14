<script lang="ts">
export default {
  name: "AreaDrag",
};
</script>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

import Konva from "konva/lib/Core";
import "konva/lib/shapes/Rect";
import "konva/lib/shapes/Text";

import { message } from "ant-design-vue";
import "ant-design-vue/lib/message/style/css";

import { berthesInfo } from "@/utils/dict";

import type { BerthesInfo, AreaSettingInfo } from "./type";

// 生成rect的基准，默认放大5倍，基数是1px
const benchmarkOfRect = ref(5);
// 箱区的基准，避免rect变大，而箱区靠拢
const benchmarkOfArea = ref(2);

// stageRef && stageEl && layerEl && layerAxisEl
const stageRef = ref<Element | null>(null);
let stageEl: any = null;
let layerEl: any = null;

// cache el
let rectEl: any = null;
let textEl: any = null;
// stage scale
const scale = ref(1);

// areaList
let areaList: AreaSettingInfo[] = [];

onMounted(() => {
  const yardAreasInfo = getAreaList();
  renderArea({
    berthesInfo,
    yardAreasInfo,
  });
});

/**
 * 获取stage数据
 */
function getAreaList() {
  const _areaList = localStorage.getItem("areaList");
  if (_areaList) {
    areaList = JSON.parse(_areaList) as AreaSettingInfo[];
    return areaList;
  } else {
    message.error("暂无场地数据，请先添加场地");
    return [];
  }
}

function renderArea(data: {
  berthesInfo: BerthesInfo[];
  yardAreasInfo: AreaSettingInfo[];
}) {
  const { berthesInfo, yardAreasInfo } = data;

  const stage = new Konva.Stage({
    container: "container",
    width: window.innerWidth - 20,
    height: window.innerHeight,
    draggable: true,
  });

  stageEl = stage;

  /**
   * cache text and rect
   */
  rectEl = new (Konva as any).Rect({
    x: 0,
    y: 0,
    width: benchmarkOfRect.value * 2,
    height: benchmarkOfRect.value,
    fill: "#fff",
    stroke: "grey",
    strokeWidth: 1,
  });
  rectEl.cache();

  textEl = new (Konva as any).Text({
    x: 0,
    y: 14,
    text: "1",
    fontSize: 6,
    fill: "black",
  });
  textEl.cache();

  const layerHeader = new Konva.Layer();
  // 遍历泊场
  for (let idx = 0; idx < berthesInfo.length; idx++) {
    const berthes = berthesInfo[idx];
    const rect = rectEl.clone({
      x: parseInt(berthes.BTH_STPST) * benchmarkOfArea.value,
      y: 10,
      width:
        (parseInt(berthes.BTH_EDPST) - parseInt(berthes.BTH_STPST)) *
        benchmarkOfArea.value,
      height: 20,
      fill: "rgb(135,206,250)",
      strokeWidth: 0,
    });

    const name = textEl.clone({
      x: (parseInt(berthes.BTH_STPST) + 36) * benchmarkOfArea.value,
      y: 14,
      text: berthes.BTH_NAME,
      fontSize: 14,
    });

    layerHeader.add(rect);
    layerHeader.add(name);
  }

  stage.add(layerHeader);

  // 箱区
  const layerBaye = new Konva.Layer();
  layerEl = layerBaye;
  renderBaye(yardAreasInfo);

  stageEl.add(layerBaye);

  nextTick(() => {
    (stageRef.value as HTMLElement).onwheel = zoom;
  });
}

/**
 * 遍历倍位
 * @param yardAreasInfo
 */
function renderBaye(yardAreasInfo: AreaSettingInfo[]) {
  const start = Date.now();
  for (let areaIdx = 0; areaIdx < yardAreasInfo.length; areaIdx++) {
    const areaInfo = yardAreasInfo[areaIdx];
    const areaX = parseFloat(areaInfo.ARE_STARTX);
    const areaY = parseFloat(areaInfo.ARE_STARTY);
    const endBaye = parseInt(areaInfo.ARE_EDBAY);
    const rowNum = parseInt(areaInfo.ARE_ROWNUM);

    const group = new Konva.Group({
      x: areaX * benchmarkOfArea.value,
      y: areaY * benchmarkOfArea.value,
      width: ((endBaye + 1) / 2 + 1) * benchmarkOfRect.value * 2,
      height: (rowNum + 2) * benchmarkOfRect.value,
      draggable: true,
      areaNo: areaInfo.ARE_AREANO,
      areaIdx: areaIdx,
    });

    for (let bayeIdx = 1; bayeIdx <= endBaye; bayeIdx += 2) {
      for (let rowIdx = 0; rowIdx < rowNum; rowIdx++) {
        const rect = rectEl.clone({
          x: bayeIdx * benchmarkOfRect.value,
          y: rowIdx * benchmarkOfRect.value,
          width: benchmarkOfRect.value * 2,
          height: benchmarkOfRect.value,
          stroke: "grey",
          strokeWidth: 1,
        });
        group.add(rect);
      }
      layerEl.add(group);
    }

    group.on("dragstart", function () {
      document.body.style.cursor = "pointer";
    });
    group.on("dragend", function () {
      document.body.style.cursor = "default";
      areaList[this.attrs.areaIdx].ARE_STARTX =
        this.x() / benchmarkOfArea.value + "";
      areaList[this.attrs.areaIdx].ARE_STARTY =
        this.y() / benchmarkOfArea.value + "";
      localStorage.setItem("areaList", JSON.stringify(areaList));
      refresh();
    });
  }
  console.log("draw time: " + (Date.now() - start) + "ms");
}

function refresh() {
  layerEl.destroyChildren();
  const yardAreasInfo = getAreaList();
  renderBaye(yardAreasInfo);
}

function zoom(event: WheelEvent) {
  event.preventDefault();

  scale.value += event.deltaY * -0.01 * 0.1;
  scale.value = Math.min(Math.max(0.125, scale.value), 10);
  stageEl.scale({
    x: scale.value,
    y: scale.value,
  });
}
</script>

<template>
  <div id="container" ref="stageRef"></div>
</template>

<style lang="scss" scoed>
#container {
  margin-left: 20px;
}
</style>
