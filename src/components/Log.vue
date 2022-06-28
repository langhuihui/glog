<template>
  <n-card size="small" closable @close="lines.show = false" segmented>
    <template #header>
      <n-ellipsis :line-clamp="1">
        {{ lines.key }}
      </n-ellipsis>
    </template>
    <template #header-extra>
      <n-tag> {{ lines.length }} </n-tag>
      <div style="width: 200px;padding:0 20px">
        <n-slider v-model:value="rows" :min="1" />
      </div>
      <n-button-group>
        <n-button @click="snapshort">
          <template #icon>
            <n-icon>
              <Camera />
            </n-icon>
          </template>
        </n-button>
        <n-button @click="lines.length = 0">
          <template #icon>
            <n-icon>
              <Forbid2 />
            </n-icon>
          </template>
        </n-button>
      </n-button-group>
    </template>
    <n-log ref="logInstRef" :lines="showLines" trim :rows="rows" language="glog" />
  </n-card>
</template>
<script setup  lang="ts">
import { ref, defineProps, nextTick, onMounted, watchEffect, defineEmits } from 'vue';
import { LogInst } from 'naive-ui';
import { Forbid2, Camera } from '@vicons/tabler';
const rows = ref(5);
const logInstRef = ref<LogInst | null>(null);
const props = defineProps({
  lines: {
    default: Object.assign([] as string[][], { show: false, key: "" }),
  },
});
const emit = defineEmits(['snapshort']);
function snapshort() {
  emit('snapshort');
}
const showLines = ref([] as string[]);
onMounted(() => {
  watchEffect(() => {
    if (props.lines.length) {
      showLines.value = props.lines.slice(props.lines.length - rows.value).map((line) => line.join(" "));
      nextTick(() => {
        logInstRef.value?.scrollTo({ position: 'bottom', slient: true });
      });
    }
  });
});
</script>