with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('\'use client\';', '\'use client\';\nimport Script from \'next/script\';')

# Add dynamic ids so next/script handles them correctly.
# First replacement
content = content.replace('<script dangerouslySetInnerHTML={{__html: `', '<Script id="cursor-script" strategy="afterInteractive">{`', 1)

# Second replacement
content = content.replace('<script dangerouslySetInnerHTML={{__html: `', '<Script id="app-script" strategy="afterInteractive">{`', 1)

content = content.replace('`}} />', '`}</Script>')

# Fix button onClick to ensure it is triggered properly
content = content.replace('onClick={() => (window as any).initializeSystem?.()}', 'onClick={(e) => { e.preventDefault(); if (typeof (window as any).initializeSystem === \"function\") (window as any).initializeSystem(); }}')

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
