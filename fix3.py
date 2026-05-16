with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the escaped backticks and template literals
content = content.replace('\\`', '`')
content = content.replace('\\$', '$')

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
