<script lang="ts">
export default {
  name: "HandleAreaModal",
};
</script>

<script setup lang="ts">
import type { PropType } from "vue";
import { ref, watch } from "vue";

import { Input as AInput, Radio as ARadio, message } from "ant-design-vue";
import "ant-design-vue/lib/input/style/css";
import "ant-design-vue/lib/radio/style/css";
import "ant-design-vue/lib/message/style/css";

import type { AreaSettingInfo } from "./type";
const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  edit: {
    type: Boolean,
    default: false,
  },
  editIdx: {
    type: Number,
    default: 0,
  },
  list: {
    type: Array,
    default: Array as unknown as PropType<AreaSettingInfo>,
  },
});

const emit = defineEmits<{
  (e: "input", val: boolean): void;
  (e: "getList"): void;
}>();

const formData = ref<AreaSettingInfo>({
  ARE_AREANO: "",
  ARE_STARTY: "",
  ARE_STARTX: "",
  ARE_EDBAY: "",
  ARE_ROWNUM: "",
  ARE_ROWWAY: "RL",
});

watch(
  () => props.edit,
  (val: boolean) => {
    if (val) {
      formData.value = props.list[props.editIdx] as any;
    }
  }
);

function OK() {
  if (!formData.value.ARE_AREANO.trim()) {
    return message.error("请输入名称");
  }
  if (!formData.value.ARE_STARTY.trim()) {
    return message.error("请输入Y轴");
  }
  if (!formData.value.ARE_STARTX.trim()) {
    return message.error("请输入X轴");
  }
  if (!formData.value.ARE_EDBAY.trim()) {
    return message.error("请输入堆场宽度数量");
  }
  if (!formData.value.ARE_ROWNUM.trim()) {
    return message.error("请输入堆场高度数量");
  }
  if (parseInt(formData.value.ARE_EDBAY) % 2) {
    return message.error("堆场宽度数量必须是单数");
  }
  const _list = [...props.list] as AreaSettingInfo[];
  if (props.edit) {
    _list[props.editIdx] = formData.value;
  } else {
    if (
      _list.find(
        (e: AreaSettingInfo) => e.ARE_AREANO === formData.value.ARE_AREANO
      )
    ) {
      return message.error("该场地已存在");
    }
    _list.push(formData.value);
  }
  localStorage.setItem("areaList", JSON.stringify(_list));
  emit("getList");
  emit("input", false);
}
</script>

<template>
  <a-modal
    ref="modalRef"
    :title="edit ? '编辑' : '添加'"
    :visible="props.value"
    @ok="OK"
    @cancel="emit('input', false)"
    cancelText="取消"
    okText="确定"
    :width="600"
  >
    <div class="form">
      <div class="row">
        <div class="label">
          <div class="require">*</div>
          名称
        </div>
        <a-input
          v-model="formData.ARE_AREANO"
          class="input"
          placeholder="请输入名称"
        />
      </div>

      <div class="row">
        <div class="label">
          <div class="require">*</div>
          Y轴
        </div>
        <a-input
          v-model="formData.ARE_STARTY"
          class="input"
          placeholder="请输入Y轴"
        />
      </div>

      <div class="row">
        <div class="label">
          <div class="require">*</div>
          X轴
        </div>
        <a-input
          v-model="formData.ARE_STARTX"
          class="input"
          placeholder="请输入X轴"
        />
      </div>

      <div class="row">
        <div class="label">
          <div class="require">*</div>
          堆场宽度数量
        </div>
        <a-input
          v-model="formData.ARE_EDBAY"
          class="input"
          placeholder="请输入堆场宽度数量"
        />
      </div>

      <div class="row">
        <div class="label">
          <div class="require">*</div>
          堆场高度数量
        </div>
        <a-input
          v-model="formData.ARE_ROWNUM"
          class="input"
          placeholder="请输入堆场高度数量"
        />
      </div>

      <div class="row">
        <div class="label">倍位方向</div>
        <a-radio
          value="1"
          :checked="formData.ARE_ROWWAY === 'RL'"
          @click="formData.ARE_ROWWAY = 'RL'"
        >
          从右到左
        </a-radio>
        <a-radio
          value="2"
          :checked="formData.ARE_ROWWAY === 'LR'"
          @click="formData.ARE_ROWWAY = 'LR'"
        >
          从左到右
        </a-radio>
      </div>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">
.form {
  @include flex-column-start;

  .row {
    @include flex-start-center;
    width: 100%;
    margin-bottom: 10px;

    .label {
      @include flex-end-center;
      width: 120px;
      margin-right: 20px;

      .require {
        margin-right: 4px;
        color: #f5222d;
        font-size: 14px;
      }
    }

    .input {
      width: 300px;
    }
  }
}
</style>
