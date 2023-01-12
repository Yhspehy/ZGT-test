<script lang="ts">
export default {
  name: "BayesInfoModal",
};
</script>

<script setup lang="ts">
import { ref, watch } from "vue";

import { Input as AInput, Button as AButton } from "ant-design-vue";
import "ant-design-vue/lib/input/style/css";
import "ant-design-vue/lib/button/style/css";

import SlotModal from "./SlotModal.vue";

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
// slotModal visiable
const slotVisiable = ref(false);
// slotNo
const slotNo = ref("");

watch(
  () => props.value,
  (value) => {
    if (value && bayesInfoList.value.length === 0) getList();
  }
);

function getList(): void {
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

  getList();
}

function showSlot(col: number, row: number) {
  if (bayesInfoList.value?.[col - 1]?.[row - 1]?.YST_SLOTNO) {
    const slotNoVal = bayesInfoList.value?.[col - 1]?.[row - 1]?.YST_SLOTNO;
    slotNo.value = slotNoVal;
    slotVisiable.value = true;
  }
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

        <a-button class="refresh" @click="getList">刷新</a-button>
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
            <div v-for="col in axis[0]" :key="col" class="col">
              <div
                v-for="row in axis[1]"
                :key="col + '-' + row"
                class="slot-wrap cursor"
                @click="() => showSlot(col, row)"
              >
                <template
                  v-if="
                    bayesInfoList[col - 1] && bayesInfoList[col - 1][row - 1]
                  "
                >
                  <div
                    class="slot cursor"
                    :style="{
                      backgroundColor: bayesInfoList[col - 1][row - 1].STS_EFFG
                        ? bayesInfoList[col - 1][row - 1].STS_EFFG === 'E'
                          ? '#d3fdd1'
                          : 'orange'
                        : '#fff',
                    }"
                  >
                    <div>IYC_CNTRNO</div>
                    <div>GP</div>
                    <div>IE SAC</div>
                    <div>HSK</div>
                    <div>
                      {{
                        bayesInfoList[col - 1][row - 1].YST_AREBAY +
                        bayesInfoList[col - 1][row - 1].YST_ROWNO +
                        bayesInfoList[col - 1][row - 1].YST_TIERNO
                      }}
                    </div>
                  </div>
                </template>
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

    <slot-modal v-model="slotVisiable" :slotNo="slotNo" />
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

    .getList {
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
        @include flex-column;
        flex-direction: column-reverse;
        flex: 1;
        .slot-wrap {
          height: 127px;
          // background-color: #d3fdd1;
          border: 1px solid grey;
          margin: 0px 10px 10px 0;

          .slot {
            height: 100%;
            padding: 10px;
          }
        }
      }
    }
  }
}
</style>
