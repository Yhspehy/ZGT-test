<script lang="ts">
export default {
  name: "StageContainer",
};
</script>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

import BayesInfoModal from "./BayesInfoModal.vue";
import SettingListModal from "./SettingListModal.vue";

import Konva from "konva/lib/Core";
import "konva/lib/shapes/Rect";
import "konva/lib/shapes/Text";

import { Input as AInput, Button as AButton, message } from "ant-design-vue";
import "ant-design-vue/lib/input/style/css";
import "ant-design-vue/lib/button/style/css";
import "ant-design-vue/lib/message/style/css";

import { bayeColorList, slotColorList, berthesInfo } from "@/utils/dict";
import { mockData } from "@/utils/mock";

import type { StageType, AreaSettingInfo, YardAreasInfo } from "./type";

// 生成rect的基准，默认放大5倍，基数是1px
const benchmarkOfRect = ref(5);
// 箱区的基准，避免rect变大，而箱区靠拢
const benchmarkOfArea = ref(2);

// stageRef && stageEl && layerEl && layerAxisEl
const stageRef = ref<Element | null>(null);
let stageEl: any = null;
let layerEl: any = null;
let layerAxisEl: any = null;
let layerIdEl: any = null;

// cache el
let rectEl: any = null;
let textEl: any = null;
// stage scale
const scale = ref(1);

// 贝位modal的展示
const visible = ref(false);
const areaNo = ref("");
const bayeNo = ref("");
const endBay = ref("");
const slotNo = ref("");

// 搜索内容
const searchValue = ref("");

// 场地维护的展示
const settingVisible = ref(false);

onMounted(() => {
  const yardAreasInfo = getAreaList();
  walkStage({
    berthesInfo,
    vesselBertherInfo: [],
    yardAreasInfo,
  });
});

/**
 * 获取stage数据
 */
function getAreaList() {
  const areaList = localStorage.getItem("areaList");
  if (areaList) {
    const _areaList = JSON.parse(areaList) as AreaSettingInfo[];
    const yardAreasInfo = mockData(_areaList);
    return yardAreasInfo;
  } else {
    message.error("暂无场地数据，请先添加场地");
    return [];
  }
}

/**
 * 遍历数据，初始化state，绘制canvas
 * 如果需要刷新，则需要将state状态提取出来
 * @param data  StageType
 */
function walkStage(data: StageType) {
  const { berthesInfo, yardAreasInfo } = data;

  const stage = new Konva.Stage({
    container: "container",
    // width: app.scrollWidth,
    width: window.innerWidth - 20,
    // height: window.innerHeight,
    height: 600,
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
  walkBaye(yardAreasInfo);

  setTimeout(() => {
    // 渲染ID
    drawId(yardAreasInfo);
    // 渲染坐标
    drawAxis(yardAreasInfo);
  }, 1000);

  /**
   * Event Delegation
   * 避免多个rect绑定
   */
  layerBaye.on("click", (evt: any) => {
    const rect = evt.target;
    if (rect) {
      bayeNo.value = rect.attrs.bayeNo;
      areaNo.value = rect.attrs.areaNo;
      endBay.value = rect.attrs.endBay;
      visible.value = true;
    }
  });
  stageEl.add(layerBaye);

  nextTick(() => {
    (stageRef.value as HTMLElement).onwheel = zoom;
  });
}

/**
 * 遍历倍位
 * @param yardAreasInfo
 */
function walkBaye(yardAreasInfo: YardAreasInfo[]) {
  const start = Date.now();
  for (let areaIdx = 0; areaIdx < yardAreasInfo.length; areaIdx++) {
    const areaInfo = yardAreasInfo[areaIdx];
    const areaX = parseInt(areaInfo.ARE_STARTX);
    const areaY = parseInt(areaInfo.ARE_STARTY);
    const bayeList = areaInfo.yardBayesInfo;

    // 每个箱区的贝
    // 因为贝是从右往左，所以倒序
    if (areaInfo.ARE_BAYWAY === "LR") {
      bayeList.reverse();
    }
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
        const rect = rectEl.clone({
          x:
            areaX * benchmarkOfArea.value + bayeIdx * benchmarkOfRect.value * 2,
          y: areaY * benchmarkOfArea.value + rowIdx * benchmarkOfRect.value,
          width: benchmarkOfRect.value * 2,
          height: benchmarkOfRect.value,
          fill: bayeColorList[rowInfo.ContainerNum].color,
          stroke: "grey",
          strokeWidth: 1,
          // 自定义数据
          bayeNo: bayeInfo.YBY_BAYNO,
          areaNo: bayeInfo.YBY_ARE_AREANO,
          endBay: areaInfo.ARE_EDBAY,
        });
        layerEl.add(rect);
      }
    }
  }
  layerEl.draw();
  console.log("draw time: " + (Date.now() - start) + "ms");
}

