<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
/// <reference types="chrome" />
import { nextTick, reactive, ref, toRaw, watch, watchEffect, WatchStopHandle } from 'vue';
import { TimelineDataSeries, TimelineGraphView } from 'webrtc-internals';
const dl = reactive({} as Record<string, { ds: TimelineDataSeries, gv?: TimelineGraphView; }>);
const connected = ref(false);
const reconnect = () => {
  try {
    const port = chrome.runtime.connect({
      name: "" + chrome.devtools.inspectedWindow.tabId,
    });
    connected.value = true;
    console.log("Connected to background", port);
    port.onMessage.addListener((data: Record<string, number> | 'connect') => {
      if (data == 'connect') {
        console.log("content connected", port);
        if (!settings.prelog) {
          clearAll();
        }
      } else {
        for (const key in data) {
          if (dl[key]) {
            dl[key].ds.addPoint(Date.now(), data[key]);
            dl[key].gv?.updateEndDate();
          } else {
            const ds = new TimelineDataSeries();
            dl[key] = { ds };
            nextTick(() => {
              const gv = new TimelineGraphView(document.getElementById(key) as HTMLCanvasElement);
              gv.addDataSeries(ds);
              dl[key].gv = gv;
            });
          }
        }
      }
    });
    port.onDisconnect.addListener(() => {
      connected.value = false;
      console.log("disconnect");
      setTimeout(reconnect, 1000);
    });
  } catch (err) {
    setTimeout(reconnect, 1000);
  }
};
const settings = reactive({ prelog: false });
function clearAll() {
  for (const key in dl) {
    delete dl[key];
  }
}
const oldSettings = localStorage.getItem('settings');
if (oldSettings) Object.assign(settings, JSON.parse(oldSettings));
watch(settings, (value) => {
  console.log("设定修改", value);
  localStorage.setItem("settings", JSON.stringify(toRaw(settings)));
});
reconnect();


</script>

<template>
  <n-layout>
    <n-layout-header>
      <n-space class="title-bar">
        <n-avatar size="small" src="./logo.png">
        </n-avatar>
        <span class="title">超级日志v2 可视化界面</span>
        <n-tag round :bordered="false" :type="connected ? 'success' : 'error'">
          {{ connected ? "已连接" : "未连接" }}
        </n-tag>
        <n-button size="small" @click="clearAll">清空</n-button>
        保留<n-switch v-model:value="settings.prelog"></n-switch>
      </n-space>
    </n-layout-header>
    <n-layout-content content-style="padding: 24px;">
      <n-space>
        <n-space vertical align="center" v-for="(v, k) in dl">
          <div>{{ k }}</div>
          <canvas :id="k" />
        </n-space>
      </n-space>
    </n-layout-content>
  </n-layout>
</template>

<style>
.n-card {
  max-width: 300px;
}

.title-bar {
  padding: 10px;
  background-color: rgb(204, 204, 204);
}

.title {
  font-size: 20px;
}

.current>rect {
  fill: #FF0000;
  stroke: #FFFF00;
  stroke-width: 4px;
}
</style>
