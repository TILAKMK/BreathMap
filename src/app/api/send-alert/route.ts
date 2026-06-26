import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export async function POST(request: Request) {
  const body = await request.json();
  const {
    email, name, city, level,
    aqi, pm25, co2, o2,
    alerts, timestamp
  } = body;

  if (!email) {
    return NextResponse.json({ error: 'No email provided' }, { status: 400 });
  }

  // Don't spam — only send once per hour per level
  // (frontend handles this logic)

  const levelConfig = {
    warning:  { color: '#ffcc00', bg: '#1a1500', label: 'WARNING',  icon: '⚠️' },
    danger:   { color: '#ff3535', bg: '#1a0000', label: 'DANGER',   icon: '🚨' },
    critical: { color: '#ff0000', bg: '#0d0000', label: 'CRITICAL', icon: '☠️' }
  };

  const cfg = levelConfig[level as keyof typeof levelConfig] || levelConfig.warning;

  const alertRows = alerts.map((a: any) => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);
                 font-family:'Courier New',monospace;font-size:13px;color:#7ab8cc;
                 letter-spacing:2px;">${a.metric}</td>
      <td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);
                 font-family:'Courier New',monospace;font-size:14px;font-weight:700;
                 color:${cfg.color};">${a.value}</td>
      <td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);
                 font-family:'Courier New',monospace;font-size:12px;
                 color:rgba(200,230,255,0.6);">${a.msg}</td>
    </tr>
  `).join('');

  const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>BreathMap Alert</title>
</head>
<body style="margin:0;padding:0;background:#000508;font-family:'Helvetica Neue',sans-serif;">

  <!-- OUTER WRAPPER -->
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- HEADER -->
    <div style="background:#020c14;border:1px solid ${cfg.color};border-radius:8px;
                padding:32px;margin-bottom:16px;text-align:center;
                box-shadow:0 0 40px ${cfg.color}33;">

      <!-- Logo -->
      <div style="font-family:'Courier New',monospace;font-size:11px;
                  letter-spacing:6px;color:#00e5ff;margin-bottom:20px;">
        ◈ BREATHMAP ENVIRONMENTAL INTELLIGENCE
      </div>

      <!-- Alert level badge -->
      <div style="display:inline-block;padding:8px 24px;
                  background:${cfg.bg};border:1px solid ${cfg.color};
                  border-radius:4px;margin-bottom:24px;">
        <span style="font-family:'Courier New',monospace;font-size:12px;
                     letter-spacing:6px;color:${cfg.color};font-weight:700;">
          ${cfg.icon} ${cfg.label} ALERT
        </span>
      </div>

      <!-- Main heading -->
      <h1 style="margin:0 0 8px;font-size:28px;font-weight:900;
                 color:#e8f4ff;letter-spacing:3px;">
        AIR QUALITY ${cfg.label}
      </h1>
      <p style="margin:0;font-family:'Courier New',monospace;font-size:12px;
                letter-spacing:3px;color:rgba(200,230,255,0.5);">
        ${city?.toUpperCase()} · ${timestamp}
      </p>
    </div>

    <!-- GREETING -->
    <div style="background:#041220;border:1px solid rgba(0,229,255,0.1);
                border-radius:8px;padding:24px;margin-bottom:16px;">
      <p style="margin:0 0 8px;color:#e8f4ff;font-size:15px;line-height:1.6;">
        Hello <strong style="color:#00e5ff;">${name || 'User'}</strong>,
      </p>
      <p style="margin:0;color:rgba(200,230,255,0.7);font-size:14px;line-height:1.8;">
        BreathMap has detected <strong style="color:${cfg.color};">
        ${level === 'critical' ? 'critically dangerous' : level === 'danger' ? 'dangerous' : 'concerning'}
        </strong> atmospheric conditions at your monitored location.
        Immediate attention is recommended.
      </p>
    </div>

    <!-- BIG AQI NUMBER -->
    <div style="background:#041220;border:1px solid rgba(0,229,255,0.1);
                border-radius:8px;padding:32px;margin-bottom:16px;text-align:center;">
      <div style="font-family:'Courier New',monospace;font-size:11px;
                  letter-spacing:4px;color:rgba(200,230,255,0.4);margin-bottom:12px;">
        CURRENT AIR QUALITY INDEX
      </div>
      <div style="font-size:72px;font-weight:900;color:${cfg.color};
                  line-height:1;margin-bottom:8px;
                  text-shadow:0 0 30px ${cfg.color}66;">
        ${aqi}
      </div>
      <div style="font-family:'Courier New',monospace;font-size:13px;
                  letter-spacing:4px;color:rgba(200,230,255,0.5);">
        AQI · ${
          aqi > 200 ? 'HAZARDOUS' :
          aqi > 150 ? 'VERY UNHEALTHY' :
          aqi > 100 ? 'UNHEALTHY' : 'MODERATE'
        }
      </div>
    </div>

    <!-- METRICS TABLE -->
    <div style="background:#041220;border:1px solid rgba(0,229,255,0.1);
                border-radius:8px;overflow:hidden;margin-bottom:16px;">
      <div style="padding:16px 20px;border-bottom:1px solid rgba(0,229,255,0.1);
                  background:#051828;">
        <span style="font-family:'Courier New',monospace;font-size:11px;
                     letter-spacing:4px;color:#00e5ff;">
          ● TRIGGERED ALERTS
        </span>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:rgba(0,229,255,0.04);">
            <th style="padding:10px 16px;text-align:left;font-family:'Courier New',monospace;
                       font-size:10px;letter-spacing:3px;color:rgba(200,230,255,0.3);
                       font-weight:normal;">METRIC</th>
            <th style="padding:10px 16px;text-align:left;font-family:'Courier New',monospace;
                       font-size:10px;letter-spacing:3px;color:rgba(200,230,255,0.3);
                       font-weight:normal;">VALUE</th>
            <th style="padding:10px 16px;text-align:left;font-family:'Courier New',monospace;
                       font-size:10px;letter-spacing:3px;color:rgba(200,230,255,0.3);
                       font-weight:normal;">STATUS</th>
          </tr>
        </thead>
        <tbody>
          ${alertRows}
        </tbody>
      </table>
    </div>

    <!-- LIVE READINGS -->
    <div style="background:#041220;border:1px solid rgba(0,229,255,0.1);
                border-radius:8px;padding:24px;margin-bottom:16px;">
      <div style="font-family:'Courier New',monospace;font-size:11px;
                  letter-spacing:4px;color:#00e5ff;margin-bottom:16px;">
        ● LIVE ATMOSPHERIC READINGS
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">

        <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(0,229,255,0.08);
                    border-radius:6px;padding:14px;text-align:center;">
          <div style="font-family:'Courier New',monospace;font-size:9px;
                      letter-spacing:3px;color:rgba(200,230,255,0.4);margin-bottom:6px;">PM2.5</div>
          <div style="font-size:22px;font-weight:700;color:#e8f4ff;">${pm25}</div>
          <div style="font-family:'Courier New',monospace;font-size:9px;
                      color:rgba(200,230,255,0.3);">µg/m³</div>
        </div>

        <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(0,229,255,0.08);
                    border-radius:6px;padding:14px;text-align:center;">
          <div style="font-family:'Courier New',monospace;font-size:9px;
                      letter-spacing:3px;color:rgba(200,230,255,0.4);margin-bottom:6px;">CO₂</div>
          <div style="font-size:22px;font-weight:700;color:#e8f4ff;">${co2}</div>
          <div style="font-family:'Courier New',monospace;font-size:9px;
                      color:rgba(200,230,255,0.3);">ppm</div>
        </div>

        <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(57,255,20,0.1);
                    border-radius:6px;padding:14px;text-align:center;">
          <div style="font-family:'Courier New',monospace;font-size:9px;
                      letter-spacing:3px;color:rgba(200,230,255,0.4);margin-bottom:6px;">O₂ LEVEL</div>
          <div style="font-size:22px;font-weight:700;
                      color:${o2 < 19.5 ? '#ff3535' : '#39ff14'};">${o2}%</div>
          <div style="font-family:'Courier New',monospace;font-size:9px;
                      color:rgba(200,230,255,0.3);">OXYGEN</div>
        </div>

        <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(0,229,255,0.08);
                    border-radius:6px;padding:14px;text-align:center;">
          <div style="font-family:'Courier New',monospace;font-size:9px;
                      letter-spacing:3px;color:rgba(200,230,255,0.4);margin-bottom:6px;">LOCATION</div>
          <div style="font-size:16px;font-weight:700;color:#e8f4ff;">${city}</div>
          <div style="font-family:'Courier New',monospace;font-size:9px;
                      color:rgba(200,230,255,0.3);">MONITORED</div>
        </div>

      </div>
    </div>

    <!-- HEALTH ADVISORY -->
    <div style="background:${cfg.bg};border:1px solid ${cfg.color}44;
                border-radius:8px;padding:24px;margin-bottom:16px;">
      <div style="font-family:'Courier New',monospace;font-size:11px;
                  letter-spacing:4px;color:${cfg.color};margin-bottom:14px;">
        ⚕ HEALTH ADVISORY
      </div>
      <ul style="margin:0;padding:0 0 0 20px;color:rgba(200,230,255,0.8);
                 font-size:14px;line-height:2;">
        ${aqi > 150 ? '<li>Avoid all outdoor activities immediately</li>' : '<li>Limit prolonged outdoor exposure</li>'}
        ${pm25 > 35 ? '<li>Wear N95 mask if going outside</li>' : ''}
        ${co2 > 600 ? '<li>Ventilate indoor spaces — open windows</li>' : ''}
        ${o2 < 20 ? '<li>Avoid strenuous physical activity</li>' : ''}
        <li>Keep children and elderly indoors</li>
        <li>Monitor BreathMap for updates every 30 minutes</li>
      </ul>
    </div>

    <!-- CTA BUTTON -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://breath-map.vercel.app/command-center"
         style="display:inline-block;padding:16px 40px;
         background:transparent;border:1px solid #00e5ff;
         border-radius:4px;color:#00e5ff;
         font-family:'Courier New',monospace;font-size:12px;
         font-weight:700;letter-spacing:4px;text-decoration:none;">
        OPEN BREATHMAP DASHBOARD →
      </a>
    </div>

    <!-- FOOTER -->
    <div style="text-align:center;padding-top:24px;
                border-top:1px solid rgba(0,229,255,0.08);">
      <div style="font-family:'Courier New',monospace;font-size:10px;
                  letter-spacing:3px;color:rgba(200,230,255,0.2);margin-bottom:8px;">
        ◈ BREATHMAP · REAL-TIME ENVIRONMENTAL INTELLIGENCE
      </div>
      <div style="font-family:'Courier New',monospace;font-size:9px;
                  color:rgba(200,230,255,0.15);">
        You received this because you enabled alerts on BreathMap.
        Data refreshes every 60 seconds.
      </div>
    </div>

  </div>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: 'BreathMap Alerts <alerts@yourdomain.com>',
      to: [email],
      subject: `${cfg.icon} BreathMap ${cfg.label}: AQI ${aqi} in ${city}`,
      html: htmlEmail,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('Email send failed:', error);
    return NextResponse.json({ error: 'Email failed' }, { status: 500 });
  }
}
