const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronSerial", {
    setInteractive: (v) => ipcRenderer.send("serial:setInteractive", !!v),
});
