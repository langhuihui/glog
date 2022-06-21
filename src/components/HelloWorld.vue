<script setup lang="ts">
import { ref } from 'vue'
import getDisplayMedia from '../get-display-media';
const msg = ref("")
async function share(){
  const stream = await getDisplayMedia({
    width:1920,
    height:1080,
    frameRate:5
  })
  const track = stream.getVideoTracks()[0];
  new MediaStreamTrackProcessor({ track }).readable.pipeTo(new WritableStream({
    write(frame: VideoFrame) {
      msg.value = frame.timestamp
      // console.log(frame)
    }
  }));
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <button type="button" @click="share">开始</button>
  
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
