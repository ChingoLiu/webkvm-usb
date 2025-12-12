//語系
// 語系字典
const I18N_DICT = {
    'zh-TW': {
        'window.title':             '視窗',
        'window.pip':               '浮動視窗',
        'window.fullscreen':        '全螢幕',
        'window.snapshot':          '螢幕截圖',
        'window.record':            '螢幕錄影',
        'clipboard.title':          '剪貼簿',
        'clipboard1.placeholder':   '1. 輸入英數符',
        'clipboard2.placeholder':   '2. 輸入英數符',
        'clipboard3.placeholder':   '3. 輸入英數符',
        'clipboard.sendclipboard':  '送出剪貼簿',
        'hotkey.title':             '熱鍵',
        'hotkey1.placeholder':      '1. 點擊設定',
        'hotkey2.placeholder':      '2. 點擊設定',
        'hotkey3.placeholder':      '3. 點擊設定',
        'hotkey.hint':              '🎹 錄製熱鍵中…',
        'hotkey.vkeyboard':         '虛擬鍵盤',
        'mouse.title':              '滑鼠',
        'mouse.relative':           '相對座標',
        'mouse.jitter':             '滑鼠抖動',
        'status.title':             '狀態',
        'status.sound':             '聲音',

        'setting.title':            '🔌 裝置選擇與設定',
        'setting.comSelect':        '選擇COM裝置',
        'setting.videoSource':      '影像來源',
        'setting.resolution':       '解析度',
        'setting.framerate':        '幀率',
        'setting.audioSource':      '聲音來源',
        'setting.scrollSpeed':      '滾輪速度',
        'setting.scrollDirection':  '滾輪方向',
        'setting.scrollNormal':     '一般',
        'setting.scrollReverse':    '反向',
        'setting.language':         '語言',
        'setting.confirm':          '✔ 確定',

        'vkeyboard.save':           '儲存',
        'vkeyboard.cancel':         '取消',

        'serial.opened':            '已開啟：{name}',
    },
    'en': {
        'window.title':             'Window',
        'window.pip':               'PIP',
        'window.fullscreen':        'Fullscreen',
        'window.snapshot':          'Snapshot',
        'window.record':            'Record',
        'clipboard.title':          'Clipboard',
        'clipboard1.placeholder':   '1. Input characters',
        'clipboard2.placeholder':   '2. Input characters',
        'clipboard3.placeholder':   '3. Input characters',
        'clipboard.sendclipboard':  'Send Clipboard',
        'hotkey.title':             'Hotkey',
        'hotkey1.placeholder':      '1. Click to set',
        'hotkey2.placeholder':      '2. Click to set',
        'hotkey3.placeholder':      '3. Click to set',
        'hotkey.hint':              '🎹 Recording hotkeys…',
        'hotkey.vkeyboard':         'Virtual Keyboard',
        'mouse.title':              'Mouse',
        'mouse.relative':           'Rel-Cursor',
        'mouse.jitter':             'Auto move',
        'status.title':             'Status',
        'status.sound':             'Sound',

        'setting.title':            '🔌 Device and Setting',
        'setting.comSelect':        'Select COM device',
        'setting.videoSource':      'Video source',
        'setting.resolution':       'Resolution',
        'setting.framerate':        'Framerate',
        'setting.audioSource':      'Audio source',
        'setting.scrollSpeed':      'Scroll Speed',
        'setting.scrollDirection':  'Scroll Direction',
        'setting.scrollNormal':     'Normal',
        'setting.scrollReverse':    'Reverse',
        'setting.language':         'Language',
        'setting.confirm':          '✔ Confirm',

        'vkeyboard.save':           'Save',
        'vkeyboard.cancel':         'Cancel',

        'serial.opened':            'Opened: {name}',
    },
};

let currentLang = 'en';

// 核心：套文字 + 寫 localStorage
function applyI18N(lang) {
    const dict = I18N_DICT[lang];
    if (!dict) return;

    currentLang = lang;
    try {
        localStorage.setItem('webkvm_lang', lang);
    } catch (e) {}

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = dict[key];
        if (text === undefined) return;

        const attr = el.getAttribute('data-i18n-attr');
        if (attr) {
            // ★ 有指定要套在某個屬性（例如 placeholder / title）
            el.setAttribute(attr, text);
        } else {
            // ★ 沒指定就當成一般文字節點
            el.textContent = text;
        }
    });
}


// 統一用一個 DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('[i18n] DOMContentLoaded');

    // 1. 先讀 localStorage
    let saved = null;
    try {
        saved = localStorage.getItem('webkvm_lang');
        console.log('[i18n] localStorage get webkvm_lang =', saved);
    } catch (e) {
        console.warn('[i18n] localStorage.getItem error:', e);
    }

    // 2. 決定啟動語言
    let initialLang = currentLang;
    if (saved && I18N_DICT[saved]) {
        initialLang = saved;
    }

    console.log('[i18n] initialLang =', initialLang);

    // 3. 先套用文字
    applyI18N(initialLang);

    // 4. 找到 <select id="lang-select">，設定預設值 + 監聽 change
    const sel = document.getElementById('lang-select');
    console.log('[i18n] lang-select element =', sel);

    if (sel) {
        // 確保 select 顯示的是目前語言
        sel.value = initialLang;

        sel.addEventListener('change', () => {
            console.log('[i18n] select changed =>', sel.value);
            applyI18N(sel.value);

            //有些地方要手動更新一下
            //updateActiveSerialStatus();
        });
    }
});

// 方便你在 console 測的 helper
window.debugLang = function () {
    console.log('--- debugLang ---');
    console.log('currentLang =', currentLang);
    try {
        console.log('localStorage[webkvm_lang] =', localStorage.getItem('webkvm_lang'));
    } catch (e) {
        console.warn('localStorage get error:', e);
    }
    console.log('-----------------');
};

// 給 JS 用的翻譯函式
function t(key, vars = {}) {
    const dict = I18N_DICT[currentLang] || {};
    let text = dict[key] || key;  // 找不到就回傳 key 本身（方便 debug）

    // 代入參數 {name} 這種
    for (const k in vars) {
        text = text.replaceAll(`{${k}}`, vars[k]);
    }
    return text;
}

