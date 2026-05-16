import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace import Script
content = content.replace("import Script from 'next/script';", "import { useEffect } from 'react';")

# Extract contents of scripts
script1_match = re.search(r'<Script id="cursor-script" strategy="afterInteractive">\{`(.*?)`\}</Script>', content, re.DOTALL)
script1 = script1_match.group(1) if script1_match else ''
content = re.sub(r'<Script id="cursor-script" strategy="afterInteractive">\{`.*?`\}</Script>', '', content, flags=re.DOTALL)

script2_match = re.search(r'<Script id="app-script" strategy="afterInteractive">\{`(.*?)`\}</Script>', content, re.DOTALL)
script2 = script2_match.group(1) if script2_match else ''
content = re.sub(r'<Script id="app-script" strategy="afterInteractive">\{`.*?`\}</Script>', '', content, flags=re.DOTALL)

# Insert useEffect
effect = f"""
  useEffect(() => {{
{script1}
{script2}
  }}, []);
"""
content = content.replace("return (", effect + "\n  return (")

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
