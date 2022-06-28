<template>
  <n-form :model="value" label-placement="left" label-width="auto" size="small">
    <n-form-item label="保留日志" path="prelog">
      <n-switch v-model:value="value.prelog" />
    </n-form-item>
    <n-form-item label="最大条数" path="maxCount">
      <n-input-number v-model:value="value.maxCount" />
    </n-form-item>
    <n-form-item label="节流阀" path="throttle">
      <n-input-number v-model:value="value.throttle" clearable />
    </n-form-item>
    <n-form-item label="监听类型" path="types">
      <n-checkbox-group v-model:value="value.listenTypes">
        <n-space item-style="display: flex;">
          <n-checkbox value="debug" label="debug" />
          <n-checkbox value="info" label="info" />
          <n-checkbox value="log" label="log" />
          <n-checkbox value="warn" label="warn" />
          <n-checkbox value="error" label="error" />
        </n-space>
      </n-checkbox-group>
    </n-form-item>
    <n-form-item label="原始输出" path="output">
      <n-checkbox-group v-model:value="value.outputs">
        <n-space item-style="display: flex;">
          <n-checkbox value="debug" label="debug" />
          <n-checkbox value="info" label="info" />
          <n-checkbox value="log" label="log" />
          <n-checkbox value="warn" label="warn" />
          <n-checkbox value="error" label="error" />
        </n-space>
      </n-checkbox-group>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue';
defineProps({
  value: {
    default: {
      useDark: false,
      maxCount: 500,
      listenTypes: ['log', 'debug'],
      outputs: ['log', 'debug'],
      throttle: 0,
      prelog: false,
    },
  },
});
</script>