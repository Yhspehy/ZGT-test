<script lang="ts">
export default {
  name: "BayesInfoModal",
};
</script>

<script setup lang="ts">
import { ref, watch } from "vue";

import {
  Modal as AModal,
  Input as AInput,
  Button as AButton,
} from "ant-design-vue";
import "ant-design-vue/lib/modal/style/css";
import "ant-design-vue/lib/input/style/css";
import "ant-design-vue/lib/button/style/css";

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  bayeNo: {
    type: String,
    default: "",
  },
});

const emit = defineEmits<{
  (e: "input", val: boolean): void;
}>();

// 贝位列表
const bayesInfoList = ref([]);
// 横纵轴的长度，到时候调用接口获取
const axis = ref([6, 4]);
// 当前的贝位
const _bayeNo = ref(props.bayeNo);
// input中输入的贝位
const bayeValue = ref("");

watch(
  () => props.value,
  (value) => {
    console.log(value);
    if (bayesInfoList.value.length === 0)
      fetch("/area.json")
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          bayesInfoList.value = res.data.yardSlotsAndContainersInfo;
        });
  }
);

function refresh(): void {
  // 可传入baye参数
  // loading可同时加上
  fetch("/area.json")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      bayesInfoList.value = res.data.yardSlotsAndContainersInfo;
    });
}

function toBaye() {
  _bayeNo.value = bayeValue.value;

  refresh();
}
</script>

<template>
  <a-modal
    ref="modalRef"
    title="位倍图"
    :visible="props.value"
    @ok="emit('input', false)"
    @cancel="emit('input', false)"
    cancelText="取消"
    okText="确定"
    :width="1000"
  >
    <div class="bayes-info">
      <div class="bayes-info-header">
        <div class="margin-right-20">当前{{ _bayeNo }}</div>
        <a-button>上一个</a-button>
        <a-button class="margin-right-20">下一个</a-button>

        <a-button>跳至</a-button>
        <a-input class="navigate-input" v-model="bayeValue" />
        <a-button @click="toBaye">go</a-button>

        <a-button class="refresh" @click="refresh">刷新</a-button>
      </div>

      <!-- 位倍内容 -->
      <div class="content">
        <div class="y-axis">
          <div v-for="y in axis[1]" :key="y">
            {{ y }}
          </div>
        </div>

        <div class="flex-1">
          <div class="list-warp">
            <div v-for="(col, idx) in bayesInfoList" :key="idx" class="col">
              <div v-for="slot in col" :key="slot.YST_SLOTNO" class="slot">
                <div>IYC_CNTRNO</div>
                <div>GP</div>
                <div>IE SAC</div>
                <div>HSK</div>
                <div>
                  {{ slot.YST_AREBAY + slot.YST_ROWNO + slot.YST_TIERNO }}
                </div>
              </div>
            </div>
          </div>

          <div class="x-axis">
            <div v-for="x in axis[0]" :key="x">
              {{ x }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">
.bayes-info {
  /* display: flex; */

  .bayes-info-header {
    @include flex-start-center;
    margin-bottom: 30px;

    .margin-right-20 {
      margin-right: 20px;
    }

    .navigate-input {
      width: 200px;
    }

    .refresh {
      margin-left: auto;
    }
  }

  .content {
    display: flex;

    .y-axis {
      @include flex-column-around-center;
      flex-direction: column-reverse;
      width: 30px;
      background-color: #e9e9e9;
      border-radius: 15px;
      margin-right: 30px;
    }

    .x-axis {
      @include flex-space-around;
      height: 30px;
      border-radius: 15px;
      background-color: #e9e9e9;
      margin-top: 30px;
    }

    .list-warp {
      @include flex-space-around;

      .col {
        flex: 1;
        .slot {
          background-color: #d3fdd1;
          border: 1px solid grey;
          padding: 10px;
          margin: 0px 10px 10px 0;
        }
      }
    }
  }
}
</style>
