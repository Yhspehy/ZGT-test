<script lang="ts">
export default {
  name: "StageContainer",
};
</script>

<script setup lang="ts">
import { Button } from "ant-design-vue";
import "ant-design-vue/lib/button/style/css";

fetch("/stage.json")
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    console.log(res);
  });
</script>

<template>
  <Button>111</Button>
</template>

<style scoped></style>
