'use client';
import { useEffect } from 'react';
import AuthButton from '@/components/AuthButton';

export default function Home() {
  
  useEffect(() => {

        (function() {
          const cursor = document.getElementById('cursor');
          const ring = document.getElementById('cursor-ring');
          
          if (!cursor || !ring) return;

          let mouseX = 0, mouseY = 0;

          window.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            ring.style.left = mouseX + 'px';
            ring.style.top = mouseY + 'px';
          }, { passive: true });

          window.addEventListener('mousedown', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
          });

          window.addEventListener('mouseup', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
          });
        })();
      

        (window as any).appState = {aqi: 0, pm25: 0, temp: 0, humidity: 0, wind: 0, o2: 100, city: 'Detecting...', country: 'India', lat: 12.2958, lon: 76.6394, timestamp: new Date()};
        
        // CANVAS RENDERING FUNCTIONS
        function drawRadar(canvasId, color = '#00e5ff') {
          const canvas = document.getElementById(canvasId);
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2;
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = color + '40'; ctx.lineWidth = 1;
          for (let r = 20; r < Math.max(w,h)/2; r += 20) {
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
            ctx.stroke();
          }
          for (let a = 0; a < 8; a++) {
            const ang = (a / 8) * Math.PI * 2;
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(ang) * (w/2-10), cy + Math.sin(ang) * (h/2-10));
            ctx.stroke();
          }
          ctx.fillStyle = color + '60'; ctx.beginPath();
          ctx.arc(cx, cy, 15, 0, Math.PI*2);
          ctx.fill();
        }

        function drawWaveform(canvasId, aqi = 50) {
          const canvas = document.getElementById(canvasId);
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          const w = canvas.width, h = canvas.height;
          ctx.clearRect(0, 0, w, h);
          const color = aqi > 150 ? '#ff1744' : aqi > 100 ? '#ff9100' : aqi > 50 ? '#00e5ff' : '#39ff14';
          ctx.strokeStyle = color; ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < w; i++) {
            const t = (i / w) * Math.PI * 4 + (Date.now() / 500);
            const y = h/2 + Math.sin(t) * (h/3) * (aqi/100);
            if (i === 0) ctx.moveTo(i, y);
            else ctx.lineTo(i, y);
          }
          ctx.stroke();
        }

        function drawChart(canvasId, data = [], color = '#00e5ff') {
          const canvas = document.getElementById(canvasId);
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          const w = canvas.width, h = canvas.height;
          ctx.clearRect(0, 0, w, h);
          if (data.length === 0) return;
          const max = Math.max(...data);
          ctx.strokeStyle = color; ctx.lineWidth = 2;
          ctx.beginPath();
          const step = w / (data.length - 1);
          data.forEach((val, i) => {
            const x = i * step;
            const y = h - (val / max) * (h - 20);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
          ctx.fillStyle = color + '20'; ctx.fill();
        }

        // API DATA BINDING
        async function fetchEnvironmentalData() {
          try {
            const response = await fetch(`/api/aqi?lat=${window.appState.lat}&lon=${window.appState.lon}`);
            if (!response.ok) throw new Error('API failed');
            const data = await response.json();
            window.appState.aqi = data.aqi || 50;
            window.appState.pm25 = data.pm25 || 25;
            window.appState.temp = data.temp || 28;
            window.appState.humidity = data.humidity || 65;
            window.appState.wind = data.wind || 12;
            window.appState.city = data.city || 'Unknown';
          } catch (e) {
            console.warn('Using mock data:', e);
            window.appState.aqi = Math.floor(Math.random() * 200);
            window.appState.pm25 = Math.floor(Math.random() * 50);
            window.appState.temp = 25 + Math.random() * 10;
            window.appState.humidity = 40 + Math.random() * 50;
            window.appState.wind = 5 + Math.random() * 20;
          }
          updateUIWithData();
          if (typeof (window as any).evaluateAlerts === 'function') {
            (window as any).evaluateAlerts(window.appState);
          }
        }

        const lastEmailSent: any = { warning: 0, danger: 0, critical: 0 };
        const EMAIL_COOLDOWN: any = { warning: 3600000, danger: 1800000, critical: 900000 };

        async function sendAlertEmail(level: string, alerts: any[], data: any) {
          try {
            const sessionRes = await fetch('/api/auth/session');
            if (!sessionRes.ok) return;
            const session = await sessionRes.json();
            if (!session?.user?.email) return;

            const now = Date.now();
            const cooldown = EMAIL_COOLDOWN[level] || EMAIL_COOLDOWN.warning;
            if (now - lastEmailSent[level] < cooldown) {
              console.log(`Email cooldown active for level: ${level}`);
              return;
            }
            lastEmailSent[level] = now;

            await fetch('/api/send-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: session.user.email,
                name: session.user.name,
                city: data.city || 'Unknown',
                level,
                aqi: data.aqi,
                pm25: data.pm25,
                co2: data.co2 || 400,
                o2: data.o2 || 21,
                alerts,
                timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })
              })
            });
            console.log(`✅ Alert email sent to ${session.user.email}`);
          } catch(e) {
            console.error('Email send failed:', e);
          }
        }

        (window as any).evaluateAlerts = function(data: any) {
          let level = 'good';
          const alerts = [];
          if (data.aqi > 150) { level = 'critical'; alerts.push({ metric: 'AQI', value: data.aqi, msg: 'Very Unhealthy' }); }
          else if (data.aqi > 100) { level = 'danger'; alerts.push({ metric: 'AQI', value: data.aqi, msg: 'Unhealthy' }); }
          else if (data.aqi > 50) { level = 'warning'; alerts.push({ metric: 'AQI', value: data.aqi, msg: 'Moderate' }); }
          
          if (level !== 'good') {
            sendAlertEmail(level, alerts, data);
            if (typeof (window as any).showToastAlert === 'function') (window as any).showToastAlert(level, alerts, data.city);
            if (typeof (window as any).startAlarm === 'function') (window as any).startAlarm(level);
          } else {
            if (typeof (window as any).dismissToast === 'function') (window as any).dismissToast();
            if (typeof (window as any).stopAlarm === 'function') (window as any).stopAlarm();
          }
        };

        function updateUIWithData() {
          document.getElementById('nav-city').textContent = window.appState.city;
          document.getElementById('nav-aqi').textContent = Math.round(window.appState.aqi);
          document.getElementById('m-aqi').textContent = Math.round(window.appState.aqi);
          document.getElementById('m-pm25').textContent = Math.round(window.appState.pm25);
          document.getElementById('m-temp').textContent = Math.round(window.appState.temp);
          document.getElementById('m-humidity').textContent = Math.round(window.appState.humidity);
          document.getElementById('m-wind').textContent = Math.round(window.appState.wind);
          document.getElementById('m-o2').textContent = '98';
          
          document.getElementById('tc-v-aqi').textContent = Math.round(window.appState.aqi);
          document.getElementById('tc-v-pm25').textContent = Math.round(window.appState.pm25);
          document.getElementById('tc-v-humidity').textContent = Math.round(window.appState.humidity);
          document.getElementById('tc-v-temp').textContent = Math.round(window.appState.temp);
          document.getElementById('tc-v-wind').textContent = Math.round(window.appState.wind);
          document.getElementById('tc-v-o2').textContent = '98';
          
          document.getElementById('bar-aqi').style.width = Math.min(100, (window.appState.aqi/300)*100) + '%';
          document.getElementById('bar-pm25').style.width = Math.min(100, (window.appState.pm25/100)*100) + '%';
          document.getElementById('bar-temp').style.width = Math.min(100, (window.appState.temp/50)*100) + '%';
          document.getElementById('bar-humidity').style.width = window.appState.humidity + '%';
          document.getElementById('bar-wind').style.width = Math.min(100, (window.appState.wind/40)*100) + '%';
          document.getElementById('bar-o2').style.width = '98%';
          
          // Animate bar charts in telemetry cards
          const animateBarChart = (containerId, percent) => {
            const container = document.getElementById(containerId);
            if (container) {
              const items = container.querySelectorAll('.tc-bar-item');
              items.forEach((item, idx) => {
                const h = Math.random() * 100;
                item.style.height = h + '%';
              });
            }
          };
          animateBarChart('tc-bars-aqi', window.appState.aqi);
          animateBarChart('tc-bars-pm25', window.appState.pm25);
          animateBarChart('tc-bars-humidity', window.appState.humidity);
          animateBarChart('tc-bars-temp', window.appState.temp);
          animateBarChart('tc-bars-wind', window.appState.wind);
          animateBarChart('tc-bars-o2', 98);
          
          drawRadar('radar-canvas', window.appState.aqi > 150 ? '#ff1744' : window.appState.aqi > 100 ? '#ff9100' : '#00e5ff');
          drawRadar('big-radar', window.appState.aqi > 150 ? '#ff1744' : window.appState.aqi > 100 ? '#ff9100' : '#00e5ff');
          drawWaveform('waveform-canvas', window.appState.aqi);
          drawChart('chart-aqi', [window.appState.aqi * 0.8, window.appState.aqi, window.appState.aqi * 0.9, window.appState.aqi * 0.7], '#00e5ff');
          drawChart('chart-co2', [420, 435, 430, 445], '#39ff14');
          drawChart('chart-noise', [55, 65, 60, 70], '#ff9100');
          drawChart('forecast-canvas', [window.appState.aqi * 0.95, window.appState.aqi, window.appState.aqi * 1.05, window.appState.aqi * 0.98], '#00e5ff');
          
          const forecastAqi = Math.round(window.appState.aqi * 0.98);
          document.getElementById('fd-forecast').textContent = forecastAqi;
          document.getElementById('rs-freq').textContent = (1.0 + Math.random()).toFixed(1);
          document.getElementById('rs-amp').textContent = (-45 - Math.random() * 10).toFixed(0);
        }

        // GEOLOCATION
        function requestGeolocation() {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                window.appState.lat = pos.coords.latitude;
                window.appState.lon = pos.coords.longitude;
                document.getElementById('map-coords').textContent = `COORDINATES: ${window.appState.lat.toFixed(2)}°, ${window.appState.lon.toFixed(2)}°`;
                fetchEnvironmentalData();
              },
              (err) => {
                console.warn('Geolocation error, using defaults');
                fetchEnvironmentalData();
              },
              { timeout: 8000 }
            );
          } else {
            fetchEnvironmentalData();
          }
        }

        // MICROPHONE WAVEFORM
        async function requestMicrophoneAccess() {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            function animate() {
              analyser.getByteFrequencyData(dataArray);
              drawWaveform('waveform-canvas', window.appState.aqi);
              requestAnimationFrame(animate);
            }
            animate();
          } catch (e) {
            console.warn('Microphone access denied or unavailable');
          }
        }

        function updateSystemClock() {
          const now = new Date().toLocaleTimeString();
          const sysTime = document.getElementById('sys-time');
          const navTime = document.getElementById('nav-time');
          if (sysTime) sysTime.textContent = now;
          if (navTime) navTime.textContent = now;
          setTimeout(updateSystemClock, 1000);
        }

        async function initializeSystem() {
          // 1. Hide landing page, show dashboard
          const landing = document.getElementById('landing-page');
          const dashboard = document.getElementById('dashboard');
          
          if (!landing || !dashboard) {
            console.error('landing or dashboard element not found');
            return;
          }

          landing.style.display = 'none';
          dashboard.style.display = 'block';
          dashboard.classList.remove('hidden');
          dashboard.classList.add('fade-in');

          // 2. Request geolocation
          try {
            const pos = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 8000,
                enableHighAccuracy: true
              });
            });
            window.appState.lat = pos.coords.latitude;
            window.appState.lon = pos.coords.longitude;
            document.getElementById('map-coords').textContent = `COORDINATES: ${window.appState.lat.toFixed(2)}°, ${window.appState.lon.toFixed(2)}°`;
          } catch (e) {
            // Fallback to Mysuru
            window.appState.lat = 12.2958;
            window.appState.lon = 76.6394;
            document.getElementById('map-coords').textContent = 'COORDINATES: 12.30°, 76.64°';
            console.log('Geolocation denied, using fallback');
          }

          // 3. Request microphone
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            function animate() {
              analyser.getByteFrequencyData(dataArray);
              drawWaveform('waveform-canvas', window.appState.aqi);
              requestAnimationFrame(animate);
            }
            animate();
          } catch (e) {
            console.log('Mic denied, using mock waveform');
          }

          // 4. Fetch data and init everything
          await fetchEnvironmentalData();
          updateSystemClock();
          drawRadar('radar-canvas', '#00e5ff');
          drawRadar('big-radar', '#00e5ff');
          drawChart('chart-aqi', [window.appState.aqi * 0.8, window.appState.aqi, window.appState.aqi * 0.9], '#00e5ff');
          drawChart('chart-co2', [420, 435, 430, 445], '#39ff14');
          drawChart('chart-noise', [55, 65, 60, 70], '#ff9100');
          drawChart('forecast-canvas', [window.appState.aqi * 0.95, window.appState.aqi, window.appState.aqi * 1.05], '#00e5ff');

          // 5. Start refresh loop
          setInterval(fetchEnvironmentalData, 60000);
        }
        
        window.initializeSystem = initializeSystem;

        window.sendToAria = async function() {
          const input = document.getElementById('aria-input');
          const msg = input.value.trim();
          if (!msg) return;
          const chatDiv = document.getElementById('aria-chat');
          const userDiv = document.createElement('div');
          userDiv.className = 'aria-msg aria-msg-user';
          userDiv.innerHTML = `<div class="aria-bubble user-bubble"><div class="aria-text">${msg}</div></div><div class="aria-avatar user-av">U</div>`;
          chatDiv.appendChild(userDiv);
          input.value = '';
          chatDiv.scrollTop = chatDiv.scrollHeight;
          try {
            const response = await fetch('/api/gemini', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({messages: [{role: 'user', parts: [{text: msg}]}]})});
            const data = await response.json();
            const reply = data.reply || 'Signal lost';
            const aiDiv = document.createElement('div');
            aiDiv.className = 'aria-msg aria-msg-ai';
            aiDiv.innerHTML = `<div class="aria-avatar">◈</div><div class="aria-bubble"><div class="aria-sender">ARIA</div><div class="aria-text">${reply}</div></div>`;
            chatDiv.appendChild(aiDiv);
            chatDiv.scrollTop = chatDiv.scrollHeight;
          } catch(e) {
            console.error('ARIA error:', e);
          }
        };

        window.quickAsk = function(msg) {
          document.getElementById('aria-input').value = msg;
          (window as any).sendToAria?.();
        };

        // Setup button click handler
        function setupButtonHandler() {
          const btn = document.getElementById('enter-btn');
          if (btn) {
            btn.addEventListener('click', function(e) {
              e.preventDefault();
              if (typeof window.initializeSystem === 'function') {
                window.initializeSystem();
              }
            });
          }
        }

        // Try to setup immediately
        setupButtonHandler();
        
        // Also try after a small delay
        setTimeout(setupButtonHandler, 100);
        setTimeout(setupButtonHandler, 500);

        updateSystemClock();
      
  }, []);

  return (
    <>
      <style jsx global>{`
        .landing {
          height: 100vh; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
          align-items: center; position: relative; overflow: visible;
        }
        
        #dashboard {
          overflow: visible;
        }
        .grid-overlay {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
        }
        .landing-topbar {
          position: absolute; top: 0; left: 0; right: 0; height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; border-bottom: 1px solid var(--border);
          font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); letter-spacing: 3px;
        }
        .logo-mark { font-size: 1.2rem; color: var(--teal); text-shadow: var(--teal-glow); }
        .sys-time { color: var(--teal); }
        .breath-rings {
          position: relative; width: 200px; height: 200px; margin-bottom: 60px;
          display: flex; align-items: center; justify-content: center;
        }
        .ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(0,229,255,0.3); animation: ring-breathe 3s ease-in-out infinite;
        }
        .ring-1 { width: 200px; height: 200px; }
        .ring-2 { width: 150px; height: 150px; animation-delay: 0.5s; border-color: rgba(0,229,255,0.5); }
        .ring-3 { width: 100px; height: 100px; animation-delay: 1s; border-color: rgba(0,229,255,0.7); }
        @keyframes ring-breathe {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }
        .ring-core {
          font-size: 2rem; color: var(--teal); text-shadow: var(--teal-glow); z-index: 1;
          animation: core-pulse 2s ease-in-out infinite;
        }
        @keyframes core-pulse {
          0%, 100% { text-shadow: 0 0 20px rgba(0,229,255,0.5); }
          50% { text-shadow: 0 0 60px rgba(0,229,255,1), 0 0 100px rgba(0,229,255,0.5); }
        }
        .landing-text { text-align: center; }
        .landing-eyebrow {
          font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 8px;
          color: var(--teal); margin-bottom: 16px; opacity: 0.7;
        }
        .landing-title {
          font-family: var(--font-display); font-size: clamp(4rem, 10vw, 8rem);
          font-weight: 900; letter-spacing: 12px; color: var(--text-bright);
          line-height: 1; margin-bottom: 24px;
        }
        .title-accent { color: var(--teal); text-shadow: var(--teal-glow); }
        .landing-sub {
          font-family: var(--font-body); font-size: 1.1rem; color: var(--text-mid);
          line-height: 1.8; margin-bottom: 40px; font-weight: 300;
        }
        .status-pills { display: flex; gap: 12px; justify-content: center; margin-bottom: 48px; }
        .pill {
          display: flex; align-items: center; gap: 8px; padding: 6px 16px;
          border: 1px solid var(--border); border-radius: 20px; font-family: var(--font-mono);
          font-size: 0.6rem; letter-spacing: 2px; color: var(--text-dim); background: var(--glass);
        }
        .pill-dot {
          width: 6px; height: 6px; background: var(--teal); border-radius: 50%; animation: pulse 1.5s infinite;
        }
        .pill-dot.amber { background: var(--amber); }
        .enter-btn {
          position: relative; display: inline-flex; align-items: center; gap: 16px;
          padding: 18px 48px; background: transparent; border: 1px solid var(--teal); border-radius: 4px;
          color: var(--teal); font-family: var(--font-display); font-size: 0.85rem;
          font-weight: 700; letter-spacing: 6px; cursor: none;
          transition: all 0.3s; margin-bottom: 20px;
        }
        .enter-btn:hover { background: var(--teal-dim); box-shadow: var(--teal-glow); transform: translateY(-2px); }
        .btn-scan {
          position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,229,255,0.1), transparent);
          animation: btn-scan 2s linear infinite;
        }
        @keyframes btn-scan { to { left: 100%; } }
        .landing-disclaimer { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); letter-spacing: 2px; }
        .landing-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 40px;
          display: flex; align-items: center; justify-content: center; gap: 40px;
          border-top: 1px solid var(--border); font-family: var(--font-mono); font-size: 0.55rem;
          color: var(--text-dim); letter-spacing: 3px;
        }

        .dashboard { width: 100%; }
        .navbar {
          position: sticky; top: 0; z-index: 100; display: flex; align-items: center;
          justify-content: space-between; padding: 0 40px; height: 60px;
          border-radius: 0; border-left: none; border-right: none; border-top: none;
        }
        .nav-logo {
          font-family: var(--font-display); font-size: 0.9rem; font-weight: 700;
          letter-spacing: 4px; color: var(--teal);
        }
        .nav-live {
          display: flex; align-items: center; gap: 6px; font-family: var(--font-mono);
          font-size: 0.6rem; color: var(--bio); letter-spacing: 3px; margin-left: 20px;
        }
        .live-dot { width: 6px; height: 6px; background: var(--bio); border-radius: 50%; animation: pulse 1s infinite; }
        .nav-left, .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-center { display: flex; align-items: center; gap: 20px; }
        .nav-stat { text-align: center; }
        .nav-label { display: block; font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 3px; color: var(--text-dim); }
        .nav-value { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-bright); }
        .nav-divider { width: 1px; height: 24px; background: var(--border); }
        .nav-aqi-badge { text-align: center; padding: 4px 16px; border: 1px solid var(--border); border-radius: 4px; }
        .nav-aqi-val { font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; color: var(--teal); }

        .s-map { position: relative; height: 100vh; padding: 0; }
        .map-container { width: 100%; height: 100%; position: absolute; inset: 0; background: linear-gradient(135deg, #010c14 0%, #041220 100%); }
        .map-panel {
          position: absolute; top: 80px; width: 300px; z-index: 10;
        }
        .map-panel-left { left: 24px; }
        .map-panel-right { right: 24px; }
        .panel-header {
          display: flex; align-items: center; gap: 8px; font-family: var(--font-mono);
          font-size: 0.6rem; letter-spacing: 3px; color: var(--teal); padding: 16px 20px 12px;
          border-bottom: 1px solid var(--border);
        }
        .panel-dot { width: 6px; height: 6px; background: var(--teal); border-radius: 50%; animation: pulse 1.5s infinite; }
        .env-metrics { padding: 12px 20px 20px; display: flex; flex-direction: column; gap: 14px; }
        .env-label { font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 2px; color: var(--text-dim); margin-bottom: 4px; }
        .env-val-wrap { display: flex; align-items: baseline; gap: 6px; margin-bottom: 6px; }
        .env-val { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; color: var(--teal); }
        .env-unit { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); }
        .env-bar-track { height: 2px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
        .env-bar { height: 100%; background: var(--teal); border-radius: 2px; width: 0%; transition: width 1.5s ease; box-shadow: 0 0 8px var(--teal); }
        .anomaly-list { padding: 0 20px; }
        .anomaly-label { font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 3px; color: var(--text-dim); margin-bottom: 8px; }
        .anomaly-item { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-family: var(--font-mono); font-size: 0.7rem; }
        .an-id { color: var(--teal); }
        .an-level { padding: 2px 8px; border-radius: 2px; font-size: 0.55rem; letter-spacing: 2px; }
        .an-level.low { color: var(--bio); border: 1px solid rgba(57,255,20,0.3); }
        .an-level.elevated { color: var(--amber); border: 1px solid rgba(255,145,0,0.3); }
        .neural-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px 20px; }
        .ns-item { text-align: center; }
        .ns-label { font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-dim); letter-spacing: 2px; }
        .ns-val { font-family: var(--font-display); font-size: 1.1rem; color: var(--text-bright); }
        .ns-val.teal { color: var(--teal); }
        .scan-btn {
          display: block; width: calc(100% - 40px); margin: 12px 20px 20px;
          padding: 10px; background: var(--teal-dim); border: 1px solid var(--teal);
          border-radius: 4px; color: var(--teal); font-family: var(--font-display);
          font-size: 0.6rem; letter-spacing: 3px; cursor: none; transition: all 0.3s;
        }
        .scan-btn:hover { background: rgba(0,229,255,0.2); box-shadow: var(--teal-glow); }
        .map-bottom-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 44px;
          background: rgba(4,18,32,0.9); border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; gap: 40px;
          font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 3px;
          color: var(--text-dim); z-index: 10;
        }
        .risk-badge { padding: 2px 12px; border: 1px solid var(--border); border-radius: 2px; color: var(--teal); }

        .telemetry-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .tele-card { padding: 32px; position: relative; overflow: hidden; transition: transform 0.3s; }
        .tele-card:hover { transform: translateY(-4px); }
        .tc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .tc-name { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 3px; color: var(--teal); }
        .tc-tag { font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 2px; color: var(--text-dim); text-align: right; }
        .tc-value { font-family: var(--font-display); font-size: 3.5rem; font-weight: 900; color: var(--text-bright); line-height: 1; margin-bottom: 4px; animation: number-glow 3s infinite; }
        @keyframes number-glow { 0%,100% { text-shadow: none; } 50% { text-shadow: 0 0 30px rgba(0,229,255,0.3); } }
        .tc-unit { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 3px; color: var(--text-dim); margin-bottom: 24px; }
        .tc-bars { display: flex; gap: 4px; align-items: flex-end; height: 50px; margin-bottom: 16px; }
        .tc-bar-item { flex: 1; background: var(--teal-dim); border-radius: 2px; transition: height 0.5s ease; box-shadow: 0 0 4px rgba(0,229,255,0.2); }
        .tc-footer { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 2px; color: var(--text-dim); }
        .tc-delta { color: var(--bio); }

        .resonance-wrap { padding: 40px; position: relative; }
        .resonance-stats { display: flex; align-items: center; gap: 0; }
        .rs-item { flex: 1; text-align: center; }
        .rs-divider { width: 1px; height: 40px; background: var(--border); }
        .rs-label { display: block; font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 3px; color: var(--text-dim); margin-bottom: 6px; }
        .rs-val { font-family: var(--font-display); font-size: 1.1rem; color: var(--text-bright); }
        .rs-val.teal { color: var(--teal); }
        .rs-unit { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); margin-left: 4px; }

        .trends-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; }
        .trend-card { padding: 24px; }
        .tc-label { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 3px; color: var(--teal); margin-bottom: 16px; }
        .summary-strip { display: flex; align-items: center; padding: 24px 40px; }
        .sum-item { flex: 1; text-align: center; }
        .sum-divider { width: 1px; height: 40px; background: var(--border); }
        .sum-label { font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 3px; color: var(--text-dim); margin-bottom: 8px; display: block; }
        .sum-val { font-family: var(--font-display); font-size: 1.4rem; color: var(--text-bright); }
        .sum-val.teal { color: var(--teal); }

        .tactical-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .tac-panel { padding: 28px; }
        .anomaly-full-list { margin-top: 16px; }
        .afl-header { font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 3px; color: var(--text-dim); margin-bottom: 12px; }
        .afl-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-mid); }
        .neural-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
        .ng-item { background: rgba(0,229,255,0.03); border: 1px solid var(--border); border-radius: 8px; padding: 12px; text-align: center; }
        .ng-label { font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 2px; color: var(--text-dim); margin-bottom: 6px; }
        .ng-val { font-family: var(--font-display); font-size: 1.2rem; color: var(--text-bright); }
        .ng-val.teal { color: var(--teal); }
        .ng-val.amber { color: var(--amber); }
        .ng-val.bio { color: var(--bio); }
        .sync-progress { margin-bottom: 16px; }
        .sync-label { font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 3px; color: var(--text-dim); margin-bottom: 6px; display: flex; justify-content: space-between; }
        .sync-bar-track { height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
        .sync-bar { height: 100%; background: var(--teal); width: 0%; transition: width 0.5s; box-shadow: 0 0 8px var(--teal); }
        .scan-btn.large { width: 100%; margin: 0; padding: 14px; font-size: 0.7rem; }

        .forecast-hero { padding: 40px; margin-bottom: 20px; }
        .forecast-labels { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 3px; color: var(--text-dim); margin-bottom: 20px; }
        .fc-badge { color: var(--bio); }
        .forecast-result { text-align: center; }
        .fr-trend { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--teal); letter-spacing: 4px; }
        .fr-sub { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); letter-spacing: 2px; margin-top: 6px; }
        .forecast-detail-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .fd-card { padding: 32px; text-align: center; }
        .fd-label { font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 3px; color: var(--text-dim); margin-bottom: 12px; }
        .fd-val { font-family: var(--font-display); font-size: 2.5rem; font-weight: 900; color: var(--text-bright); }
        .fd-val.bio { color: var(--bio); }
        .fd-unit { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); }
        .fd-sub { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); margin-top: 8px; }
        .activity-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-mid); }
        .act-safe { padding: 2px 10px; border-radius: 2px; font-size: 0.6rem; letter-spacing: 2px; }
        .act-safe.bio { color: var(--bio); border: 1px solid rgba(57,255,20,0.3); }

        .s-aria { background: linear-gradient(180deg, transparent, rgba(0,229,255,0.02), transparent); }
        .aria-wrap { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 0; }
        .aria-chat { height: 480px; overflow-y: auto; padding: 32px; display: flex; flex-direction: column; gap: 20px; border-radius: 12px 12px 0 0; border-bottom: none; }
        .aria-msg { display: flex; gap: 16px; align-items: flex-start; }
        .aria-msg-user { flex-direction: row-reverse; }
        .aria-avatar {
          width: 36px; height: 36px; background: var(--teal-dim); border: 1px solid var(--border-active);
          border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
          color: var(--teal); flex-shrink: 0; font-family: var(--font-display);
        }
        .user-av { background: rgba(57,255,20,0.1); border-color: rgba(57,255,20,0.3); color: var(--bio); font-family: var(--font-mono); font-size: 0.55rem; }
        .aria-bubble {
          max-width: 70%; background: rgba(0,229,255,0.04); border: 1px solid var(--border);
          border-radius: 4px 12px 12px 12px; padding: 14px 18px;
        }
        .user-bubble { background: rgba(57,255,20,0.04); border-color: rgba(57,255,20,0.15); border-radius: 12px 4px 12px 12px; }
        .aria-sender { font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 3px; color: var(--teal); margin-bottom: 8px; }
        .aria-text { font-family: var(--font-body); font-size: 0.95rem; line-height: 1.7; color: var(--text-bright); }
        .aria-input-wrap { display: flex; align-items: center; gap: 0; border-radius: 0; border-top: none; border-bottom: none; padding: 0; overflow: hidden; }
        .aria-input-left { flex: 1; display: flex; align-items: center; gap: 16px; padding: 16px 20px; }
        .aria-icon { color: var(--teal); font-size: 1.1rem; flex-shrink: 0; }
        .aria-input { flex: 1; background: none; border: none; outline: none; color: var(--text-bright); font-family: var(--font-body); font-size: 1rem; caret-color: var(--teal); }
        .aria-input::placeholder { color: var(--text-dim); }
        .aria-send-btn { display: flex; align-items: center; gap: 10px; padding: 20px 32px; background: var(--teal-dim); border: none; border-left: 1px solid var(--border); color: var(--teal); font-family: var(--font-display); font-size: 0.7rem; letter-spacing: 4px; cursor: none; transition: background 0.3s; }
        .aria-send-btn:hover { background: rgba(0,229,255,0.2); }
        .aria-quick-btns { display: flex; gap: 8px; flex-wrap: wrap; padding: 12px 20px; background: var(--glass); border: 1px solid var(--border); border-top: none; border-radius: 0 0 12px 12px; }
        .aria-quick { padding: 6px 16px; background: var(--glass); border: 1px solid var(--border); border-radius: 20px; color: var(--text-mid); font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 1px; cursor: none; transition: all 0.2s; }
        .aria-quick:hover { border-color: var(--teal); color: var(--teal); background: var(--teal-dim); }

        .site-footer { padding: 60px; margin: 0; border-radius: 0; border: none; border-top: 1px solid var(--border); }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 60px; margin-bottom: 40px; }
        .footer-logo { font-family: var(--font-display); font-size: 1.2rem; letter-spacing: 4px; color: var(--teal); margin-bottom: 8px; }
        .footer-tagline { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 3px; color: var(--text-dim); }
        .footer-heading { font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 4px; color: var(--teal); margin-bottom: 16px; }
        .footer-item { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .f-dot { width: 4px; height: 4px; background: var(--bio); border-radius: 50%; flex-shrink: 0; animation: pulse 2s infinite; }
        .f-dot.amber { background: var(--amber); }
        .footer-bar { border-top: 1px solid var(--border); padding-top: 24px; text-align: center; font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 4px; color: var(--text-dim); }

        @media (max-width: 1100px) {
          .telemetry-grid { grid-template-columns: repeat(2, 1fr); }
          .tactical-grid { grid-template-columns: 1fr 1fr; }
          .forecast-detail-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          section { padding: 80px 24px; }
          .telemetry-grid { grid-template-columns: 1fr; }
          .trends-grid { grid-template-columns: 1fr; }
          .tactical-grid { grid-template-columns: 1fr; }
          .forecast-detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      

      <div id="landing-page" className="landing">
        <div className="grid-overlay"></div>
        <div className="landing-topbar">
          <div className="logo-mark">◈</div>
          <div>ENVIRONMENTAL INTELLIGENCE NETWORK v3.1</div>
          <div className="sys-time" id="sys-time">--:--:--</div>
        </div>
        <div className="landing-text">
          <div className="breath-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
            <div className="ring-core">◈</div>
          </div>
          <div className="landing-eyebrow">REAL-TIME AIR INTELLIGENCE</div>
          <h1 className="landing-title">BREATH<span className="title-accent">MAP</span></h1>
          <p className="landing-sub">AI-powered atmospheric monitoring.<br />Know what you breathe. Know before you feel it.</p>
          <div className="status-pills">
            <div className="pill"><span className="pill-dot"></span>SATELLITE LINK ACTIVE</div>
            <div className="pill"><span className="pill-dot"></span>AI CORE ONLINE</div>
            <div className="pill"><span className="pill-dot amber"></span>AWAITING LOCATION</div>
          </div>
          <button id="enter-btn" style={{position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '16px', padding: '18px 48px', background: 'transparent', border: '1px solid var(--teal)', borderRadius: '4px', color: 'var(--teal)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '6px', cursor: 'none', transition: 'all 0.3s', marginBottom: '20px'}} onClick={(e) => { e.preventDefault(); const w = window as unknown as { initializeSystem?: () => void }; if (typeof w.initializeSystem === "function") w.initializeSystem(); }} onMouseDown={() => console.log('Button clicked')}>
            <span>INITIALIZE SYSTEM</span>
            <span>→</span>
            <div className="btn-scan"></div>
          </button>
          <div className="landing-disclaimer">Requires location access for accurate atmospheric readings</div>
          <div className="landing-login-notice">
            <span className="lln-icon">🛡️</span>
            <span className="lln-text">
              <strong>CRITICAL ALERTS:</strong> You must Login with Google inside the Command Center
              to receive automated Gmail warnings when air quality drops to dangerous levels.
            </span>
          </div>
        </div>
        <div className="landing-bottom">
          <span>DATA SOURCE: SENTINEL-5P + OPENWEATHERMAP</span>
          <span>NEURAL MODEL: V9.2</span>
          <span>NODES ONLINE: 1,402</span>
          <span>UPTIME: 99.97%</span>
        </div>
      </div>

      <div id="dashboard" className="dashboard hidden">
        <nav className="navbar glass">
          <div className="nav-left"><span className="nav-logo">◈ BREATHMAP</span><div className="nav-live"><span className="live-dot"></span><span>LIVE</span></div></div>
          <div className="nav-center">
            <div className="nav-stat"><span className="nav-label">LOCATION</span><span className="nav-value" id="nav-city">DETECTING...</span></div>
            <div className="nav-divider"></div>
            <div className="nav-stat"><span className="nav-label">LAST SYNC</span><span className="nav-value" id="nav-time">--:--:--</span></div>
          </div>
          <div className="nav-right">
            <AuthButton />
            <div className="nav-aqi-badge"><span className="nav-label">AQI</span><span className="nav-aqi-val" id="nav-aqi">--</span></div>
          </div>
        </nav>

        <section className="s-map">
          <div style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '5px', color: 'var(--text-dim)', marginBottom: '20px', position: 'absolute', top: '80px', left: '60px', zIndex: 10}}>01 / ATMOSPHERIC FIELD</div>
          <div id="map" className="map-container"></div>
          <div className="map-panel map-panel-left glass" style={{position: 'absolute', top: '80px', left: '24px', width: '320px', maxHeight: '60vh', overflowY: 'auto', zIndex: 10}}>
            <div className="panel-header"><span className="panel-dot"></span>ENVIRONMENT MATRIX</div>
            <div className="env-metrics">
              <div><div className="env-label">AIR QUALITY INDEX</div><div className="env-val-wrap"><span className="env-val" id="m-aqi">--</span><span className="env-unit">AQI</span></div><div className="env-bar-track"><div className="env-bar" id="bar-aqi"></div></div></div>
              <div><div className="env-label">PARTICULATE PM2.5</div><div className="env-val-wrap"><span className="env-val" id="m-pm25">--</span><span className="env-unit">µg/m³</span></div><div className="env-bar-track"><div className="env-bar" id="bar-pm25" style={{background: 'var(--bio)'}}></div></div></div>
              <div><div className="env-label">TEMPERATURE</div><div className="env-val-wrap"><span className="env-val" id="m-temp">--</span><span className="env-unit">°C</span></div><div className="env-bar-track"><div className="env-bar" id="bar-temp" style={{background: 'var(--amber)'}}></div></div></div>
              <div><div className="env-label">RELATIVE HUMIDITY</div><div className="env-val-wrap"><span className="env-val" id="m-humidity">--</span><span className="env-unit">%</span></div><div className="env-bar-track"><div className="env-bar" id="bar-humidity"></div></div></div>
              <div><div className="env-label">WIND VELOCITY</div><div className="env-val-wrap"><span className="env-val" id="m-wind">--</span><span className="env-unit">km/h</span></div><div className="env-bar-track"><div className="env-bar" id="bar-wind"></div></div></div>
              <div><div className="env-label">OXYGEN PURITY</div><div className="env-val-wrap"><span className="env-val" id="m-o2">--</span><span className="env-unit">%</span></div><div className="env-bar-track"><div className="env-bar" id="bar-o2" style={{background: 'var(--bio)'}}></div></div></div>
            </div>
          </div>
          <div className="map-panel map-panel-right glass" style={{position: 'absolute', top: '80px', right: '24px', width: '320px', zIndex: 10}}>
            <div className="panel-header"><span className="panel-dot"></span>NEURAL ARRAY SCAN</div>
            <canvas id="radar-canvas" width="220" height="220" style={{display: 'block', margin: '16px auto'}}></canvas>
            <div style={{textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--teal)', letterSpacing: '3px', margin: '12px 0'}}>SECTOR SCAN ACTIVE</div>
            <div className="anomaly-list">
              <div className="anomaly-label">DETECTED ANOMALIES</div>
              <div className="anomaly-item"><span className="an-id">AN-01</span><span>2.4km</span><span className="an-level low">LOW</span></div>
              <div className="anomaly-item"><span className="an-id">AN-02</span><span>5.1km</span><span className="an-level elevated">ELEVATED</span></div>
            </div>
            <button className="scan-btn" onClick={(e) => { e.preventDefault(); const w = window as unknown as { initializeSystem?: () => void }; if (typeof w.initializeSystem === "function") w.initializeSystem(); }}>DEEP SCAN</button>
          </div>
          <div className="map-bottom-bar"><span>DATA SOURCE: SENTINEL-5P</span><span>UPDATE: 60S</span><span id="map-coords">COORDINATES: 12.30°, 76.64°</span><span id="map-risk" className="risk-badge">SCANNING...</span></div>
        </section>

        <section><div style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '5px', color: 'var(--text-dim)', marginBottom: '20px'}}>02 / LIVE TELEMETRY</div><div style={{marginBottom: '60px'}}><h2 style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '6px', color: 'var(--text-bright)', marginBottom: '12px'}}>LIVE TELEMETRY</h2><p style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '4px', color: 'var(--text-dim)'}}>ATMOSPHERIC NODE ALPHA-01 · REAL-TIME SENSOR ARRAY</p></div><div className="telemetry-grid"><div className="tele-card glass"><div className="tc-top"><div className="tc-name">AIR QUALITY</div><div className="tc-tag">DATA</div></div><div className="tc-value" id="tc-v-aqi">--</div><div className="tc-unit">AQI</div><div className="tc-bars" id="tc-bars-aqi"><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div></div><div className="tc-footer"><span id="tc-status-aqi">MEASURING...</span><span className="tc-delta">±0</span></div></div><div className="tele-card glass"><div className="tc-top"><div className="tc-name">PARTICULATE</div><div className="tc-tag">DATA</div></div><div className="tc-value" id="tc-v-pm25">--</div><div className="tc-unit">µG/M³</div><div className="tc-bars" id="tc-bars-pm25"><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div></div><div className="tc-footer"><span id="tc-status-pm25">MEASURING...</span><span className="tc-delta">±0</span></div></div><div className="tele-card glass"><div className="tc-top"><div className="tc-name">HUMIDITY</div><div className="tc-tag">DATA</div></div><div className="tc-value" id="tc-v-humidity">--</div><div className="tc-unit">%</div><div className="tc-bars" id="tc-bars-humidity"><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div></div><div className="tc-footer"><span id="tc-status-humidity">MEASURING...</span><span className="tc-delta">±0</span></div></div><div className="tele-card glass"><div className="tc-top"><div className="tc-name">TEMPERATURE</div><div className="tc-tag">DATA</div></div><div className="tc-value" id="tc-v-temp">--</div><div className="tc-unit">°C</div><div className="tc-bars" id="tc-bars-temp"><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div></div><div className="tc-footer"><span id="tc-status-temp">MEASURING...</span><span className="tc-delta">±0</span></div></div><div className="tele-card glass"><div className="tc-top"><div className="tc-name">WIND SPEED</div><div className="tc-tag">DATA</div></div><div className="tc-value" id="tc-v-wind">--</div><div className="tc-unit">KM/H</div><div className="tc-bars" id="tc-bars-wind"><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div></div><div className="tc-footer"><span id="tc-status-wind">MEASURING...</span><span className="tc-delta">±0</span></div></div><div className="tele-card glass"><div className="tc-top"><div className="tc-name">O₂ LEVELS</div><div className="tc-tag">DATA</div></div><div className="tc-value" id="tc-v-o2">--</div><div className="tc-unit">%</div><div className="tc-bars" id="tc-bars-o2"><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div><div className="tc-bar-item"></div></div><div className="tc-footer"><span id="tc-status-o2">MEASURING...</span><span className="tc-delta">±0</span></div></div></div></section>

        <section><div style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '5px', color: 'var(--text-dim)', marginBottom: '20px'}}>03 / ATMOSPHERIC RESONANCE</div><div style={{marginBottom: '60px'}}><h2 style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '6px', color: 'var(--text-bright)', marginBottom: '12px'}}>ATMOSPHERIC RESONANCE</h2><p style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '4px', color: 'var(--text-dim)'}}>REAL-TIME ACOUSTIC ANALYSIS · MIC INPUT ACTIVE</p></div><div className="resonance-wrap glass"><canvas id="waveform-canvas" height="160" style={{width: '100%', display: 'block', marginBottom: '24px'}}></canvas><div className="resonance-stats"><div className="rs-item"><span className="rs-label">FREQUENCY</span><span className="rs-val" id="rs-freq">1.2</span><span className="rs-unit">kHz</span></div><div className="rs-divider"></div><div className="rs-item"><span className="rs-label">AMPLITUDE</span><span className="rs-val" id="rs-amp">-42</span><span className="rs-unit">dB</span></div><div className="rs-divider"></div><div className="rs-item"><span className="rs-label">PATTERN</span><span className="rs-val teal" id="rs-pattern">STABLE</span></div><div className="rs-divider"></div><div className="rs-item"><span className="rs-label">SOURCE</span><span className="rs-val" id="rs-source">AMBIENT</span></div></div></div></section>

        <section><div style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '5px', color: 'var(--text-dim)', marginBottom: '20px'}}>04 / ENVIRONMENTAL TRENDS</div><div style={{marginBottom: '60px'}}><h2 style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '6px', color: 'var(--text-bright)', marginBottom: '12px'}}>ENVIRONMENTAL TRENDS</h2><p style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '4px', color: 'var(--text-dim)'}}>24-HOUR ATMOSPHERIC ANALYSIS</p></div><div className="trends-grid"><div className="trend-card glass"><div className="tc-label">AQI TREND (24h)</div><canvas id="chart-aqi" height="200" style={{width: '100%'}}></canvas></div><div className="trend-card glass"><div className="tc-label">CO₂ LEVELS (24h)</div><canvas id="chart-co2" height="200" style={{width: '100%'}}></canvas></div><div className="trend-card glass"><div className="tc-label">NOISE LEVELS (24h)</div><canvas id="chart-noise" height="200" style={{width: '100%'}}></canvas></div></div></section>

        <section><div style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '5px', color: 'var(--text-dim)', marginBottom: '20px'}}>05 / TACTICAL INTELLIGENCE</div><div style={{marginBottom: '60px'}}><h2 style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '6px', color: 'var(--text-bright)', marginBottom: '12px'}}>TACTICAL INTELLIGENCE</h2><p style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '4px', color: 'var(--text-dim)'}}>NEURAL SCAN & PROXIMITY RADAR</p></div><div className="tactical-grid"><div className="tac-panel glass"><div className="panel-header"><span className="panel-dot"></span>SECTOR RADAR</div><canvas id="big-radar" width="320" height="320" style={{display: 'block', margin: '16px auto'}}></canvas></div><div className="tac-panel glass"><div className="panel-header"><span className="panel-dot"></span>NEURAL ARRAY AI</div><canvas id="neural-canvas" width="320" height="200" style={{display: 'block', margin: '16px auto'}}></canvas><div className="neural-grid"><div className="ng-item"><div className="ng-label">DATA NODES</div><div className="ng-val">1,402</div></div><div className="ng-item"><div className="ng-label">CONFIDENCE</div><div className="ng-val teal">99.4%</div></div><div className="ng-item"><div className="ng-label">ANOMALIES</div><div className="ng-val amber">3</div></div><div className="ng-item"><div className="ng-label">STATUS</div><div className="ng-val bio">ACTIVE</div></div></div></div><div className="tac-panel glass"><div className="panel-header"><span className="panel-dot"></span>POLLUTANT RADAR</div><canvas id="pollutant-radar" height="280" style={{width: '100%', display: 'block'}}></canvas></div></div></section>

        <section><div style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '5px', color: 'var(--text-dim)', marginBottom: '20px'}}>06 / PREDICTIVE FORECASTING</div><div style={{marginBottom: '60px'}}><h2 style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '6px', color: 'var(--text-bright)', marginBottom: '12px'}}>PREDICTIVE FORECASTING</h2><p style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '4px', color: 'var(--text-dim)'}}>AI-POWERED ATMOSPHERIC MODEL V9.2</p></div><div className="forecast-hero glass"><canvas id="forecast-canvas" height="200" style={{width: '100%', display: 'block', marginBottom: '16px'}}></canvas><div style={{textAlign: 'center'}}><div style={{fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--teal)', letterSpacing: '4px'}} id="fr-trend">STABLE PATTERN</div><div style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '2px', marginTop: '6px'}}>FORECAST CONFIDENCE: 94.2%</div></div></div><div className="forecast-detail-grid"><div className="fd-card glass"><div className="fd-label">30-MIN FORECAST</div><div className="fd-val" id="fd-forecast">--</div><div className="fd-unit">AQI</div></div><div className="fd-card glass"><div className="fd-label">ANOMALY STATUS</div><div className="fd-val bio" id="fd-anomaly">NORMAL</div><div className="fd-sub">All patterns within tolerance</div></div><div className="fd-card glass"><div className="fd-label">ACTIVITY ADVISORY</div><div className="activity-row"><span>🏃</span><span>Running</span><span className="act-safe bio">SAFE</span></div><div className="activity-row"><span>🚴</span><span>Cycling</span><span className="act-safe bio">SAFE</span></div><div className="activity-row"><span>🌳</span><span>Outdoor</span><span className="act-safe bio">SAFE</span></div></div></div></section>

        <section className="s-aria">
          <div style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '5px', color: 'var(--text-dim)', marginBottom: '20px'}}>07 / ARIA NEURAL LINK</div>
          <div style={{marginBottom: '60px'}}>
            <h2 style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '6px', color: 'var(--text-bright)', marginBottom: '12px'}}>ARIA INTELLIGENCE</h2>
            <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '4px', color: 'var(--text-dim)'}}>ATMOSPHERIC RESEARCH & INTELLIGENCE ASSISTANT</p>
          </div>

          <div className="aria-wrap">
            <div id="aria-chat" className="aria-chat glass">
              <div className="aria-msg">
                <div className="aria-avatar">◈</div>
                <div className="aria-bubble">
                  <div className="aria-sender">ARIA</div>
                  <div className="aria-text">Neural link established. I am monitoring the atmospheric telemetry. How can I assist you?</div>
                </div>
              </div>
            </div>
            
            <div className="aria-input-wrap glass">
              <div className="aria-input-left">
                <span className="aria-icon">◈</span>
                <input 
                  type="text" 
                  id="aria-input" 
                  className="aria-input" 
                  placeholder="Ask ARIA about the current atmospheric conditions..." 
                  onKeyDown={(e) => e.key === 'Enter' && (window as any).sendToAria?.()}
                />
              </div>
              <button className="aria-send-btn" onClick={() => (window as any).sendToAria?.()}>
                TRANSMIT →
              </button>
            </div>
            
            <div className="aria-quick-btns">
              <button className="aria-quick" onClick={() => (window as any).quickAsk?.('What is the current air quality?')}>Current AQI?</button>
              <button className="aria-quick" onClick={() => (window as any).quickAsk?.('Are there any anomalies nearby?')}>Scan for anomalies</button>
              <button className="aria-quick" onClick={() => (window as any).quickAsk?.('Is it safe to run outside right now?')}>Safe to run?</button>
            </div>
          </div>
        </section>

        <footer className="site-footer glass"><div className="footer-grid"><div><div className="footer-logo">◈ BREATHMAP</div></div></div><div className="footer-bar">BREATHMAP © 2025 · ALL DATA REAL-TIME</div></footer>
      </div>

      
    </>
  );
}
