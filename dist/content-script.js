
function inject(source) {
  if (document instanceof HTMLDocument) {
    if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Firefox') > -1) {
      // eslint-disable-next-line no-eval
      window.eval(source); // in Firefox, this evaluates on the content window
    } else {
      const script = document.createElement('script');
      script.textContent = source;
      document.documentElement.appendChild(script);
      script.parentNode.removeChild(script);
    }
  }
}
inject(`
function glog(obj) {
  window.dispatchEvent(new CustomEvent("glog", { detail: obj }));
}
`);
const port = chrome.runtime.connect({
  name: 'content-script'
});
function getHandler(port) {
  return msg => {
    port.postMessage(msg.detail);
  };
}
window.addEventListener('glog', getHandler(port));
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name == 'popup') {
    const handler = getHandler(port);
    window.addEventListener('glog', handler);
    port.onDisconnect.addListener(function () {
      window.removeEventListener('glog', handler);
    });
  }
});