//==================================================================================
        let isPIP = false;

        let isKeyboardControl = false;
        let isMouseControl = false;

        let videoWidth = 1920 * 8 / 10;
        let videoHeight = 1080 * 8 / 10;
        let sendW_coef = 32767 * 1000 / (videoWidth - 1);
        let sendH_coef = 32767 * 1000 / (videoHeight - 1);
        let mouseButton = 0;
        let abs_last_x = 0;
        let abs_last_y = 0;

        const video = document.getElementById("stream");
        const videoBox = document.getElementById("videoBox");
        const fsBtn = document.getElementById("fullscreen-btn");
        const kb = document.getElementById("virtualKeyboard");

        const serialModal = document.getElementById("serial-modal");
        const serialStatusEl = document.getElementById("serial-status");

        video.addEventListener("contextmenu", (e) => e.preventDefault()); // 阻止右鍵選單

        //==================================================================================Window Load
        window.addEventListener("load", async () => {
            if (!serialModal) return;

            // 顯示設定頁
            serialModal.style.display = "flex";
            serialModal.focus();

            if (!serialIsSupported()) {
                serialSetStatus("錯誤：此瀏覽器不支援 Web Serial API，請使用 Chrome / Edge 並在 HTTPS 或 localhost 下執行。");
                return;
            }

            await initUvcUacOnStartup();

            try {
                // 可選：檢查是否已有已授權過的 COM Port，但不開啟它
                const ports = await navigator.serial.getPorts();

                if (ports.length > 0) {
                    const port = ports[0];
                    console.log("🎉 自動連線已授權 COM：", port);
                    await serialOpenWithoutModal(port);
                } else {
                    //serialSetStatus("請按「選擇 COM 裝置」進行連線。");
                }
            } catch (err) {
                console.error("[Serial] init error:", err);
                serialSetStatus("初始化錯誤：" + err.message);
            }
        });

        serialModal.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault(); // 防止跑出預設行為
                document.getElementById("btn-apply-settings").click();
            }
        });

        window.addEventListener("beforeunload", async () => {
            await closeSerialSafely();
        });

        //==================================================================================起始設定
        const btnChoosePort = document.getElementById("btn-choose-port");
        const audioElem = document.getElementById("id_audio");
        //----------------------------------------------
        // 全域變數
        //----------------------------------------------
        let currentStream = null;    // 目前使用的 video stream
        let currentTrack = null;     // 目前使用的 video track

        let lastCamId = null;
        let lastAudioId = null;

        let selectedCamId = null;
        let selectedAudioId = null;
        let selectedWidth = 1920;
        let selectedHeight = 1080;
        let selectedFps = 60;

        let serialPort = null;

        let usb_connection = false;
        let usb_last_connection = false;

        //----------------------------------------------
        // 初始化：一進入頁面 → 拿權限 → enumerate → 自動開 UVC/UAC
        //----------------------------------------------
        async function initUvcUacOnStartup() {
            console.log("init start");

            // 1. 先要求權限（非常重要）
            try {
                const tmp = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                tmp.getTracks().forEach(t => t.stop());
            } catch (err) {
                console.warn("無法取得預設 video/audio（可能 UVC 還沒 ready 或權限被拒）:", err);
            }

            await new Promise(r => setTimeout(r, 200));

            // 2. enumerate UVC / UAC
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cams = devices.filter(d => d.kind === "videoinput");
            const audios = devices.filter(d => d.kind === "audioinput");

            // 3. 填入 UI 選單
            fillUvcUacSelectList(cams, audios);

            // 4. 使用第一個裝置
            selectedCamId = selCam.value || null;
            selectedAudioId = selAudio.value || null;

            lastCamId = selectedCamId;
            lastAudioId = selectedAudioId;

            // 5. 自動啟動第一個 UVC/UAC
            try {
                await startUVC(selectedCamId, 1920, 1080, 60);
                await fillResolutionAndFps(selectedCamId);
            } catch (err) {
                console.warn("UVC 開啟失敗（可能 HDMI 無訊號）:", err);
            }

            // 6. UAC 通常不會有 timeout，可正常啟動
            try {
                await startUAC(selectedAudioId);
            } catch (err) {
                console.warn("UAC 開啟失敗:", err);
            }

            console.log("init complete");
        }

        //----------------------------------------------
        // 填入 UVC / UAC 選單
        //----------------------------------------------
        function extractVidPid(label) {
            const m = label.match(/\(([\da-f]+):([\da-f]+)\)/i);
            return m ? { vid: m[1].toLowerCase(), pid: m[2].toLowerCase() } : null;
        }

        function fillUvcUacSelectList(cams, audios) {
            const TARGET_VID = "345f";
            const TARGET_PID = "2133";

            selCam.innerHTML = "";
            cams.forEach(c => {
                const info = extractVidPid(c.label);
                if (!info) return;

                if (info.vid === TARGET_VID && info.pid === TARGET_PID) {
                    const opt = document.createElement("option");
                    opt.value = c.deviceId;
                    opt.textContent = c.label || "Camera";
                    selCam.appendChild(opt);
                }
            });

            selAudio.innerHTML = "";
            audios.forEach(a => {
                const info = extractVidPid(a.label);
                if (!info) return;

                if (info.vid === TARGET_VID && info.pid === TARGET_PID) {
                    const opt = document.createElement("option");
                    opt.value = a.deviceId;
                    opt.textContent = a.label || "Audio";
                    selAudio.appendChild(opt);
                }
            });
        }


        //----------------------------------------------
        // 開啟 UVC (重建 video stream)
        //----------------------------------------------
        async function startUVC(camId, w, h, fps) {
            console.log(`開啟 UVC ${camId} @ ${w}x${h}x${fps}`);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: camId },
                    width: { exact: w },
                    height: { exact: h },
                    frameRate: { ideal: fps }
                },
                audio: false
            });

            const videoElem = document.getElementById("stream");
            videoElem.srcObject = stream;

            currentStream = stream;
            currentTrack = stream.getVideoTracks()[0];
        }

        //----------------------------------------------
        // UVC change event
        //----------------------------------------------
        navigator.mediaDevices.addEventListener("devicechange", async () => {

        });

        //----------------------------------------------
        // 開啟 UAC
        //----------------------------------------------
        async function startUAC(audioId) {
            console.log(`開啟 UAC ${audioId}`);

            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: { exact: audioId },
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                },
                video: false
            });

            audioElem.srcObject = audioStream;
            audioElem.play();
        }

        //----------------------------------------------
        // 設定頁按下「確定」 → 套用新的參數
        //----------------------------------------------
        document.getElementById("btn-apply-settings").addEventListener("click", async () => {

            selectedCamId = selCam.value;
            selectedAudioId = selAudio.value;

            // resolution / fps
            const [w, h] = selResolution.value.split("x").map(Number);
            const fps = parseInt(selFramerate.value);

            selectedWidth = w;
            selectedHeight = h;
            selectedFps = fps;

            serialModal.style.display = "none";  // 關閉設定頁

            // 套用設定
            await applyAudioSettings();

            video.focus();
            console.log("設定已套用");
        });

        //----------------------------------------------
        // 套用 UVC 設定
        //----------------------------------------------
        async function applyUvcSettings() {
            const newCamId = selectedCamId;
            const w = selectedWidth;
            const h = selectedHeight;
            const fps = selectedFps;

            // Case A：換裝置 → 重新開相機（固定 1920/1080/60）
            if (newCamId !== lastCamId) {
                console.log("換 UVC 裝置 → 重開");
                lastCamId = newCamId;
                await startUVC(newCamId, 1920, 1080, 60);
                await fillResolutionAndFps(newCamId);
                return;
            }

            // Case B：同裝置 → 用 applyConstraints（不黑畫面）
            console.log("applyConstraints():", w, h, fps);

            try {
                await currentTrack.applyConstraints({
                    width: { exact: w },
                    height: { exact: h },
                    frameRate: { ideal: fps }
                });
            } catch (err) {
                console.warn("⚠ applyConstraints 失敗 → fallback getUserMedia()", err);

                await startUVC(newCamId, w, h, fps);
            }
        }

        selResolution.addEventListener("change", async () => {
            const [w, h] = selResolution.value.split("x").map(Number);
            selectedWidth = w;
            selectedHeight = h;
            await applyUvcSettings();
        });

        selFramerate.addEventListener("change", async () => {
            selectedFps = parseInt(selFramerate.value);
            await applyUvcSettings();
        });

        //----------------------------------------------
        // 依照能力填入 Resolution / FPS 選單
        //----------------------------------------------
        async function fillResolutionAndFps(camId) {

            const tmp = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: camId } }
            });

            const track = tmp.getVideoTracks()[0];
            const caps = track.getCapabilities();
            track.stop();

            selResolution.innerHTML = "";
            selFramerate.innerHTML = "";

            const commonRes = [
                [3840, 2160],
                [2560, 1440],
                [1920, 1080],
                [1280, 720],
                [640, 480]
            ];

            for (const [w, h] of commonRes) {
                if (w <= caps.width.max && w >= caps.width.min &&
                    h <= caps.height.max && h >= caps.height.min) {

                    const opt = document.createElement("option");
                    opt.value = `${w}x${h}`;
                    opt.textContent = `${w} × ${h}`;
                    selResolution.appendChild(opt);
                }
            }

            // ★ 預選 1920 × 1080
            if (selResolution.querySelector(`option[value="1920x1080"]`)) {
                selResolution.value = "1920x1080";
            }

            const fpsList = [60, 30, 24];

            for (const fps of fpsList) {
                if (fps >= caps.frameRate.min && fps <= caps.frameRate.max) {
                    const opt = document.createElement("option");
                    opt.value = fps;
                    opt.textContent = `${fps} fps`;
                    selFramerate.appendChild(opt);
                }
            }

            // ★ 預選 60 fps
            if (selFramerate.querySelector(`option[value="60"]`)) {
                selFramerate.value = "60";
            }
        }

        //----------------------------------------------
        // 套用 UAC 設定
        //----------------------------------------------
        async function applyAudioSettings() {
            const newAudioId = selectedAudioId;

            // 換裝置 → 重新開
            if (newAudioId !== lastAudioId) {
                console.log("🔄 換 UAC 裝置 → 重開");
                lastAudioId = newAudioId;
                await startUAC(newAudioId);
            }
        }

        //----------------------------------------------
        // 設定按鈕 → 開啟設定頁
        //----------------------------------------------
        document.getElementById("openSettingsBtn").addEventListener("click", () => {
            serialModal.style.display = "flex";   // 你原本的設定頁 id
            serialModal.focus();
        });

        btnChoosePort.addEventListener("click", async () => {
            try {
                const port = await navigator.serial.requestPort({
                    acceptAllDevices: true
                });

                // 🔹 1. 如果是同一支、而且已經是開啟狀態，就不要再 open / getWriter
                if (serialPort === port && serialPort.readable) {
                    console.log("[Serial] 同一個已開啟的 COM，再次選取 → 當作 OK 處理");
                    updateActiveSerialStatus(port);
                    // 這裡你也可以選擇 showToast("已使用目前的連線 COM");
                    return;
                }

                // 🔹 2. 換了一支 COM → 先關掉舊的再開新的一支
                await closeSerialSafely();

                const info = port.getInfo();
                console.log("VID =", info.usbVendorId?.toString(16));
                console.log("PID =", info.usbProductId?.toString(16));
                console.log("Name =", info.usbProductName);
                console.log("SN =", info.usbSerialNumber);

                serialPort = port;

                await port.open({ baudRate: 57600 });
                serialWriter = port.writable.getWriter();
                startSerialReadLoop();
                updateActiveSerialStatus(port);
            } catch (err) {
                // 🔹 3. 使用者按「取消」的情況 → 不要當錯誤
                if (err.name === "NotFoundError") {
                    console.log("[Serial] 使用者取消選擇 COM 裝置");
                    return;
                }

                console.error(err);
                showToast("Opening COM port failed：" + err.message);
            }
        });


        function updateActiveSerialStatus(port) {
            const info = port.getInfo();

            const vid = info.usbVendorId?.toString(16).padStart(4, "0");
            const pid = info.usbProductId?.toString(16).padStart(4, "0");

            const product = info.usbProductName || "";
            const manu = info.usbManufacturerName || "";

            // 優先顯示產品名稱，其次顯示VID/PID
            let name = product || manu || `VID=${vid} PID=${pid}`;

            serialStatusEl.textContent = t('serial.opened', { name });
        }

        async function serialOpenWithoutModal(port) {
            try {
                const info = port.getInfo();
                serialPort = port;
                await port.open({ baudRate: 57600 });
                serialWriter = port.writable.getWriter();
                startSerialReadLoop();

                updateActiveSerialStatus(port);   // ⭐ 加這行

            } catch (err) {
                serialStatusEl.textContent = "自動開啟序列埠失敗：" + err.message;
            }
        }

        //==================================================================================視窗縮放處理
        // Android橫向時高度計算會錯誤, 要這樣處理
        function fixViewportHeight() {
            document.documentElement.style.setProperty(
                '--vh', (window.innerHeight * 0.01) + 'px'
            );
        }

        const top_bar_wrapper = document.querySelector(".top-bar-wrapper");
        const div_main_css = document.querySelector(".div-main");
        const wrapper = document.querySelector(".keyboard-wrapper");
        const hotkeymask_css = document.querySelector(".hotkey-mask");

        function resizeVideo() {
            fpsRenderChart.resize(220, 100);

            fixViewportHeight();

            let trans_rate = 1.0;

            const totalW = document.body.offsetWidth;
            const totalH = document.body.offsetHeight;
            const totalRatio = totalW / totalH;

            let canvsW;
            let canvsH;
            if (totalRatio < 2.108) {
                // 寬為準
                canvsW = totalW;
                canvsH = totalW * 908 / 1914;
            }
            else {
                // 高為準
                canvsH = totalH;
                canvsW = totalH * 1914 / 908;
            }

            if (canvsH < 908) {
                trans_rate = canvsH / 908;
            }
            console.log("trans_rate=", trans_rate);
            topbar.style.transform = `scale(${trans_rate})`;

            const realWidth = topbar.offsetWidth * trans_rate;
            top_bar_wrapper.style.width = realWidth + "px";
            div_main_css.style.width = totalW - 4 + "px";
            div_main_css.style.height = totalH - 4 + "px";

            if (kb.classList.contains("show")) {
                const parentWidth = video.parentElement.clientWidth + 4;
                let parentHeight = video.parentElement.clientHeight;

                if (kb.classList.contains("show")) {
                    //parentHeight -= kb.offsetHeight; // 扣掉鍵盤高度
                }

                videoWidth = 1920;
                videoHeight = 1080;
                let video_And_kb_Height = 1440;
                while (videoWidth > parentWidth || video_And_kb_Height > parentHeight) {
                    videoWidth = videoWidth - 16;
                    videoHeight = videoHeight - 9;
                    video_And_kb_Height = video_And_kb_Height - 12;
                }

                const kbhi = video_And_kb_Height - videoHeight;
                //console.log("paren w:", parentWidth, " h:", parentHeight);
                //console.log("video w:", videoWidth, " h:", videoHeight);
                video.style.height = videoHeight + "px";
                video.style.width = videoWidth + "px";

                sendW_coef = 4096 / videoWidth;
                sendH_coef = 4096 / videoHeight;


                //For 虛擬鍵盤


                wrapper.style.width = (videoWidth - 4) + "px";
                wrapper.style.height = kbhi + "px";
                let scale = 1;
                scale = videoWidth / 1500;

                kb.style.transform = `scale(${scale})`;
                //const h = document.getElementById("debug");
                //h.textContent = "paren w:" + parentWidth + " h:" + parentHeight + " kboh:" + kb.offsetHeight;
            }
            else {
                const parentWidth = video.parentElement.clientWidth + 6;
                let parentHeight = video.parentElement.clientHeight;

                videoWidth = 1920;
                videoHeight = 1080;

                while (videoWidth > parentWidth || videoHeight > parentHeight) {
                    videoWidth = videoWidth - 16;
                    videoHeight = videoHeight - 9;
                }

                //console.log("paren w:", parentWidth, " h:", parentHeight);
                //console.log("video w:", videoWidth, " h:", videoHeight);
                video.style.height = videoHeight + "px";
                video.style.width = videoWidth + "px";

                sendW_coef = 4096 / videoWidth;
                sendH_coef = 4090 / videoHeight;

                //document.getElementById("id_div_videoP").style.width = videoWidth + "px";
                //document.getElementById("videoBox").style.width = videoWidth + "px";
                //topbar w=200, h=987
            }

            hotkeymask_css.style.width = totalW - 4 + "px";
            hotkeymask_css.style.height = videoHeight + "px";
        }

        window.addEventListener("resize", resizeVideo);
        window.addEventListener("load", resizeVideo);

        //==================================================================================連線狀態
        window.webrtcConnected = false;
        let ws9000Connected = false;
        let ConnFirsttime = false;
        let dotTimer = null;

        let overlayShown = false;
        let modalShown = false;

        function showOverlay() {
            const overlay = document.getElementById("video-black-overlay");
            if (!overlay || overlayShown) return;
            overlay.classList.add("show");
            overlayShown = true;
        }

        function hideOverlay() {
            const overlay = document.getElementById("video-black-overlay");
            if (!overlay || !overlayShown) return;
            overlay.classList.remove("show");
            overlayShown = false;
        }

        function showReconnectModal(source) {
            // 先蓋黑幕，但不要動 video.srcObject
            showOverlay();

            // 你原本的條件
            if (!ConnFirsttime) return;

            const modal = document.getElementById("conn-error-modal");
            const msgBox = document.getElementById("conn-error-msg");
            if (!modal || !msgBox) return;

            // 冪等：已經顯示就只更新文案
            if (modalShown) {
                // 只更新 dots 計時器
                if (dotTimer) clearInterval(dotTimer);
            } else {
                modal.classList.add("show");
                modalShown = true;
            }

            let dots = 0;
            dotTimer = setInterval(() => {
                dots = (dots + 1) % 4;
                msgBox.textContent = `${source} reconnecting` + ".".repeat(dots);
            }, 500);
        }

        function hideReconnectModal() {
            const modal = document.getElementById("conn-error-modal");
            if (!modal) return;

            // 停止點點
            if (dotTimer) { clearInterval(dotTimer); dotTimer = null; }

            // 冪等
            if (modalShown) {
                modal.classList.remove("show");
                modalShown = false;
            }

            // 黑幕退場（不用 setTimeout，交給 CSS transition）
            hideOverlay();

            // 嘗試繼續播放
            const video = document.getElementById("stream");
            if (video && video.srcObject) {
                video.play().catch(e => console.warn("Video play error:", e));
            }
        }

        // 單一真實來源：都用 window.webrtcConnected
        if (typeof window.webrtcConnected !== "boolean") window.webrtcConnected = false;

        function updateConnectionState() {
            console.log("updateConnectionState webrtcConnected:", window.webrtcConnected, " ws9000:", ws9000Connected);
            if (window.webrtcConnected && ws9000Connected) {
                resetCharts();
                hideReconnectModal();
                ConnFirsttime = true;
                chartRefreshFlag = true;
                console.log("WHITE");
            } else {
                showReconnectModal("等待連線恢復");
                chartRefreshFlag = false;
                console.log("BLACK");
            }
        }

        window.updateConnectionState = updateConnectionState;

        //==================================================================================代替alert
        function showToast(msg) {
            const toast = document.createElement("div");
            toast.textContent = msg;
            toast.style.position = "fixed";
            toast.style.top = "50%";      // 垂直置中
            toast.style.left = "50%";     // 水平置中
            toast.style.transform = "translate(-50%, -50%)"; // 修正偏移
            toast.style.background = "rgba(0,0,0,0.7)";
            toast.style.color = "white";
            toast.style.padding = "12px 24px";
            toast.style.borderRadius = "6px";
            toast.style.fontSize = "16px";
            toast.style.zIndex = "9999";  // 保證在最上層
            document.body.appendChild(toast);

            setTimeout(() => toast.remove(), 2000);
        }

        //==================================================================================ComPort
        const SERIAL_ALLOWED_DEVICES = [
            { usbVendorId: 0x1A86, usbProductId: 0x55D3 },
        ];

        let serialWriter = null;
        let serialReader = null;

        function serialSetStatus(msg) {
            if (serialStatusEl) serialStatusEl.textContent = msg;
        }

        function serialIsSupported() {
            return ("serial" in navigator);
        }

        function serialIsAllowed(info) {
            return SERIAL_ALLOWED_DEVICES.some(d =>
                d.usbVendorId === info.usbVendorId &&
                d.usbProductId === info.usbProductId
            );
        }

        let rxBuffer = new Uint8Array(0);
        function handleSerialData(newBytes) {
            rxBuffer = concatUint8(rxBuffer, newBytes);

            while (true) {
                const pkt = tryParseOnePacket(rxBuffer);
                if (!pkt) break;

                const { packet, length } = pkt;

                // 移除用掉的 bytes
                rxBuffer = rxBuffer.slice(length);

                if (packet) {
                    processPacket(packet);
                }
            }
        }

        function tryParseOnePacket(buf) {
            // 尋找頭
            const HEADER = [0x57, 0xAB, 0x00];

            let start = -1;
            const bufLen = buf.length;

            // 快速搜尋 header
            for (let i = 0; i <= bufLen - 3; i++) {
                if (buf[i] === 0x57 && buf[i + 1] === 0xAB && buf[i + 2] === 0x00) {
                    start = i;
                    break;
                }
            }

            if (start < 0) {
                // 連頭都沒有 → 清空全部
                return null;
            }

            // 若 header 不在最前面 → 直接把垃圾清掉
            if (start > 0) {
                return { packet: null, length: start };
            }

            // buf[0]=57, buf[1]=AB, buf[2]=00
            if (bufLen < 5) return null;

            const cmd = buf[3];
            const dataLen = buf[4];

            const totalLen = 3 + 1 + 1 + dataLen + 1; // Header + CMD + LEN + DATA + CHK

            if (bufLen < totalLen) return null;

            const packet = buf.slice(0, totalLen);

            // checksum
            let sum = 0;
            for (let i = 0; i < totalLen - 1; i++) sum += packet[i];
            sum &= 0xFF;

            if (sum !== packet[totalLen - 1]) {
                console.warn("Checksum mismatch, fast-skip to next header");
                // checksum 錯 → 找下一個 header（整包跳掉，直接 resync）
                return { packet: null, length: 1 };
            }

            return {
                packet,
                length: totalLen
            };
        }

        function concatUint8(a, b) {
            const c = new Uint8Array(a.length + b.length);
            c.set(a, 0);
            c.set(b, a.length);
            return c;
        }

        function processPacket(pkt) {
            const cmd = pkt[3];
            const len = pkt[4];
            const data = pkt.slice(5, 5 + len);
            /*
            console.log("RX Packet:",
                "CMD=0x" + cmd.toString(16),
                "LEN=", len,
                "DATA=", data
            );
            */
            switch (cmd) {
                case 0x81:
                    // ...
                    //console.log("cmd 0x81", data);
                    keyboardLed.num = data[2] & 0x01;
                    keyboardLed.caps = data[2] & 0x02;
                    keyboardLed.scroll = data[2] & 0x04;
                    setKeyboardLEDs(keyboardLed);

                    usb_connection = data[1] & 0x01;

                    if (usb_connection != usb_last_connection) {
                        usb_last_connection = usb_connection+10;

                        if (usb_connection) {
                            //document.getElementById("id_div_usbstatus").classList.add("active");
                            if (isKeyboardControl) {
                                console.log("isKeyboardControl");
                                document.getElementById("id_span_keyboard_status").classList.add("active");
                                document.querySelector("#id_span_keyboard_icon img").src = "icon/keyboard_light.png";
                            }
                            if (isMouseControl) {
                                document.getElementById("id_span_mouse_status").classList.add("active");
                                document.querySelector("#id_span_mouse_icon img").src = "icon/mouse_light.png";
                            }
                        }
                        else {
                            document.getElementById("id_div_usbstatus").classList.remove("active");
                            document.getElementById("id_span_keyboard_status").classList.remove("active");
                            document.querySelector("#id_span_keyboard_icon img").src = "icon/keyboard_dark.png";
                            document.getElementById("id_span_mouse_status").classList.remove("active");
                            document.querySelector("#id_span_mouse_icon img").src = "icon/mouse_dark.png";
                        }
                    }
                    break;
                case 0x82:
                    // ...
                    break;
                case 0x83:
                    // ...
                    break;
                case 0x84:
                    //console.log("cmd84");
                    // ...
                    break;
                case 0x85:
                    // ...
                    break;
                default:
                    console.warn("Unknown CMD:", cmd);
                    break;
            }
        }

        async function startSerialReadLoop() {
            if (!serialPort) {
                console.warn("[Serial] No serial port to read from.");
                return;
            }

            serialReader = serialPort.readable.getReader();
            console.log("[Serial] Read loop started.");

            try {
                while (true) {
                    const { value, done } = await serialReader.read();
                    if (done) break;
                    if (value) handleSerialData(value);
                }
            } catch (err) {
                console.error("[Serial] Read error:", err);
            } finally {
                try {
                    await serialReader.cancel();
                } catch (e) { }

                serialReader.releaseLock();
                serialReader = null;

                console.log("[Serial] Reader released.");
            }
        }

        navigator.serial.addEventListener("disconnect", async (event) => {
            console.warn("[Serial] Device disconnected");
            await closeSerialSafely();
        });

        // 對外提供一個簡單的寫入函式：你之後可在任何地方呼叫 window.serialWrite("ABC\r\n")
        window.serialWrite = async function (data) {
            if (!serialWriter) {
                console.warn("[Serial] 尚未連線序列埠，無法送資料");
                return;
            }

            try {
                let buf;
                if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
                    buf = data instanceof Uint8Array ? data : new Uint8Array(data);
                } else if (typeof data === "string") {
                    buf = new TextEncoder().encode(data);
                } else {
                    throw new Error("serialWrite 只接受 string 或 Uint8Array / ArrayBuffer");
                }
                await serialWriter.write(buf);
            } catch (e) {
                console.error("[Serial] write error:", e);
            }
        };

        // 如需要之後也可以補一個關閉函式：
        window.serialClose = async function () {
            try {
                if (serialWriter) {
                    await serialWriter.close?.();
                    serialWriter.releaseLock();
                    serialWriter = null;
                }
                if (serialPort) {
                    await serialPort.close();
                    serialPort = null;
                }
                console.log("[Serial] 已關閉序列埠");
            } catch (e) {
                console.error("[Serial] close error:", e);
            }
        };

        async function closeSerialSafely() {
            try {
                if (serialWriter) {
                    try { await serialWriter.close(); } catch (e) { }
                    serialWriter.releaseLock();
                    serialWriter = null;
                }

                if (serialPort) {
                    try { await serialPort.close(); } catch (e) { }
                    serialPort = null;
                }
            } catch (e) {
                console.error("closeSerialSafely error:", e);
            }
        }

        //==================================================================================HID_932X
        let keyboardLed = { num: 0, caps: 0, scroll: 0 };
        let lastKeyDisplayCode = null;  // 記住目前顯示的是哪一顆鍵

        async function HID_send_getinfo() {
            const pkt = new Uint8Array([0x57, 0xAB, 0x00, 0x01, 0x00, 0x03]);
            try {
                await serialWriter.write(pkt);
            } catch (e) {
                console.error("[Serial] write error:", e);
            }
        }

        function HID_send_para() {
            const buf = new Uint8Array([0x57, 0xAB, 0x00, 0x88, 0x32,
                0x80,
                0x80,
                0x00,
                0x00, 0x01, 0xC2, 0x00,
                0x08, 0x00,
                0x00, 0x03, 0x86, 0x1A, 0x29, 0xE1, 0x00, 0x00, 0x00, 0x01,
                0x00, 0x0D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x24]);

            let xx = 0;
            let sum = 0;
            for (let i = 0; i < 55; i++) {
                sum += buf[i];
            }
            buf[55] = sum & 0xFF;

            serialWriter.write(buf);
        }

        // 協議常數（照你文件）
        const HID_HEAD1 = 0x57;
        const HID_HEAD2 = 0xAB;
        const HID_ADDR = 0x00;
        const HID_CMD_KEYBOARD = 0x02;   // 文件裡發鍵盤的 CMD（例子就是 0x02）
        const HID_CMD_MEDIAKEY = 0x03;
        const HID_CMD_MOUSE_ABS = 0x04;
        const HID_CMD_MOUSE_REL = 0x05;
        const HID_REPORT_LEN = 0x08;   // 後續 8 bytes: [mod, reserved, key1..key6]

        async function sendMediaKeyToHost(payload) {
            if (serialWriter) {
                if (payload.usage === 0x30) {
                    const pkt = new Uint8Array(2 + 1 + 1 + 1 + 2 + 1);

                    pkt[0] = HID_HEAD1;
                    pkt[1] = HID_HEAD2;
                    pkt[2] = HID_ADDR;
                    pkt[3] = HID_CMD_MEDIAKEY;
                    pkt[4] = 2;
                    pkt[5] = 0x01;
                    pkt[6] = 0x01;

                    // 計算累加和（所有前面 byte 相加取低 8 bit）
                    let sum = 0;
                    for (let i = 0; i < pkt.length - 1; i++) {
                        sum += pkt[i];
                    }
                    pkt[pkt.length - 1] = sum & 0xFF;

                    try {
                        await serialWriter.write(pkt);
                    } catch (e) {
                        console.error("[Serial] write error:", e);
                    }
                }
                else {
                    const pkt = new Uint8Array(2 + 1 + 1 + 1 + 4 + 1);

                    pkt[0] = HID_HEAD1;
                    pkt[1] = HID_HEAD2;
                    pkt[2] = HID_ADDR;
                    pkt[3] = HID_CMD_MEDIAKEY;
                    pkt[4] = 4;
                    pkt[5] = 0x02;
                    pkt[6] = (payload.usage >> 8) & 0xFF;
                    pkt[7] = payload.usage & 0xFF;
                    pkt[8] = 0x00;

                    // 計算累加和（所有前面 byte 相加取低 8 bit）
                    let sum = 0;
                    for (let i = 0; i < pkt.length - 1; i++) {
                        sum += pkt[i];
                    }
                    pkt[pkt.length - 1] = sum & 0xFF;

                    try {
                        await serialWriter.write(pkt);
                    } catch (e) {
                        console.error("[Serial] write error:", e);
                    }
                }
            }
        }

        // 把 browser 的 modifier 狀態轉成 HID modifier byte
        // bit0: LeftCtrl, bit1: LeftShift, bit2: LeftAlt, bit3: LeftGUI
        function buildModifierByteFromPayload(p) {
            let m = 0;
            if (p.ctrlKey) m |= 0x01;
            if (p.shiftKey) m |= 0x02;
            if (p.altKey) m |= 0x04;
            if (p.metaKey) m |= 0x08; // 當成左 Windows/GUI
            return m;
        }

        // 把 KeyboardEvent.code 轉成 HID usage（key1 欄位），沒有對應就回 null
        function hidUsageFromCode(code) {
            if (!code) return null;

            // A~Z
            if (/^Key[A-Z]$/.test(code)) {
                const ch = code.charCodeAt(3); // 'A'..'Z'
                return 0x04 + (ch - 65);       // 0x04 = A, 0x05 = B, ...
            }

            // 數字 1~9,0
            if (/^Digit[0-9]$/.test(code)) {
                const d = code[5];
                if (d === "0") return 0x27;
                return 0x1E + (parseInt(d, 10) - 1); // 1→0x1E
            }

            switch (code) {
                case "Enter": return 0x28;
                case "Escape": return 0x29;
                case "Backspace": return 0x2A;
                case "Tab": return 0x2B;
                case "Space": return 0x2C;
                case "Minus": return 0x2D;
                case "Equal": return 0x2E;
                case "BracketLeft": return 0x2F;
                case "BracketRight": return 0x30;
                case "Backslash": return 0x31;
                case "Semicolon": return 0x33;
                case "Quote": return 0x34;
                case "Backquote": return 0x35;
                case "Comma": return 0x36;
                case "Period": return 0x37;
                case "Slash": return 0x38;
                case "CapsLock": return 0x39;

                case "F1": return 0x3A;
                case "F2": return 0x3B;
                case "F3": return 0x3C;
                case "F4": return 0x3D;
                case "F5": return 0x3E;
                case "F6": return 0x3F;
                case "F7": return 0x40;
                case "F8": return 0x41;
                case "F9": return 0x42;
                case "F10": return 0x43;
                case "F11": return 0x44;
                case "F12": return 0x45;

                case "PrintScreen": return 0x46;
                case "ScrollLock": return 0x47;
                case "Pause": return 0x48;
                case "Insert": return 0x49;
                case "Home": return 0x4A;
                case "PageUp": return 0x4B;
                case "Delete": return 0x4C;
                case "End": return 0x4D;
                case "PageDown": return 0x4E;
                case "ArrowRight": return 0x4F;
                case "ArrowLeft": return 0x50;
                case "ArrowDown": return 0x51;
                case "ArrowUp": return 0x52;

                case "NumLock": return 0x53;
                case "NumpadDivide": return 0x54;
                case "NumpadMultiply": return 0x55;
                case "NumpadSubtract": return 0x56;
                case "NumpadAdd": return 0x57;
                case "NumpadEnter": return 0x58;
                case "Numpad1": return 0x59;
                case "Numpad2": return 0x5A;
                case "Numpad3": return 0x5B;
                case "Numpad4": return 0x5C;
                case "Numpad5": return 0x5D;
                case "Numpad6": return 0x5E;
                case "Numpad7": return 0x5F;
                case "Numpad8": return 0x60;
                case "Numpad9": return 0x61;
                case "Numpad0": return 0x62;
                case "NumpadDecimal": return 0x63;

                case "ContextMenu": return 0x65;

                default:
                    return null;
            }
        }

        // 組合一個完整命令包：
        // [HEAD1,HEAD2,ADDR,CMD,LEN, 8 bytes 報告, SUM]
        function buildHidPacket(modByte, keyUsage) {
            const pkt = new Uint8Array(2 + 1 + 1 + 1 + 8 + 1);

            pkt[0] = HID_HEAD1;
            pkt[1] = HID_HEAD2;
            pkt[2] = HID_ADDR;
            pkt[3] = HID_CMD_KEYBOARD;
            pkt[4] = HID_REPORT_LEN;

            // 8-byte Keyboard report
            const report = new Uint8Array(8);
            report[0] = modByte;      // modifier
            report[1] = 0x00;         // reserved
            report[2] = keyUsage || 0;
            // report[3..7] = 0

            pkt.set(report, 5);

            // 計算累加和（所有前面 byte 相加取低 8 bit）
            let sum = 0;
            for (let i = 0; i < pkt.length - 1; i++) {
                sum += pkt[i];
            }
            pkt[pkt.length - 1] = sum & 0xFF;

            return pkt;
        }

        function updateKeyboardStatusLabel(payload) {
            const span = document.getElementById("id_span_keyboard_status");
            if (!span) return;

            let keyLabel = payload.key;

            // 把常見的名稱轉成比較好看的文字
            if (keyLabel === "Control") keyLabel = "Ctrl";
            if (keyLabel === "AltGraph") keyLabel = "Alt";
            if (keyLabel === "Alt") keyLabel = "Alt";
            if (keyLabel === "Meta") keyLabel = "Win";
            if (keyLabel === "Shift") keyLabel = "Shift";

            // 空白鍵另外處理
            if (keyLabel === " ") keyLabel = "Space";

            // 單一字元轉大寫，例如 'p' → 'P'
            if (typeof keyLabel === "string" && keyLabel.length === 1) {
                keyLabel = keyLabel.toUpperCase();
            }

            span.textContent = keyLabel || "";
            lastKeyDisplayCode = payload.code || null;
        }

        function clearKeyboardStatusLabel() {
            const span = document.getElementById("id_span_keyboard_status");
            if (!span) return;
            span.textContent = "";
            lastKeyDisplayCode = null;
        }


        async function serialSendHid(evType, payload) {
            if (!serialWriter) {
                console.warn("[Serial] writer not ready, drop key:", evType, payload);
                return;
            }

            const mod = buildModifierByteFromPayload(payload);
            // keydn: 填 usage；keyup: keyUsage=0 代表釋放（只留下 modifier 狀態）
            const usage = (evType === "keydn") ? hidUsageFromCode(payload.code) : 0;
            const packet = buildHidPacket(mod, usage);

            // keydn：更新顯示
            if (evType === "keydn") {
                updateKeyboardStatusLabel(payload);
            }
            // keyup：如果放掉的是同一顆鍵，則清空顯示
            else if (evType === "keyup") {
                if (payload.code === lastKeyDisplayCode) {
                    clearKeyboardStatusLabel();
                }
            }

            try {
                await serialWriter.write(packet);
            } catch (e) {
                console.error("[Serial] write error:", e);
            }
        }

        // 統一出口：先走 COM port，如果沒接，再退回原本 WebSocket（方便你測試）
        function sendKeyToHost(evType, payload) {
            if (hotkeyRecording) {
                collectHotkeyFromVirtualKeyboard(evType, payload);
                return; // 阻止真正送到 HID/COM
            }

            if (serialWriter) {
                serialSendHid(evType, payload);
            }
            else {
                console.warn("[Key] no backend (Serial/WebSocket) ready, drop:", evType, payload);
            }
        }

        const asciiToHid = {
            'a': { mod: 0, code: 0x04 }, 'b': { mod: 0, code: 0x05 }, 'c': { mod: 0, code: 0x06 },
            'd': { mod: 0, code: 0x07 }, 'e': { mod: 0, code: 0x08 }, 'f': { mod: 0, code: 0x09 },
            'g': { mod: 0, code: 0x0A }, 'h': { mod: 0, code: 0x0B }, 'i': { mod: 0, code: 0x0C },
            'j': { mod: 0, code: 0x0D }, 'k': { mod: 0, code: 0x0E }, 'l': { mod: 0, code: 0x0F },
            'm': { mod: 0, code: 0x10 }, 'n': { mod: 0, code: 0x11 }, 'o': { mod: 0, code: 0x12 },
            'p': { mod: 0, code: 0x13 }, 'q': { mod: 0, code: 0x14 }, 'r': { mod: 0, code: 0x15 },
            's': { mod: 0, code: 0x16 }, 't': { mod: 0, code: 0x17 }, 'u': { mod: 0, code: 0x18 },
            'v': { mod: 0, code: 0x19 }, 'w': { mod: 0, code: 0x1A }, 'x': { mod: 0, code: 0x1B },
            'y': { mod: 0, code: 0x1C }, 'z': { mod: 0, code: 0x1D },

            'A': { mod: 0x02, code: 0x04 }, 'B': { mod: 0x02, code: 0x05 }, 'C': { mod: 0x02, code: 0x06 },
            'D': { mod: 0x02, code: 0x07 }, 'E': { mod: 0x02, code: 0x08 }, 'F': { mod: 0x02, code: 0x09 },
            'G': { mod: 0x02, code: 0x0A }, 'H': { mod: 0x02, code: 0x0B }, 'I': { mod: 0x02, code: 0x0C },
            'J': { mod: 0x02, code: 0x0D }, 'K': { mod: 0x02, code: 0x0E }, 'L': { mod: 0x02, code: 0x0F },
            'M': { mod: 0x02, code: 0x10 }, 'N': { mod: 0x02, code: 0x11 }, 'O': { mod: 0x02, code: 0x12 },
            'P': { mod: 0x02, code: 0x13 }, 'Q': { mod: 0x02, code: 0x14 }, 'R': { mod: 0x02, code: 0x15 },
            'S': { mod: 0x02, code: 0x16 }, 'T': { mod: 0x02, code: 0x17 }, 'U': { mod: 0x02, code: 0x18 },
            'V': { mod: 0x02, code: 0x19 }, 'W': { mod: 0x02, code: 0x1A }, 'X': { mod: 0x02, code: 0x1B },
            'Y': { mod: 0x02, code: 0x1C }, 'Z': { mod: 0x02, code: 0x1D },

            '1': { mod: 0, code: 0x1E }, '2': { mod: 0, code: 0x1F }, '3': { mod: 0, code: 0x20 },
            '4': { mod: 0, code: 0x21 }, '5': { mod: 0, code: 0x22 }, '6': { mod: 0, code: 0x23 },
            '7': { mod: 0, code: 0x24 }, '8': { mod: 0, code: 0x25 }, '9': { mod: 0, code: 0x26 },
            '0': { mod: 0, code: 0x27 },

            ' ': { mod: 0, code: 0x2C },
            '\n': { mod: 0, code: 0x28 },

            '-': { mod: 0, code: 0x2D }, '=': { mod: 0, code: 0x2E },
            '[': { mod: 0, code: 0x2F }, ']': { mod: 0, code: 0x30 },
            '\\': { mod: 0, code: 0x31 },
            ';': { mod: 0, code: 0x33 }, "'": { mod: 0, code: 0x34 },
            '`': { mod: 0, code: 0x35 },
            ',': { mod: 0, code: 0x36 }, '.': { mod: 0, code: 0x37 },
            '/': { mod: 0, code: 0x38 },

            '!': { mod: 0x02, code: 0x1E }, '@': { mod: 0x02, code: 0x1F },
            '#': { mod: 0x02, code: 0x20 }, '$': { mod: 0x02, code: 0x21 },
            '%': { mod: 0x02, code: 0x22 }, '^': { mod: 0x02, code: 0x23 },
            '&': { mod: 0x02, code: 0x24 }, '*': { mod: 0x02, code: 0x25 },
            '(': { mod: 0x02, code: 0x26 }, ')': { mod: 0x02, code: 0x27 },
            '_': { mod: 0x02, code: 0x2D }, '+': { mod: 0x02, code: 0x2E },
            '{': { mod: 0x02, code: 0x2F }, '}': { mod: 0x02, code: 0x30 },
            '|': { mod: 0x02, code: 0x31 }, ':': { mod: 0x02, code: 0x33 },
            '"': { mod: 0x02, code: 0x34 }, '~': { mod: 0x02, code: 0x35 },
            '<': { mod: 0x02, code: 0x36 }, '>': { mod: 0x02, code: 0x37 },
            '?': { mod: 0x02, code: 0x38 },
        };

        async function sendTextToHost(text) {
            let mod;

            for (const ch of text) {
                const info = asciiToHid[ch];
                if (!info) continue;

                // key down
                if (keyboardLed.caps) {
                    mod = info.mod ^ 0x02;
                }
                else {
                    mod = info.mod;
                }
                const pktDown = buildHidPacket(mod, info.code);
                await serialWriter.write(pktDown);
                await sleep(12);

                // key up
                const pktUp = buildHidPacket(0, 0);
                await serialWriter.write(pktUp);
                await sleep(12);
            }
        }

        function sleep(ms) {
            return new Promise(r => setTimeout(r, ms));
        }


        async function sendMouseRelToHost(payload) {
            if (serialWriter) {
                const pkt = new Uint8Array(2 + 1 + 1 + 1 + 5 + 1);

                pkt[0] = HID_HEAD1;
                pkt[1] = HID_HEAD2;
                pkt[2] = HID_ADDR;
                pkt[3] = HID_CMD_MOUSE_REL;
                pkt[4] = 5;
                pkt[5] = 0x01;
                pkt[6] = payload.button;
                pkt[7] = payload.x;
                pkt[8] = payload.y;
                pkt[9] = payload.wheel;

                // 計算累加和（所有前面 byte 相加取低 8 bit）
                let sum = 0;
                for (let i = 0; i < pkt.length - 1; i++) {
                    sum += pkt[i];
                }
                pkt[pkt.length - 1] = sum & 0xFF;

                try {
                    await serialWriter.write(pkt);
                } catch (e) {
                    console.error("[Serial] write error:", e);
                }
            }
        }

        async function sendMouseAbsToHost(payload) {
            if (serialWriter) {
                const pkt = new Uint8Array(2 + 1 + 1 + 1 + 7 + 1);

                pkt[0] = HID_HEAD1;
                pkt[1] = HID_HEAD2;
                pkt[2] = HID_ADDR;
                pkt[3] = HID_CMD_MOUSE_ABS;
                pkt[4] = 7;
                pkt[5] = 0x02;
                pkt[6] = payload.button;
                pkt[7] = payload.x & 0xFF;             // X low
                pkt[8] = (payload.x >> 8) & 0xFF;      // X high
                pkt[9] = payload.y & 0xFF;             // Y low
                pkt[10] = (payload.y >> 8) & 0xFF;      // Y high
                pkt[11] = payload.wheel;

                // 計算累加和（所有前面 byte 相加取低 8 bit）
                let sum = 0;
                for (let i = 0; i < pkt.length - 1; i++) {
                    sum += pkt[i];
                }
                pkt[pkt.length - 1] = sum & 0xFF;

                try {
                    await serialWriter.write(pkt);
                } catch (e) {
                    console.error("[Serial] write error:", e);
                }
            }
        }

        //==================================================================================Topbar處理
        const topbar = document.querySelector(".top-bar");
        const topbarTitle = document.getElementById("topbarTitle");
        const showBtn = document.getElementById("id_button_showTopbar");
        let last_topbar = 1;

        // 縮小button
        document.getElementById("toggleTopbarBtn").addEventListener("click", () => {
            topbar.classList.toggle("collapsed");

            // 切換標題文字
            if (topbar.classList.contains("collapsed")) {
                topbarTitle.textContent = "j5";
                last_topbar = 0;
            } else {
                topbarTitle.textContent = "j5create";
                last_topbar = 1;
            }

            let animating = true;
            function step() {
                resizeVideo();
                if (animating) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);

            topbar.addEventListener("transitionend", function handler(e) {
                topbar.addEventListener("transitionend", function handler(e) {
                    if (e.propertyName === "width") {
                        // 等待瀏覽器完成最後 layout
                        setTimeout(() => {
                            resizeVideo();   // 此時一定是 60 或 200
                        }, 50); // 50ms 一般足夠，必要時可調 100ms

                        topbar.removeEventListener("transitionend", handler);
                    }
                });
            });
        });

        // 隱藏topbar
        document.getElementById("id_button_hideTopbar").addEventListener("click", () => {
            topbar.classList.remove("collapsed");
            topbar.classList.add("hidden");

            showBtn.style.display = "flex";   // 顯示浮動按鈕

            animateTopbarResize();
        });

        // 顯示topbar
        showBtn.addEventListener("click", () => {
            topbar.classList.remove("hidden");
            if (last_topbar)
                topbar.classList.remove("collapsed");
            else
                topbar.classList.add("collapsed");

            showBtn.style.display = "none";  // 隱藏浮動按鈕

            animateTopbarResize();
        });

        function animateTopbarResize() {
            let animating = true;

            function step() {
                resizeVideo();
                if (animating) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);

            function handler(e) {
                if (e.propertyName === "width") {
                    setTimeout(() => resizeVideo(), 50);
                    animating = false;
                    topbar.removeEventListener("transitionend", handler);
                }
            }

            topbar.addEventListener("transitionend", handler);
        }

        //==================================================================================PIP按紐
        document.getElementById("pip-button").addEventListener("click", async (e) => {
            if (!document.pictureInPictureElement) {
                try {
                    await video.requestPictureInPicture();
                } catch (error) {
                    console.error("無法進入 PiP 模式:", error);
                }
            } else {
                try {
                    await document.exitPictureInPicture();
                } catch (error) {
                    console.error("無法離開 PiP 模式:", error);
                }
            }
        });

        video.addEventListener("enterpictureinpicture", () => {
            document.getElementById("pip-button").classList.add("active");
            isPIP = true;
        });

        video.addEventListener("leavepictureinpicture", () => {
            document.getElementById("pip-button").classList.remove("active");
            isPIP = false;
        });

        //==================================================================================截圖按紐
        document.getElementById("snapshot-btn").addEventListener("click", () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 產生唯一檔名：YYYYMMDD_HHMMSS_mmm.jpg
            const now = new Date();
            const pad = (n, len = 2) => String(n).padStart(len, "0");
            const filename =
                now.getFullYear() +
                pad(now.getMonth() + 1) +
                pad(now.getDate()) + "_" +
                pad(now.getHours()) +
                pad(now.getMinutes()) +
                pad(now.getSeconds()) + //"_" +
                //pad(now.getMilliseconds(), 3) +
                ".jpg";

            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            }, "image/jpeg", 0.92);  // 🔴 輸出 JPG，壓縮品質 92%
        });

        //==================================================================================錄影
        let mediaRecorder;
        let recordedChunks = [];
        const recordBtn = document.getElementById("record-btn");

        recordBtn.addEventListener("click", async () => {
            if (!mediaRecorder || mediaRecorder.state === "inactive") {
                const stream = video.srcObject;
                if (!stream) {
                    showToast("沒有影片串流可錄製");
                    return;
                }

                mediaRecorder = new MediaRecorder(stream, {
                    mimeType: "video/webm; codecs=vp8,opus"
                });

                recordedChunks = [];
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) recordedChunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: "video/webm" });
                    const url = URL.createObjectURL(blob);

                    const now = new Date();
                    const pad = (n, len = 2) => String(n).padStart(len, "0");
                    const filename =
                        now.getFullYear() +
                        pad(now.getMonth() + 1) +
                        pad(now.getDate()) + "_" +
                        pad(now.getHours()) +
                        pad(now.getMinutes()) +
                        pad(now.getSeconds()) +
                        ".webm";

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(url);
                };

                mediaRecorder.start();

                // 🔴 錄影中 → 按鈕顯示紅點閃爍
                //recordBtn.innerHTML = '<span class="record-dot"></span>停止錄影';
                document.getElementById("id_span_record_icon").innerHTML = '<span class="record-dot"></span>';
                console.log("錄影開始");
            } else {
                mediaRecorder.stop();

                // ⏹ 停止 → 按鈕恢復文字
                //recordBtn.textContent = "開始錄影";
                // recordBtn.textContent = "開始錄影";
                document.getElementById("id_span_record_icon").innerHTML =
                    '<img src="icon/record.png" alt="record" style="width:19px; height:19px; vertical-align:middle;">';
                console.log("錄影結束");
            }
        });

        //==================================================================================全螢幕
        function isFullscreen() {
            return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        }
        async function enterFullscreen() {
            const el = videoBox;
            const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
            if (req) await req.call(el);
        }
        async function exitFullscreen() {
            const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
            if (exit) await exit.call(document);
        }
        function refreshFSButtonText() {
            if (!isFullscreen()) {
                // 離開全螢幕 → 若之前鍵盤是開的 → 自動重新開啟
                if (keyboardWasOpenBeforeFullscreen) {
                    document.getElementById("toggleKeyboardBtn").click();
                }
            }
            //fsBtn.textContent = isFullscreen() ? '⤢ 退出全螢幕' : '⛶ 全螢幕';
        }
        fsBtn.addEventListener('click', async () => {
            // 進入全螢幕前 → 記住鍵盤是否開啟
            if (!isFullscreen()) {
                keyboardWasOpenBeforeFullscreen = isKeyboardOpen();

                // 若鍵盤是開啟的 → 先關閉它
                if (keyboardWasOpenBeforeFullscreen) {
                    document.getElementById("toggleKeyboardBtn").click();
                }
            }

            if (isFullscreen()) await exitFullscreen(); else await enterFullscreen();
            refreshFSButtonText();
        });
        //video.addEventListener('dblclick', () => fsBtn.click());
        ['fullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange'].forEach(ev =>
            document.addEventListener(ev, refreshFSButtonText)
        );

        //==================================================================================滑鼠/touch處理
        let scroll_speed = 1;
        let scroll_dir = -1;
        let mouse_abs_or_rel = false;

        document.getElementById('id_select_scrollspeed').addEventListener('change', (e) => {
            scroll_speed = Number(e.target.value);
            //console.log("scroll_speed =", scroll_speed);
        });

        document.getElementById('id_select_direction').addEventListener('change', (e) => {
            scroll_dir = Number(e.target.value);
            //console.log("scroll_dir =", scroll_dir);
        });

        document.getElementById("lockMouse-btn").addEventListener("click", () => {
            if (video.requestPointerLock) {
                video.requestPointerLock();
                video.focus();
            } else {
                showToast("瀏覽器不支援 Pointer Lock API");
            }
        });

        // 當滑鼠成功鎖定時隱藏游標
        document.addEventListener("pointerlockchange", () => {
            if (document.pointerLockElement === video) {
                video.style.cursor = "none";
                document.getElementById("lockMouse-btn").classList.add("active");
                mouse_abs_or_rel = true;
                console.log("滑鼠已鎖定並隱藏");
            } else {
                video.style.cursor = "default";
                document.getElementById("lockMouse-btn").classList.remove("active");
                mouse_abs_or_rel = false
                console.log("滑鼠已釋放");
            }
        });

        let lastMouseAbsPayload = null;     // 上一次已送出的payload
        let pendingMouseAbsPayload = { x: 0, y: 0, button: 0, wheel: 0 };;  // 尚未送出的最新payload
        let lastMouseRelPayload = null;     // 上一次已送出的payload
        let pendingMouseRelPayload = { x:0, y:0, button:0, wheel:0 };  // 尚未送出的最新payload
        let one_second_count = 0;
        setInterval(() => {
            if (mouse_abs_or_rel) {     //相對模式
                if (!pendingMouseRelPayload) return;

                // 若內容不同 → 傳送
                if (!isSameMousePayload(lastMouseRelPayload, pendingMouseRelPayload)) {
                    lastMouseRelPayload = { ...pendingMouseRelPayload }; // 複製內容
                    pendingMouseRelPayload.x = 0;
                    pendingMouseRelPayload.y = 0;
                    pendingMouseRelPayload.wheel = 0;
                    sendMouseRelToHost(lastMouseRelPayload);
                }
            }
            else {                      //絕對模式
                if (!pendingMouseAbsPayload) return;

                // 若內容不同 → 傳送
                if (!isSameMousePayload(lastMouseAbsPayload, pendingMouseAbsPayload)) {
                    lastMouseAbsPayload = { ...pendingMouseAbsPayload }; // 複製內容
                    pendingMouseAbsPayload.wheel = 0;
                    sendMouseAbsToHost(pendingMouseAbsPayload);
                }
            }

            one_second_count = one_second_count + 1
            if (one_second_count >= 200) {
                HID_send_getinfo();
                one_second_count = 0;
            }
        }, 10);

        function isSameMousePayload(a, b) {
            if (!a || !b) return false;
            return (
                a.x === b.x &&
                a.y === b.y &&
                a.button === b.button &&
                a.wheel === b.wheel
            );
        }

        function getScrollValue(deltaY) {
            if (!deltaY) return 0;

            // 方向處理
            deltaY = deltaY * scroll_dir;

            // 速度倍率與限制
            let value = Math.sign(deltaY) * Math.min(scroll_speed, 10);

            return value;
        }
        const testt = document.getElementById("testtext");
        function clampInt8(v) {
            if (v > 127) return 127;
            if (v < -127) return -127;  //這裡有坑, 他的補數是沒有FF的, XXX
            return v;
        }


        function sendMouseEvent_Relative(x, y, buttonState = 0, wheelState = 0) {
            const payload = {
                x: clampInt8(x),
                y: clampInt8(y),
                button: buttonState,
                wheel: wheelState
            };
            //sendMouseRelToHost(payload);
            pendingMouseRelPayload.x = clampInt8(pendingMouseRelPayload.x + x);
            pendingMouseRelPayload.y = clampInt8(pendingMouseRelPayload.y + y);
            pendingMouseRelPayload.button = buttonState;
            pendingMouseRelPayload.wheel += wheelState;
            //console.log("x:", x, "y:", y);
        }

        function sendMouseEvent_Absolute(x, y, buttonState = 0, wheelState = 0) {
            const rect = video.getBoundingClientRect();

            pendingMouseAbsPayload.x = Math.round((x - rect.left) * sendW_coef);
            pendingMouseAbsPayload.y = Math.round((y - rect.top) * sendH_coef);
            pendingMouseAbsPayload.button = buttonState;
            pendingMouseAbsPayload.wheel += wheelState;
        }

        function SendMouseFunc(e) {
            if (isPIP) return;
            movec++;
            const wheel = getScrollValue(e.deltaY);

            mouseButton = e.buttons;

            if (mouse_abs_or_rel) {
                sendMouseEvent_Relative(e.movementX, e.movementY, mouseButton, wheel);
            } else {
                sendMouseEvent_Absolute(e.clientX, e.clientY, mouseButton, wheel);
            }
        }

        // 滑鼠事件處理
        video.addEventListener("mousemove", (e) => {
                SendMouseFunc(e);
                abs_last_x = e.clientX;
                abs_last_y = e.clientY;
        });

        let movec = 0;
        setInterval(async () => {
            //console.log("movec=", movec);
            movec = 0;
        }, 1000);

        video.addEventListener("mousedown", (e) => {
            console.log("mousedown : ", e.button);
            mouseButton = (e.buttons !== undefined) ? e.buttons : mouseButton;
            SendMouseFunc(e);
            abs_last_x = e.clientX;
            abs_last_y = e.clientY;
        });

        video.addEventListener("mouseup", (e) => {
            mouseButton = (e.buttons !== undefined) ? e.buttons : mouseButton;
            SendMouseFunc(e);
            abs_last_x = e.clientX;
            abs_last_y = e.clientY;
        });

        video.addEventListener("wheel", (e) => {
            e.preventDefault();  // 避免頁面捲動
            SendMouseFunc(e);
            abs_last_x = e.clientX;
            abs_last_y = e.clientY;
        });

        // Touch事件處理
        let touchTimer_FixedWheel = null;
        let touchFlag_FixedTimeout = false;
        let touchFlag_FixedWheel = false;

        let touchTimer_RClick = null;
        let touchFlag_RClick = 0;

        let touchFlag_Locked = true;
        let lastPinchY = null;
        let fx = 0, fy = 0;

        function touch_clear_RClick() {
            clearTimeout(touchTimer_RClick);
            touchFlag_RClick = 0;
        }

        video.addEventListener("touchstart", (e) => {
            e.preventDefault();

            if (e.touches.length == 1) {
                //Clear all
                clearTimeout(touchTimer_FixedWheel);
                touchFlag_FixedTimeout = false;
                touchFlag_FixedWheel = false;
                touchFlag_Locked = true;
                lastPinchY = null;

                fx = e.touches[0].clientX;
                fy = e.touches[0].clientY;
                abs_last_x = fx;
                abs_last_y = fy;

                touchTimer_FixedWheel = setTimeout(() => {
                    console.log("touchTimer_FixedWheel done");
                    touchFlag_FixedTimeout = true;
                }, 300);

                touchTimer_RClick = setTimeout(() => {
                    console.log("touchTimer_RClick done");
                    touchFlag_RClick = 1;
                }, 1000);
            }
            else if (e.touches.length >= 2) {
                // 兩指以上 → 啟用模擬滾輪模式;
                const y1 = e.touches[0].clientY;
                const y2 = e.touches[1].clientY;
                lastPinchY = (y1 + y2) / 2;

                touchFlag_Locked = false;

                touch_clear_RClick();

                clearTimeout(touchTimer_FixedWheel);
                if (!touchFlag_FixedTimeout) {
                    touchFlag_FixedWheel = true;
                }
                return;
            }
        });

        video.addEventListener("touchmove", (e) => {
            e.preventDefault();

            if (touchFlag_Locked) {
                if (Math.abs(e.touches[0].clientX - fx) > 10 || Math.abs(e.touches[0].clientY - fy) > 10) {
                    touchFlag_Locked = false;
                    touch_clear_RClick();
                    touchFlag_FixedTimeout = true;

                    touchToMouseFunc(fx, fy, 1, 0);
                    //sendMouseEvent_Absolute(fx, fy, 1, 0);
                }
                return;
            }

            if (e.touches.length >= 2) {
                const y1 = e.touches[0].clientY;
                const y2 = e.touches[1].clientY;
                const centerY = (y1 + y2) / 2;
                const deltaY = centerY - lastPinchY;
                if (Math.abs(deltaY) >= 4) { // 避免過小移動造成雜訊
                    touchToMouseFunc(fx, fy, !touchFlag_FixedWheel, deltaY);
                    //sendMouseEvent_Absolute(fx, fy, !touchFlag_FixedWheel, deltaY);
                    lastPinchY = centerY;
                }
                return;
            }

            if (!touchFlag_FixedWheel) {
                fx = e.touches[0].clientX;
                fy = e.touches[0].clientY;
                abs_last_x = fx;
                abs_last_y = fy;
            }
            touchToMouseFunc(fx, fy, !touchFlag_FixedWheel, 0);
            //sendMouseEvent_Absolute(fx, fy, !touchFlag_FixedWheel, 0);
        });

        video.addEventListener("touchend", (e) => {
            e.preventDefault();

            if (e.touches.length == 0) {
                const touch = e.changedTouches[0];

                if (touchFlag_RClick) {
                    touchToMouseFunc(touch.clientX, touch.clientY, 2, 0); // 模擬右鍵 down
                    setTimeout(() => {
                        touchToMouseFunc(touch.clientX, touch.clientY, 0, 0); // 右鍵 up
                    }, 20); // 50ms 延遲
                    // sendMouseEvent_Absolute(touch.clientX, touch.clientY, 2, 0); // 模擬右鍵 down
                }
                else if (touchFlag_Locked) {
                    touchToMouseFunc(fx, fy, 1, 0);
                    setTimeout(() => {
                        touchToMouseFunc(fx, fy, 0, 0); // 左鍵 up
                    }, 20);
                    //sendMouseEvent_Absolute(fx, fy, 1, 0);
                }
                else {
                    setTimeout(() => {
                        touchToMouseFunc(touch.clientX, touch.clientY, 0, 0); // 右鍵 up
                    }, 20); // 50ms 延遲
                    //sendMouseEvent_Absolute(touch.clientX, touch.clientY, 0, 0);
                }

                clearTimeout(touchTimer_FixedWheel);
                touchFlag_FixedTimeout = false;
                touchFlag_FixedWheel = false;
                touchFlag_Locked = true;
                lastPinchY = null;
            }

            touch_clear_RClick();
        });

        let lastX = null, lastY = null;
        function touchToMouseFunc(x, y, bn, wl) {
            if (isPIP) return;

            const wheel = getScrollValue(wl);
            let deltaX, deltaY;
            if (document.pointerLockElement === video) {
                if (lastX !== null && lastY !== null) {
                    deltaX = x - lastX;
                    deltaY = y - lastY;
                    console.log("移動量:", deltaX, deltaY);
                }
                lastX = x;
                lastY = y;
                sendMouseEvent_Relative(deltaX, deltaY, bn, wheel);
            } else {
                sendMouseEvent_Absolute(x, y, bn, wheel);
            }
        }

        //==================================================================================滑鼠抖動
        function SendFakeMouseFunc() {
            const randX = Math.floor(Math.random() * 3) - 1; // 整數 -20 ~ +20
            const randY = Math.floor(Math.random() * 3) - 1; // 整數 -20 ~ +20
            sendMouseEvent_Absolute(abs_last_x + randX, abs_last_y + randY);
        }

        let mouseInterval = null;
        let circleAngle = 0;
        let lineOffset = 0;
        let lineDir = 1;
        const circleStep = 10;   // 每次增加角度 (度數)
        let g_settings = {
            mouse: {
                jitter_mode: "circle",
                jitter_speed: 10,
                jitter_range: 20
            },
        };

        function sendCircleMotion() {
            circleAngle = (circleAngle + g_settings.mouse.jitter_speed) % 360;
            const rad = circleAngle * Math.PI / 180;

            if (document.pointerLockElement === video) {
                // === 相對模式 ===
                const dx = Math.round(g_settings.mouse.jitter_range * Math.cos(rad) * 0.1); // 取差分的小量
                const dy = Math.round(g_settings.mouse.jitter_range * Math.sin(rad) * 0.1);
                sendMouseEvent_Relative(dx, dy, 0, 0);
                //console.log("Relative:", dx, dy);
            } else {
                // === 絕對模式 ===
                const x = Math.round(abs_last_x + g_settings.mouse.jitter_range * Math.cos(rad));
                const y = Math.round(abs_last_y + g_settings.mouse.jitter_range * Math.sin(rad));
                sendMouseEvent_Absolute(x, y, 0, 0);
                //console.log("Absolute:", x, y);
            }
        }

        function sendLineMotion(horizontal) {
            lineOffset += g_settings.mouse.jitter_speed * lineDir;
            if (Math.abs(lineOffset) >= g_settings.mouse.jitter_range) {
                lineDir *= -1; // 到邊界反向
            }

            if (document.pointerLockElement === video) {
                const dx = horizontal ? g_settings.mouse.jitter_speed * lineDir : 0;
                const dy = horizontal ? 0 : g_settings.mouse.jitter_speed * lineDir;
                sendMouseEvent_Relative(dx, dy, 0, 0);
            } else {
                const x = Math.round(abs_last_x + (horizontal ? lineOffset : 0));
                const y = Math.round(abs_last_y + (horizontal ? 0 : lineOffset));
                sendMouseEvent_Absolute(x, y, 0, 0);
            }
        }

        function sendJitterMotion() {
            if (document.pointerLockElement === video) {
                const dx = Math.floor(Math.random() * 5) - 2; // -2 ~ +2
                const dy = Math.floor(Math.random() * 5) - 2;
                sendMouseEvent_Relative(dx, dy, 0, 0);
            } else {
                const x = abs_last_x + (Math.floor(Math.random() * 5) - 2);
                const y = abs_last_y + (Math.floor(Math.random() * 5) - 2);
                sendMouseEvent_Absolute(x, y, 0, 0);
            }
        }

        document.getElementById("autoMouse-btn").addEventListener("click", (e) => {
            if (mouseInterval) {
                clearInterval(mouseInterval);
                mouseInterval = null;
                e.currentTarget.classList.remove("active");
                console.log("停止滑鼠模擬");
            } else {
                circleAngle = 0;
                lineOffset = 0;
                lineDir = 1;

                const mode = g_settings.mouse.jitter_mode;

                if (mode === "circle") {
                    mouseInterval = setInterval(sendCircleMotion, 20);
                } else if (mode === "hline") {
                    mouseInterval = setInterval(() => sendLineMotion(true), 50);
                } else if (mode === "vline") {
                    mouseInterval = setInterval(() => sendLineMotion(false), 50);
                } else {
                    mouseInterval = setInterval(sendJitterMotion, 50);
                }

                e.currentTarget.classList.add("active");
                console.log("開始滑鼠模擬，模式:", mode);
            }
        });

        //==================================================================================鍵盤處理
        video.addEventListener("keydown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const payload = {
                key: e.key,
                code: e.code,
                altKey: e.altKey,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                metaKey: e.metaKey
            };
            highlightVirtualKey(e.code, true);
            sendKeyToHost("keydn", payload);
        });

        video.addEventListener("keyup", (e) => {
            const payload = {
                key: e.key,
                code: e.code,
                altKey: e.altKey,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                metaKey: e.metaKey
            };
            highlightVirtualKey(e.code, false);
            sendKeyToHost("keyup", payload);
        });

        kb.addEventListener("keydown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const payload = {
                key: e.key,
                code: e.code,
                altKey: e.altKey,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                metaKey: e.metaKey
            };
            highlightVirtualKey(e.code, true);
            sendKeyToHost("keydn", payload);
        });

        kb.addEventListener("keyup", (e) => {
            const payload = {
                key: e.key,
                code: e.code,
                altKey: e.altKey,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                metaKey: e.metaKey
            };
            highlightVirtualKey(e.code, false);
            sendKeyToHost("keyup", payload);
        });

        //==================================================================================剪貼簿處理
        ["sendKeyboardBtn1", "sendKeyboardBtn2", "sendKeyboardBtn3"].forEach((id, idx) => {
            const el = document.getElementById(id);

            el.addEventListener("click", () => {
                const text = document.getElementById(`id_text_clipboard${idx + 1}`).value;
                sendTextToHost(text);
                video.focus();
            });
        });

        ["id_text_clipboard1", "id_text_clipboard2", "id_text_clipboard3"].forEach((id, idx) => {
            const el = document.getElementById(id);

            el.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault(); // 防止換行（如果是 textarea）
                    const text = el.value;
                    sendTextToHost(text);
                    video.focus();
                }
            });
        });

        document.getElementById('sendClipboardBtn').addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (text && text.length > 0) {
                    console.log("剪貼簿內容：", text);
                    await navigator.clipboard.writeText(text); // 確保 clipboard 是最新內容
                    sendTextToHost(text);
                } else {
                    showToast("剪貼簿為空");
                }
            } catch (err) {
                showToast("無法讀取剪貼簿：" + err.message);
            }

            video.focus();
        });

        //==================================================================================Hotkey處理
        let hotkeyRecording = false;
        let currentHotkeyIndex = -1;
        let hotkeyTargetBox = null;

        let hotkeyRecord_tmp = { ctrl: false, alt: false, shift: false, meta: false, key: "", code: "" };
        let hotkeyRecord = [
            { ctrl: false, alt: false, shift: false, meta: false, key: "", code: "" },
            { ctrl: false, alt: false, shift: false, meta: false, key: "", code: "" },
            { ctrl: false, alt: false, shift: false, meta: false, key: "", code: "" }
        ];

        // 三個textbox點擊錄製
        ["id_text_sendHotkey1", "id_text_sendHotkey2", "id_text_sendHotkey3"].forEach((id, idx) => {
            const el = document.getElementById(id);

            el.addEventListener("click", () => {
                startHotkeyRecording(idx, el);
            });
        });

        // 三個送出按鈕
        ["id_btn_sendHotkey1", "id_btn_sendHotkey2", "id_btn_sendHotkey3"].forEach((id, idx) => {
            const el = document.getElementById(id);

            el.addEventListener("click", () => {
                sendHotkey(hotkeyRecord[idx]);
                video.focus();
            });
        });

        // 儲存hotkey
        document.getElementById("hotkeyConfirmBtn").addEventListener("click", () => {
            hotkeyRecord[currentHotkeyIndex] = { ...hotkeyRecord_tmp };
            updateHotkeyTextbox();
            stopHotkeyRecording();
        });

        // 取消
        document.getElementById("hotkeyCancelBtn").addEventListener("click", () => {
            stopHotkeyRecording();
        });

        function startHotkeyRecording(index, targetBox) {
            hotkeyRecording = true;
            currentHotkeyIndex = index;
            hotkeyTargetBox = targetBox;

            // 清空狀態
            hotkeyRecord_tmp = {
                ctrl: false,
                alt: false,
                shift: false,
                meta: false,
                key: "",
                code: "",
                ctrl_click: false,
                alt_click: false,
                shift_click: false,
                meta_click: false,
                normal_click: false
            };

            // 顯示 modal
            showHotkeyMask();

            // 不要顯示LED
            const Led = { num: 0, caps: 0, scroll: 0 };
            setKeyboardLEDs(Led);

            // 打開虛擬鍵盤
            showVirtualKeyboard();

            video.focus();
        }

        function stopHotkeyRecording() {
            hotkeyRecording = false;
            currentHotkeyIndex = -1;
            hotkeyTargetBox = null;

            hideHotkeyMask();
            hideVirtualKeyboard();

            document.querySelectorAll(".vk-key").forEach(k => k.classList.remove("active"));
        }

        function sendHotkey(hk) {
            if (!hk.key) {
                showToast("尚未設定 Hotkey");
                return;
            }

            sendKeyToHost("keydn", {
                key: hk.key,
                code: hk.code,
                ctrlKey: hk.ctrl,
                altKey: hk.alt,
                shiftKey: hk.shift,
                metaKey: hk.meta
            });

            setTimeout(() => {
                sendKeyToHost("keyup", {
                    key: hk.key,
                    code: hk.code,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false
                });
            }, 80);
        }

        function showHotkeyMask() {
            document.getElementById("hotkey-video-mask").classList.add("show");
        }

        function hideHotkeyMask() {
            document.getElementById("hotkey-video-mask").classList.remove("show");
        }

        function collectHotkeyFromVirtualKeyboard(type, payload) {
            const code = payload.code;
            const key = payload.key;

            if (type == "keydn") {

                if (code.startsWith("Control")) {
                    if (!hotkeyRecord_tmp.ctrl_click) {
                        hotkeyRecord_tmp.ctrl_click = true;
                        hotkeyRecord_tmp.ctrl = !hotkeyRecord_tmp.ctrl;
                    }
                }
                else if (code.startsWith("Shift")) {
                    if (!hotkeyRecord_tmp.shift_click) {
                        hotkeyRecord_tmp.shift_click = true;
                        hotkeyRecord_tmp.shift = !hotkeyRecord_tmp.shift;
                    }
                }
                else if (code.startsWith("Alt")) {
                    if (!hotkeyRecord_tmp.alt_click) {
                        hotkeyRecord_tmp.alt_click = true;
                        hotkeyRecord_tmp.alt = !hotkeyRecord_tmp.alt;
                    }
                }
                else if (code.startsWith("Meta")) {
                    if (!hotkeyRecord_tmp.meta_click) {
                        hotkeyRecord_tmp.meta_click = true;
                        hotkeyRecord_tmp.meta = !hotkeyRecord_tmp.meta;
                    }
                }
                else {
                    // 一般按鍵只能單一
                    if (!hotkeyRecord_tmp.normal_click) {
                        hotkeyRecord_tmp.normal_click = true;

                        // ⭐ 自動轉大寫（只轉單字元 a~z）
                        const upper = (typeof key === "string" && key.length === 1)
                            ? key.toUpperCase()
                            : key;

                        hotkeyRecord_tmp.key = upper;
                        hotkeyRecord_tmp.code = code;
                    }
                }
            } else if (type == "keyup") {
                if (code.startsWith("Control")) {
                    hotkeyRecord_tmp.ctrl_click = false;
                }
                else if (code.startsWith("Shift")) {
                    hotkeyRecord_tmp.shift_click = false;
                }
                else if (code.startsWith("Alt")) {
                    hotkeyRecord_tmp.alt_click = false;
                }
                else if (code.startsWith("Meta")) {
                    hotkeyRecord_tmp.meta_click = false;
                }
                else {
                    hotkeyRecord_tmp.normal_click = false;
                }
            }

            // ⭐ 這是關鍵：更新虛擬鍵盤 highlight
            hotkeyHighlightUpdate();
        }

        function hotkeyHighlightUpdate() {
            // 先清除所有按鍵高亮
            document.querySelectorAll(".vk-key").forEach(k => k.classList.remove("active"));

            // 高亮 META keys
            if (hotkeyRecord_tmp.ctrl) {
                document.querySelectorAll(`.vk-key[data-code^="Control"]`).forEach(k => k.classList.add("active"));
            }
            if (hotkeyRecord_tmp.alt) {
                document.querySelectorAll(`.vk-key[data-code^="Alt"]`).forEach(k => k.classList.add("active"));
            }
            if (hotkeyRecord_tmp.shift) {
                document.querySelectorAll(`.vk-key[data-code^="Shift"]`).forEach(k => k.classList.add("active"));
            }
            if (hotkeyRecord_tmp.meta) {
                document.querySelectorAll(`.vk-key[data-code^="Meta"]`).forEach(k => k.classList.add("active"));
            }

            // 高亮一般鍵（只有一個）
            if (hotkeyRecord_tmp.code) {
                const normal = document.querySelector(`.vk-key[data-code="${hotkeyRecord_tmp.code}"]`);
                if (normal) normal.classList.add("active");
            }
        }

        function updateHotkeyTextbox() {
            let arr = [];
            if (hotkeyRecord_tmp.ctrl) arr.push("Ctrl");
            if (hotkeyRecord_tmp.alt) arr.push("Alt");
            if (hotkeyRecord_tmp.shift) arr.push("Shift");
            if (hotkeyRecord_tmp.meta) arr.push("Win");
            if (hotkeyRecord_tmp.key) arr.push(hotkeyRecord_tmp.key);

            hotkeyTargetBox.value = arr.join(" + ");
        }

        //==================================================================================虛擬鍵盤
        let keyboardWasOpenBeforeFullscreen = false;

        function isKeyboardOpen() {
            return kb.classList.contains("show");
        }

        function showVirtualKeyboard() {
            const wrapper = document.querySelector(".keyboard-wrapper");
            kb.classList.add("show");
            wrapper.classList.add("show");

            // 讓按鈕進入 active 狀態
            document.getElementById("toggleKeyboardBtn").classList.add("active");
            resizeVideo();

            if (hotkeyRecording) {
                document.getElementById("id_div_hotkeyBlock").style.display = "flex";
                document.getElementById("hotkeyConfirmBtn").style.display = "flex";
                document.getElementById("hotkeyCancelBtn").style.display = "flex";
                document.getElementById("virtualRemote").style.display = "none";

            } else {
                document.getElementById("id_div_hotkeyBlock").style.display = "none";
                document.getElementById("hotkeyConfirmBtn").style.display = "none";
                document.getElementById("hotkeyCancelBtn").style.display = "none";
                document.getElementById("virtualRemote").style.display = "flex";
            }
        }

        function hideVirtualKeyboard() {
            const wrapper = document.querySelector(".keyboard-wrapper");
            kb.classList.remove("show");
            wrapper.classList.remove("show");

            document.getElementById("toggleKeyboardBtn").classList.remove("active");
            resizeVideo();
        }

        document.getElementById("toggleKeyboardBtn").addEventListener("click", (e) => {
            if (kb.classList.contains("show")) {
                hideVirtualKeyboard();
            }
            else {
                showVirtualKeyboard();
                video.focus();
            }
        });

        let modifierState = {
            alt: false,
            ctrl: false,
            shift: false,
            meta: false
        };

        let activeKey = null;

        document.querySelectorAll(".vk-key").forEach(key => {
            key.addEventListener("mousedown", () => {
                activeKey = key;
                sendKeyEvent(key, "keydn");
            });
        });

        // 全域收尾
        document.addEventListener("mouseup", () => {
            if (activeKey) {
                sendKeyEvent(activeKey, "keyup");
                activeKey = null;
            }
        });

        const activeTouches = new Map();
        document.querySelectorAll(".vk-key").forEach(key => {
            key.addEventListener("touchstart", (e) => {
                e.preventDefault();
                for (let touch of e.changedTouches) {
                    activeTouches.set(touch.identifier, key);
                    key.classList.add("active");
                    sendKeyEvent(key, "keydn");
                }
            });
        });

        // 全域觸控放開
        document.addEventListener("touchend", (e) => {
            for (let touch of e.changedTouches) {
                const key = activeTouches.get(touch.identifier);
                if (key) {
                    key.classList.remove("active");
                    sendKeyEvent(key, "keyup");
                    activeTouches.delete(touch.identifier);
                }
            }
        });

        // （可選）處理 touchcancel，避免中斷後卡住
        document.addEventListener("touchcancel", (e) => {
            for (let touch of e.changedTouches) {
                const key = activeTouches.get(touch.identifier);
                if (key) {
                    key.classList.remove("active");
                    sendKeyEvent(key, "keyup");
                    activeTouches.delete(touch.identifier);
                }
            }
        });

        function sendKeyEvent(key, type) {
            const code = key.dataset.code;
            const keyLabel = key.textContent.trim();

            // 修飾鍵狀態管理
            if (type === "keydn") {
                if (code.startsWith("Alt")) modifierState.alt = true;
                if (code.startsWith("Control")) modifierState.ctrl = true;
                if (code.startsWith("Shift")) modifierState.shift = true;
                if (code.startsWith("Meta")) modifierState.meta = true;
            } else if (type === "keyup") {
                if (code.startsWith("Alt")) modifierState.alt = false;
                if (code.startsWith("Control")) modifierState.ctrl = false;
                if (code.startsWith("Shift")) modifierState.shift = false;
                if (code.startsWith("Meta")) modifierState.meta = false;
            }

            const payload = {
                key: keyLabel,
                code: code,
                altKey: modifierState.alt,
                ctrlKey: modifierState.ctrl,
                shiftKey: modifierState.shift,
                metaKey: modifierState.meta
            };

            sendKeyToHost(type, payload);
            //console.log("[VK]", type, payload);
        }

        function highlightVirtualKey(code, pressed) {
            const el = document.querySelector(`.vk-key[data-code="${code}"]`);
            if (!el) return;
            if (pressed) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        }

        /** 讓你在任何地方都能呼叫，保持全域 */
        window.updateLed = function (el, on) {
            if (!el) return;
            if (on) { el.classList.add('on'); }
            else { el.classList.remove('on'); }
        };

        window.setKeyboardLEDs = function (payload) {
            // 從裝置傳來的格式（aio_cdrom 發送）：
            // { event:"led", num:0/1, caps:0/1, scroll:0/1 }
            var num = !!(payload && payload.num);
            var caps = !!(payload && payload.caps);
            var scroll = !!(payload && payload.scroll);

            var elNum = document.getElementById('led-num');
            var elCaps = document.getElementById('led-caps');
            var elScroll = document.getElementById('led-scroll');

            // 錄製hotkey不需要LED
            if (hotkeyRecording) {
                updateLed(elNum, 0);
                updateLed(elCaps, 0);
                updateLed(elScroll, 0);
            }
            else {
                updateLed(elNum, num);
                updateLed(elCaps, caps);
                updateLed(elScroll, scroll);
            }
        };

        //==================================================================================虛擬遙控器
        document.querySelectorAll(".remote-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const usage = parseInt(btn.dataset.usage, 16);
                const msg = {
                    usage: usage
                };
                sendMediaKeyToHost(msg);

                setTimeout(() => {
                    const msgUp = {
                        usage: 0
                    };
                    sendMediaKeyToHost(msgUp);
                }, 30);
                //console.log("[Remote] mediakey", usage.toString(16));
            });
        });

        //==================================================================================聲音 mute
        document.getElementById("id_button_mute").addEventListener("click", (e) => {
            if (audioElem.muted) {
                audioElem.muted = false;
                document.querySelector("#id_span_mute img").src = "icon/unmute.png";
            }
            else {
                audioElem.muted = true;
                document.querySelector("#id_span_mute img").src = "icon/mute.png";
            }
        });

        //==================================================================================FPS render chart
        const el_span_fps = document.getElementById("id_span_fps");
        const ctx_fpsRender = document.getElementById('id_chart_fpsRender').getContext('2d');

        const fpsRenderChart = new Chart(ctx_fpsRender, {
            type: 'line',
            data: {
                labels: [],        // X 軸 (時間)
                datasets: [
                    {
                        label: 'Render FPS',
                        data: [],
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        fill: false,
                        borderWidth: 2,         // 線條粗細，預設是
                        pointRadius: 1,         // 預設點大小
                        pointHoverRadius: 4,    // 滑鼠移上去時放大
                        //pointBackgroundColor: 'red', // 點的顏色
                        pointBorderWidth: 1,    // 點邊框粗細
                        pointBorderColor: 'rgb(75, 192, 192)' // 點邊框顏色
                    },
                ]
            },
            options: {
                responsive: true,
                animation: false,
                plugins: {
                    legend: {
                        display: false,   // 改成 false 就完全不顯示圖例
                        position: 'top', // 改成 'right' 就靠右
                        align: 'end',      // 向右靠
                        labels: {
                            boxWidth: 0,  // 把小方框寬度設成 0 → 只顯示文字，沒有方框
                            usePointStyle: false
                        }
                    },
                },
                scales: {
                    x: {
                        ticks: { display: false }  // 不顯示時間刻度，保持簡潔
                    },
                    y: {
                        min: 0,          // 最小值固定 0
                        max: 90,         // 最大值固定 90
                        ticks: {
                            stepSize: 30 // 每格 30 → 就會是 0, 30, 60, 90
                        }
                    }
                }
            },
            //plugins: [fixedFpsLabelPlugin]
        });

        function updateRenderFPSChart(renderFPS) {
            const labels = fpsRenderChart.data.labels;
            if (labels.length >= 60) {
                labels.shift();
                fpsRenderChart.data.datasets.forEach(ds => ds.data.shift());
            }

            labels.push(new Date().toLocaleTimeString());
            fpsRenderChart.data.datasets[0].data.push(renderFPS);

            fpsRenderChart.update();
        }

        let lastPresentedFrames = 0;
        let lastRenderTime = performance.now();

        function onFrame(now, metadata) {
            const diff = now - lastRenderTime;

            if (diff >= 1000) {   // 每秒更新一次
                const deltaFrames = metadata.presentedFrames - lastPresentedFrames;
                let fps = (deltaFrames * 1000) / diff;

                // clamp 防呆
                if (fps < 0) fps = 0;
                if (fps > 80) fps = 80;

                updateRenderFPSChart(fps);
                el_span_fps.textContent = fps.toFixed(0) + "fps";

                // update internal state
                lastRenderTime = now;
                lastPresentedFrames = metadata.presentedFrames;
            }

            video.requestVideoFrameCallback(onFrame);
        }
        video.requestVideoFrameCallback(onFrame);

        //==================================================================================狀態指示
        video.addEventListener("mouseenter", () => {
            isMouseControl = true;

            if (!usb_connection) return;

            document.getElementById("id_span_mouse_status").classList.add("active");
            document.querySelector("#id_span_mouse_icon img").src = "icon/mouse_light.png";
        });

        video.addEventListener("mouseleave", () => {
            isMouseControl = false;

            document.getElementById("id_span_mouse_status").classList.remove("active");
            document.querySelector("#id_span_mouse_icon img").src = "icon/mouse_dark.png";
        });

        video.addEventListener("focus", () => {
            isKeyboardControl = true;

            if (!usb_connection) return;

            document.getElementById("id_span_keyboard_status").classList.add("active");
            document.querySelector("#id_span_keyboard_icon img").src = "icon/keyboard_light.png";
        });

        video.addEventListener("blur", () => {
            isKeyboardControl = false;

            document.getElementById("id_span_keyboard_status").classList.remove("active");
            document.querySelector("#id_span_keyboard_icon img").src = "icon/keyboard_dark.png";
        });

        kb.addEventListener("focus", () => {
            isKeyboardControl = true;

            if (!usb_connection) return;

            document.getElementById("id_span_keyboard_status").classList.add("active");
            document.querySelector("#id_span_keyboard_icon img").src = "icon/keyboard_light.png";
        });

        kb.addEventListener("blur", () => {
            isKeyboardControl = false;

            document.getElementById("id_span_keyboard_status").classList.remove("active");
            document.querySelector("#id_span_keyboard_icon img").src = "icon/keyboard_dark.png";
        });