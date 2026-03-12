import re
import os

def convert_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already converted
    if 'nav-container' in content:
        print(f"Skipped (already done): {filepath}")
        return
    
    # Replace nav block
    content = re.sub(
        r'<nav[^>]*>.*?</nav>',
        '<div id="nav-container"></div>',
        content,
        flags=re.DOTALL
    )
    
    # Replace footer block
    content = re.sub(
        r'<footer[^>]*>.*?</footer>',
        '<div id="footer-container"></div>',
        content,
        flags=re.DOTALL
    )
    
    # Determine script path
    if filepath.startswith('./blog/') or filepath.startswith('blog/'):
        script_tag = '<script src="../partials/includes.js"></script>'
    else:
        script_tag = '<script src="partials/includes.js"></script>'
    
    # Add includes.js if not present
    if 'partials/includes.js' not in content:
        content = content.replace('</body>', f'    {script_tag}\n</body>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Converted: {filepath}")

# Root files
for f in ['404.html', 'blog.html', 'index.html', 'onboarding.html', 
          'privacy-policy.html', 'referral.html', 'terms-and-conditions.html']:
    if os.path.exists(f):
        convert_file(f)

# Blog files
if os.path.exists('blog'):
    for f in os.listdir('blog'):
        if f.endswith('.html'):
            convert_file(f'blog/{f}')

print("\nDone! Now deploy to test.")
