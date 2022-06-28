<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
/// <reference types="chrome" />
import { reactive, ref, toRaw, watch, watchEffect, WatchStopHandle } from 'vue';
import Log from './components/Log.vue';
import { format } from 'date-fns';
import hljs from 'highlight.js/lib/core';
import Setting from './components/Setting.vue';
import SnapShort from './components/SnapShort.vue';
import { darkTheme } from 'naive-ui';
import { Moon, Sun } from '@vicons/tabler';
import { subject, pipe, Subject, subscribe, throttle, timer } from 'fastrx';
const group = reactive({} as { [key: string]: string[][] & { source: Subject<string[]>, show: boolean; unread: number; key: string; }; });
let stopWatch: WatchStopHandle;
const reconnect = () => {
  try {
    const port = chrome.runtime.connect({
      name: "" + chrome.devtools.inspectedWindow.tabId,
    });
    stopWatch = watchEffect(() => {
      port.postMessage({ outputs: toRaw(settings.outputs), listenTypes: toRaw(settings.listenTypes) });
    });

    console.log("Connected to background", port);
    port.onMessage.addListener((data: string[] | 'connect') => {
      if (data == 'connect') {
        console.log("content connected", port);
        if (!settings.prelog) {
          clearAll();
        }
        port.postMessage(toRaw(settings));
      } else {
        if (data.length == 0) {
          data.unshift("");
        }
        const [key] = data;
        data[0] = format(new Date(), "HH:mm:ss.SSS");
        if (!group[key]) {
          group[key] = Object.assign([], { show: false, unread: 0, key, source: subject() });
          pipe(group[key].source,
            throttle(() => timer(settings.throttle)),
            subscribe((output) => group[key].push(output)));
        }
        const lines = group[key];
        if (settings.throttle) {
          lines.source.next(data);
        } else lines.push(data);
        while (lines.length > settings.maxCount) {
          lines.shift();
        }
        if (!lines.show)
          lines.unread++;
      }
    });
    port.onDisconnect.addListener(() => {
      console.log("disconnect");
      stopWatch();
      setTimeout(reconnect, 1000);
    });
  } catch (err) {
    setTimeout(reconnect, 1000);
  }
};

const collapsed = ref(false);
const showSetting = ref(true);
const snapshort = ref(null as string[][] & { key: string; } | null);
const settings = reactive({ prelog: false, throttle: 0, useDark: false, maxCount: 500, outputs: ['log', 'info'], listenTypes: ['debug', 'log', 'info'] });
function clearAll() {
  Object.keys(group).forEach(key => {
    group[key].source.complete();
    group[key].length = 0;
    delete group[key];
  });
}
const oldSettings = localStorage.getItem('settings');
if (oldSettings) Object.assign(settings, JSON.parse(oldSettings));
watch(settings, (value) => {
  console.log("设定修改", value);
  localStorage.setItem("settings", JSON.stringify(toRaw(settings)));
});
reconnect();
hljs.registerLanguage('glog', () => ({
  contains: [
    {
      className: 'time',
      begin: /\d/,
      end: / /,
    }
  ]
}));

</script>

<template>
  <n-config-provider :hljs="hljs" :theme="settings.useDark ? darkTheme : null">
    <SnapShort v-if="snapshort" :lines="snapshort" @close="snapshort = null"> </SnapShort>
    <n-layout has-sider v-else>
      <n-layout-sider v-model:collapsed="collapsed" collapse-mode="width" :collapsed-width="120" :width="240"
        show-trigger="arrow-circle" content-style="padding: 24px;" bordered>
        <n-space vertical>
          <n-space>
            <n-button @click="clearAll">全部清空</n-button>
            <n-switch v-if="!collapsed" v-model:value="showSetting">
              <template #icon>
                ⚙️
              </template>
            </n-switch>
          </n-space>
          <n-badge v-for="(item, key) in group" :value="item.unread">
            <n-checkbox v-model:checked="item.show" @update:checked="item.unread = 0">
              <n-ellipsis :line-clamp="1">
                {{ key }}
              </n-ellipsis>
            </n-checkbox>
          </n-badge>
        </n-space>
      </n-layout-sider>
      <n-layout-content content-style="padding: 24px;">
        <n-card title="设置" size="small" closable @close="showSetting = false" v-if="showSetting">
          <template #header-extra>
            <n-switch v-model:value="settings.useDark">
              <template #checked-icon>
                <n-icon :component="Moon" />
              </template>
              <template #unchecked-icon>
                <n-icon :component="Sun" />
              </template>
            </n-switch>
          </template>
          <Setting :value="settings"></Setting>
        </n-card>
        <template v-for="item in group">
          <Log :lines="item" v-if="item.show" @snapshort="snapshort = Object.assign(item.slice(), { key: item.key })" />
        </template>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>
<style>
.time {
  color: dimgrey;
}
</style>
