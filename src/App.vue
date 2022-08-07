<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
/// <reference types="chrome" />
import { Error, LogoGithub, LogoYoutube, Unlink, Link } from '@vicons/carbon';
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

function gotoGithub() {
  chrome.tabs.create({ url: "https://github.com/langhuihui/glog" });
}
function watchVideo() {
  chrome.tabs.create({ url: "https://www.bilibili.com/video/BV1ut4y1g7i7" });
}
</script>

<template>
  <n-layout>
    <n-layout-header>
      <n-space justify="space-between" class="title-bar">
        <n-space  item-style="display: flex;" align="center">
          <n-avatar :size="24" src="./logo.png">
          </n-avatar>
          <span class="title">Graphic Log</span>
          <n-tag :bordered="false" :type="connected ? 'success' : 'error'" size="small">
            <template #icon>
              <n-icon :component="connected ? Link : Unlink" />
            </template>
          </n-tag>
          <n-button quaternary circle @click="clearAll" size="small">
            <template #icon>
              <n-icon>
                <Error />
              </n-icon>
            </template>
          </n-button>
          <n-checkbox size="small" v-model:checked="settings.prelog" label="preserve" />
        </n-space>
        <n-space>
          <n-button quaternary circle @click="gotoGithub" size="small">
            <template #icon>
              <n-icon>
                <LogoGithub />
              </n-icon>
            </template>
          </n-button>
          <n-button quaternary circle @click="watchVideo" size="small">
            <template #icon>
              <n-icon>
                <LogoYoutube />
              </n-icon>
            </template>
          </n-button>
        </n-space>
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
  padding: 2px 10px;
  background-color: rgb(204, 204, 204);
}

.title {
  font-size: 16px;
}

.current>rect {
  fill: #FF0000;
  stroke: #FFFF00;
  stroke-width: 4px;
}
</style>
