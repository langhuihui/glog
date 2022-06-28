<template>
  <n-card size="small" closable segmented>
    <template #header>
      <n-ellipsis :line-clamp="1">
        {{ lines.key }}
      </n-ellipsis>
    </template>
    <template #header-extra>
      <n-tag> {{ lines.length }} </n-tag>
      <div style="width: 200px;padding:0 20px">
        <n-slider v-model:value="pagination.pageSize" :min="1" />
      </div>
      <n-button-group>
        <n-button @click="lines.length = 0">
          <template #icon>
            <n-icon>
              <Forbid2 />
            </n-icon>
          </template>
        </n-button>
      </n-button-group>
    </template>
    <n-data-table :pagination="pagination" :columns="columns" :data="data"
      :row-key="(rawData: string[]) => rawData[0]" />
    <!-- <n-log ref="logInstRef" :lines="lines" trim :rows="rows" language="glog" /> -->
  </n-card>
</template>
<script setup  lang="ts">
import { defineProps, reactive, computed } from 'vue';
// import { LogInst } from 'naive-ui';
import { Forbid2 } from '@vicons/tabler';
const pagination = reactive({
  pageSize: 50,
});
// const logInstRef = ref<LogInst | null>(null);
const props = defineProps({
  lines: {
    default: Object.assign([] as string[][], { key: "" }),
  },
});
const data = computed(() => {
  return props.lines.map(([time, ...content]) => {
    return {
      time,
      content: content.join(" "),
    };
  });
});
const columns = [
  {
    title: 'time',
    key: 'time',
    width: 200
  },
  {
    title: 'content',
    key: 'content'
  },
];

</script>