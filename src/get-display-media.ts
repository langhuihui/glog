/* eslint-disable require-jsdoc */

const getDisplayMedia = async function(options) {
  let audioStream = null;
  if (options.screenAudio) {
    options.audioConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    };
    const screenConstraints = buildScreenConstraints(options);
    let captureStream = await navigator.mediaDevices.getDisplayMedia(screenConstraints);
    return captureStream;
  } else {
    const screenConstraints = buildScreenConstraints(options);
    let captureStream = await navigator.mediaDevices.getDisplayMedia(screenConstraints);
    if (options.audio) {
      const constraints = buildConstraints(options);
      audioStream = await navigator.mediaDevices.getUserMedia(constraints);
      captureStream.addTrack(audioStream.getAudioTracks()[0]);
      return captureStream;
    } else {
      return captureStream;
    }
  }
};

function buildConstraints(options) {
  let audioConstraints = {
    echoCancellation: options.echoCancellation,
    autoGainControl: options.autoGainControl,
    noiseSuppression: options.noiseSuppression,
    sampleRate: options.sampleRate,
    channelCount: options.channelCount
  };
  if (options.microphoneId) {
    audioConstraints.deviceId = { exact: options.microphoneId };
  }
  return { audio: audioConstraints, video: false };
}

function buildScreenConstraints(options) {
  let screenConstraints = {};
  let videoConstraints = {
    width: options.width,
    height: options.height,
    frameRate: options.frameRate
  };
  if (options.screenSource) {
    videoConstraints.displaySurface = options.screenSource;
  }
  screenConstraints.video = videoConstraints;
  if (options.audioConstraints) {
    screenConstraints.audio = options.audioConstraints;
  }
  return screenConstraints;
}

export default getDisplayMedia;
