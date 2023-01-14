<script lang="ts">
export default {
  name: "SettingListModal",
};
</script>

<script setup lang="ts">
import { ref, watch } from "vue";

import { Table as ATable, Button as AButton } from "ant-design-vue";
import "ant-design-vue/lib/table/style/css";
import "ant-design-vue/lib/button/style/css";

import HandleAreaModal from "./HandleAreaModal.vue";

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "input", val: boolean): void;
}>();

// 箱区列表
const list = ref([]);

// 新增编辑弹窗展示
const visable = ref(false);
// 是否是编辑模式
const edit = ref(false);
// 编辑的idx
const editIdx = ref(0);

watch(
  () => props.value,
  (val) => {
    if (val) {
      getList();
    }
  }
);

const columns = [
  {
    title: "堆场名称",
    dataIndex: "ARE_AREANO",
    key: "ARE_AREANO",
  },
  {
    title: "堆场宽度数量",
    dataIndex: "ARE_EDBAY",
    key: "ARE_EDBAY",
  },
  {
    title: "堆场高度数量",
    dataIndex: "ARE_ROWNUM",
    key: "ARE_ROWNUM",
  },
  {
    title: "Y轴",
    dataIndex: "ARE_STARTY",
    key: "ARE_STARTY",
  },
  {
    title: "X轴",
    dataIndex: "xARE_STARTX",
    key: "ARE_STARTX",
  },
  {
    title: "倍位方向",
    key: "ARE_ROWWAY",
    scopedSlots: { customRender: "direction" },
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

function getList() {
  const areaList = localStorage.getItem("areaList");
  list.value = areaList ? JSON.parse(areaList) : [];
}

function addArea() {
  edit.value = false;
  visable.value = true;
}

function editArea(idx: number) {
  edit.value = true;
  editIdx.value = idx;
  visable.value = true;
}

function deleteArea(idx: number) {
  list.value.splice(idx, 1);
  localStorage.setItem("areaList", JSON.stringify(list.value));
}
</script>

<template>
  <a-modal
    ref="modalRef"
    title="堆场信息列表"
    :visible="props.value"
    @ok="emit('input', false)"
    @cancel="emit('input', false)"
    cancelText="取消"
    okText="确定"
    :width="1000"
  >
    <a-button @click="addArea" type="primary">添加</a-button>
    <a-table
      :columns="columns"
      :data-source="list"
      rowKey="ARE_AREANO"
      :pagination="false"
    >
      <span slot="direction" slot-scope="text">{{
        text === "RL" ? "从右到左" : "从左到右"
      }}</span>

      <span slot="action" slot-scope="text, record, idx">
        <a-button
          style="margin-right: 10px"
          @click="() => editArea(idx)"
          type="primary"
          >编辑</a-button
        >
        <a-button @click="() => deleteArea(idx)" type="danger">删除</a-button>
      </span>
    </a-table>

    <HandleAreaModal
      v-model="visable"
      :edit="edit"
      :editIdx="editIdx"
      :list="list"
      @getList="getList"
    />
  </a-modal>
</template>

<style scoped lang="scss"></style>
