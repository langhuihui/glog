<template>
  <dl>
    <template v-for="(v, k) in realtime">
      <dt>{{ k }}</dt>
      <dd>{{ v }}</dd>
    </template>
  </dl>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';

const realtime = reactive({} as Record<string, number>);

getCurrentTabId((tabId: number) => {
  var port = chrome.tabs.connect(tabId, { name: 'popup' });
  port.onMessage.addListener(function (msg) {
    for (const key in msg) {
      realtime[key] = msg[key];
    }
  });
});

// 获取当前选项卡ID
function getCurrentTabId(callback: (tabId: number) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback && tabs[0]?.id) callback(tabs[0].id);
  });
}
</script>