function drawAxis(yardAreasInfo: YardAreasInfo[]) {
  if (!layerAxisEl) {
    layerAxisEl = new Konva.Layer();
  }

  for (let areaIdx = 0; areaIdx < yardAreasInfo.length; areaIdx++) {
    const areaInfo = yardAreasInfo[areaIdx];
    const areaX = parseInt(areaInfo.ARE_STARTX);
    const areaY = parseInt(areaInfo.ARE_STARTY);
    const rowNum = parseInt(areaInfo.ARE_ROWNUM);
    const endBay = parseInt(areaInfo.ARE_EDBAY);

    // 先画列
    for (let rowIdx = 0; rowIdx < rowNum; rowIdx++) {
      const text = textEl.clone({
        x: (areaX - 2) * benchmarkOfArea.value,
        y: areaY * benchmarkOfArea.value + rowIdx * benchmarkOfRect.value,
        text: "1",
      });
      layerAxisEl.add(text);
    }

    // 每个箱区的贝
    // 因为贝是从右往左，所以倒序
    if (areaInfo.ARE_BAYWAY === "LR") {
      for (let rowIdx = 1; rowIdx <= endBay; rowIdx += 2) {
        const text = textEl.clone({
          x:
            areaX * benchmarkOfArea.value +
            (rowIdx - 1) * benchmarkOfRect.value,
          y: areaY * benchmarkOfArea.value - benchmarkOfRect.value * 1.4,
          text: rowIdx < 10 ? "0" + rowIdx : rowIdx,
          align: "center",
          width: benchmarkOfRect.value * 2,
        });
        layerAxisEl.add(text);
      }
    } else {
      for (let rowIdx = endBay; rowIdx > 0; rowIdx -= 2) {
        const text = textEl.clone({
          x:
            areaX * benchmarkOfArea.value +
            (endBay - rowIdx) * benchmarkOfRect.value,
          y: areaY * benchmarkOfArea.value - benchmarkOfRect.value * 1.4,
          text: rowIdx < 10 ? "0" + rowIdx : rowIdx,
          align: "center",
          width: benchmarkOfRect.value * 2,
        });
        layerAxisEl.add(text);
      }
    }
  }
}

function drawId(yardAreasInfo: YardAreasInfo[]) {
  if (!layerIdEl) {
    layerIdEl = new Konva.Layer();
  }

  for (let areaIdx = 0; areaIdx < yardAreasInfo.length; areaIdx++) {
    const areaInfo = yardAreasInfo[areaIdx];
    const areaX = parseInt(areaInfo.ARE_STARTX);
    const areaY = parseInt(areaInfo.ARE_STARTY);
    const text = textEl.clone({
      x: (areaX - 4) * benchmarkOfArea.value,
      y: areaY * benchmarkOfArea.value - benchmarkOfRect.value * 1.4,
      text: areaInfo.ARE_AREANO,
    });
    layerIdEl.add(text);
  }
}

function refresh() {
  layerEl.destroyChildren();
  layerAxisEl.destroyChildren();
  layerIdEl.destroyChildren();
  const yardAreasInfo = getAreaList();
  walkBaye(yardAreasInfo);
  setTimeout(() => {
    // 渲染ID
    drawId(yardAreasInfo);
    // 渲染坐标
    drawAxis(yardAreasInfo);
  }, 1000);
}

function zoom(event: WheelEvent) {
  event.preventDefault();

  /**
   * 防止展示弹窗的时候滚动canvas
   */
  if (visible.value) return;

  scale.value += event.deltaY * -0.01 * 0.1;
  scale.value = Math.min(Math.max(0.125, scale.value), 10);
  stageEl.scale({
    x: scale.value,
    y: scale.value,
  });
  if (scale.value > 3) {
    stageEl.add(layerAxisEl);
    stageEl.add(layerIdEl);
  } else if (scale.value > 2) {
    stageEl.add(layerIdEl);
    layerAxisEl.remove();
  } else {
    layerIdEl.remove();
    layerAxisEl.remove();
  }
}

function search() {
  if (searchValue.value.length !== 6) {
    return message.error("请输入6位箱号");
  }
  // 还有其他的判断条件可以逐步加上

  areaNo.value = searchValue.value.slice(0, 2);
  bayeNo.value = searchValue.value.slice(2, 4);
  endBay.value = "17";
  slotNo.value = searchValue.value;
  visible.value = true;
}
</script>

<template>
  <div>
    <!-- 顶部曹作栏 -->
    <div class="operate-header">
      <a-button class="refresh" type="primary" @click="refresh">刷新</a-button>

      <a-input
        class="navigate-input"
        v-model="searchValue"
        style="width: 200px"
        @keyup.enter.native="search"
      />
      <a-button @click="search" type="primary">搜索</a-button>

      <a-button class="setting" @click="settingVisible = true">
        场地设置
      </a-button>
    </div>

    <!-- canvas -->
    <div id="container" ref="stageRef"></div>

    <!-- 颜色说明 -->
    <div class="color-container">
      <div class="baye-color">
        <div v-for="el in bayeColorList" :key="el.label" class="column">
          <div class="label">{{ el.label }}层高颜色样式</div>
          <div class="color" :style="{ backgroundColor: el.color }"></div>
        </div>
      </div>
      <div class="slot-color">
        <div v-for="el in slotColorList" :key="el.label" class="column">
          <div class="label">{{ el.label }}箱颜色样式</div>
          <div class="color" :style="{ backgroundColor: el.color }"></div>
        </div>
      </div>
    </div>

    <!-- 贝位弹窗 -->
    <bayes-info-modal
      v-model="visible"
      :areaNo="areaNo"
      :bayeNo="bayeNo"
      :endBay="endBay"
      :slotNo="slotNo"
    />

    <!-- 场地维护列表 -->
    <setting-list-modal v-model="settingVisible" @refresh="refresh" />
  </div>
</template>

<style lang="scss" scoed>
.operate-header {
  @include flex-start-center;
  margin-bottom: 30px;
  margin-left: 20px;

  .refresh {
    margin-right: 30px;
  }

  .setting {
    margin-left: 30px;
  }
}

#container {
  margin-left: 20px;
}

.color-container {
  @include flex-start;
  margin-left: 20px;
  color: black;

  .baye-color,
  .slot-color {
    margin-right: 30px;

    .column {
      @include flex-start-center;

      .color {
        width: 20px;
        height: 10px;
        margin-left: 4px;
        border: 1px solid grey;
      }
    }
  }
}
</style>
