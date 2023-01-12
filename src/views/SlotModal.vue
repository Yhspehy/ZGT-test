<script lang="ts">
export default {
  name: "SlotModal",
};
</script>

<script setup lang="ts">
import { ref, watch } from "vue";

import { Tabs as ATabs, Table as ATable } from "ant-design-vue";
import "ant-design-vue/lib/tabs/style/css";
import "ant-design-vue/lib/table/style/css";

const TabPane = ATabs.TabPane;

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  bayeNo: {
    type: String,
    default: "",
  },
  slotNo: {
    type: String,
    default: "",
  },
});

const emit = defineEmits<{
  (e: "input", val: boolean): void;
}>();

// 箱子数据
const tab1Data = ref({});
const tab2Data = ref([]);
const tab3Data = ref([]);

const tab = ref<1 | 2 | 3>(1);

// 箱信息map
const tab1Map = [
  {
    label: "箱号",
    key: "IYC_CNTRNO",
    class: "col-4",
  },
  {
    label: "船名",
    key: "keVSL_CDy",
    class: "col-4",
  },
  {
    label: "航次",
    key: "VSL_VOYAGE",
    class: "col-4",
  },
  {
    label: "箱位",
    key: "IYC_FLFG",
    class: "col-4",
  },
  {
    label: "尺寸",
    key: "IYC_CNTRNO",
    class: "col-4",
  },
  {
    label: "状态",
    key: "keVSL_CDy",
    class: "col-4",
  },
  {
    label: "类型",
    key: "VSL_VOYAGE",
    class: "col-4",
  },
  {
    label: "高度",
    key: "IYC_FLFG",
    class: "col-4",
  },
  {
    label: "装货港",
    key: "IYC_CNTRNO",
    class: "col-4",
  },
  {
    label: "卸货港",
    key: "keVSL_CDy",
    class: "col-4",
  },
  {
    label: "目的港",
    key: "VSL_VOYAGE",
    class: "col-4",
  },
  {
    label: "中转港",
    key: "IYC_FLFG",
    class: "col-4",
  },
  {
    label: "自重",
    key: "keVSL_CDy",
    class: "col-3",
  },
  {
    label: "总重",
    key: "VSL_VOYAGE",
    class: "col-3",
  },
  {
    label: "封船号",
    key: "IYC_FLFG",
    class: "col-3",
  },
  {
    label: "起始温度",
    key: "keVSL_CDy",
    class: "col-3",
  },
  {
    label: "终止温度",
    key: "VSL_VOYAGE",
    class: "col-3",
  },
  {
    label: "危险品级别",
    key: "IYC_FLFG",
    class: "col-3",
  },
  {
    label: "持箱人",
    key: "keVSL_CDy",
    class: "col-3",
  },
  {
    label: "超限",
    key: "VSL_VOYAGE",
    class: "col-3",
  },
  {
    label: "整拼标志",
    key: "IYC_FLFG",
    class: "col-3",
  },
  {
    label: "残损",
    key: "keVSL_CDy",
    class: "col-3",
  },
  {
    label: "坏污",
    key: "VSL_VOYAGE",
    class: "col-3",
  },
  {
    label: "运输方式",
    key: "IYC_FLFG",
    class: "col-3",
  },
  {
    label: "超高",
    key: "keVSL_CDy",
    class: "col-3",
  },
  {
    label: "前后超长",
    key: "VSL_VOYAGE",
    class: "col-3",
  },
  {
    label: "左右超宽",
    key: "IYC_FLFG",
    class: "col-3",
  },
  {
    label: "进场方式",
    key: "keVSL_CDy",
    class: "col-2",
  },
  {
    label: "进场时间",
    key: "VSL_VOYAGE",
    class: "col-2",
  },
  {
    label: "出场方式",
    key: "IYC_FLFG",
    class: "col-2",
  },
  {
    label: "出场时间",
    key: "keVSL_CDy",
    class: "col-2",
  },
  {
    label: "重箱放关",
    key: "VSL_VOYAGE",
    class: "col-2",
  },
  {
    label: "空箱放关",
    key: "IYC_FLFG",
    class: "col-2",
  },
];

// 箱动态table column
const columns = [
  {
    title: "操作时间",
    dataIndex: "IYA_OPDT",
    key: "IYA_OPDT",
  },
  {
    title: "操作过程",
    dataIndex: "IYA_OPPRC",
    key: "IYA_OPPRC",
  },
  {
    title: "作业方式",
    dataIndex: "IYA_OPMODE",
    key: "IYA_OPMODE",
  },
  {
    title: "车次/日期",
    dataIndex: "IYA_VSLVOY",
    key: "IYA_VSLVOY",
  },
  {
    title: "司机",
    dataIndex: "IYA_DRIVER",
    key: "IYA_DRIVER",
  },
  {
    title: "箱状态",
    dataIndex: "STS_NAME",
    key: "STS_NAME",
  },
];

watch(
  () => props.value,
  (value) => {
    if (value) getSlotData();
  }
);

function getSlotData(): void {
  // 可传入baye参数
  // loading可同时加上
  fetch("/box.json")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      const { containerDetailsInfo, containerActivitiesInfo, goodsInfo } =
        res.data;
      console.log(containerDetailsInfo);
      tab1Data.value = containerDetailsInfo;
      tab2Data.value = containerActivitiesInfo;
      tab3Data.value = goodsInfo;
    });
}

function callback(tabKey: 1 | 2 | 3) {
  tab.value = tabKey;
}
</script>

<template>
  <a-modal
    ref="modalRef"
    :title="slotNo"
    :visible="props.value"
    @ok="emit('input', false)"
    @cancel="emit('input', false)"
    cancelText="取消"
    okText="确定"
    :width="1000"
  >
    <div class="bayes-info">
      <a-tabs default-active-key="1" @change="callback">
        <tab-pane key="1" tab="箱信息">
          <div class="info-wrap">
            <div
              v-for="info in tab1Map"
              :key="info.label"
              :class="['info-section', info.class]"
            >
              <div class="label">{{ info.label }}</div>
              <div class="value">{{ tab1Data[info.key] || "" }}</div>
            </div>
          </div>
        </tab-pane>
        <tab-pane key="2" tab="箱动态">
          <a-table :columns="columns" :data-source="tab2Data"></a-table>
        </tab-pane>
        <tab-pane key="3" tab="箱货信息">
          <a-table :columns="columns" :data-source="tab2Data">
            <a slot="name" slot-scope="text">{{ text }}</a>
          </a-table>
        </tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">
.info-wrap {
  @include flex-start-center;
  flex-wrap: wrap;

  .info-section {
    @include flex-start-center;
    margin-bottom: 10px;

    .label {
      margin-right: 10px;
      text-align: right;
      width: 70px;
    }
    .value {
      background-color: #f4f4f4;
      padding: 0 10px;
      border-radius: 2px;
      height: 33px;
      line-height: 33px;
    }
  }

  .col-4 {
    width: 25%;

    .value {
      min-width: 100px;
    }
  }

  .col-3 {
    width: 33%;

    .value {
      min-width: 200px;
    }
  }

  .col-2 {
    width: 33%;

    .value {
      min-width: 200px;
    }
  }

  .col-2:nth-child(2n + 1) {
    margin-right: 50px;
  }
}
</style>
