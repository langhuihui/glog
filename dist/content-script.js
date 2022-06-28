
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
(function (root) {
  const origin = {
    log: console.log,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };
  root.GLOG = {
    outputs: [],
    log(...arg) {
      window.dispatchEvent(new CustomEvent("log", { detail: arg.filter(x => typeof x != "object") }));
    },
    listen(types) {
      for (let method in origin) {
        if (types.includes(method)) {
          console[method] = (...arg) => {
            if (this.outputs.includes(method))
              origin[method](...arg);
            this.log(...arg);
          };
        } else {
          console[method] = origin[method];
        }
      };
    },
  };
})(window);
`);
const port = chrome.runtime.connect({
  name: 'content-script'
});
port.onMessage.addListener((message) => {
  inject(
    `
    GLOG.listen( ${JSON.stringify(message.listenTypes)});
    GLOG.outputs = ${JSON.stringify(message.outputs)};
    `
  );
})
window.addEventListener('log', msg => {
  port.postMessage(msg.detail);
});