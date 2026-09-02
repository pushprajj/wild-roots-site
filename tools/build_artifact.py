#!/usr/bin/env python3
"""Assemble the four-page Wild Roots static site into one self-contained
artifact page: hash-routed pages, inlined CSS/JS, data-URI images."""
import base64
import io
import re
from pathlib import Path

from PIL import Image

SITE = Path('/home/ubuntu/projects/wild-roots/site')
OUT = Path(__file__).parent / 'wild-roots-preview.html'

PAGES = {'home': 'index.html', 'products': 'products.html',
         'about': 'about.html', 'contact': 'contact.html'}

# ---- encode images -------------------------------------------------------
def jpeg_data_uri(path, max_w=1100, quality=70):
    im = Image.open(path).convert('RGB')
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=quality, progressive=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()

def png_data_uri(path, max_w=200):
    im = Image.open(path)
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()

uris = {}
for jpg in (SITE / 'assets/img').glob('*.jpg'):
    uris[f'assets/img/{jpg.name}'] = jpeg_data_uri(jpg)
def svg_data_uri(path):
    return 'data:image/svg+xml;base64,' + base64.b64encode(path.read_bytes()).decode()
for svg in (SITE / 'assets/logo').glob('*.svg'):
    uris[f'assets/logo/{svg.name}'] = svg_data_uri(svg)
# hero video: the smaller 720p encode keeps the artifact well under the size cap
video_720 = Path(__file__).parent / 'hero-720.mp4'
uris['assets/video/hero.mp4'] = ('data:video/mp4;base64,'
                                 + base64.b64encode(video_720.read_bytes()).decode())

# ---- extract and rewrite page bodies -------------------------------------
LINK_MAP = {'index.html': '#home', 'products.html': '#products',
            'about.html': '#about', 'contact.html': '#contact',
            'index.html#chain': '#chain', 'index.html#faq': '#faq',
            'index.html#enquiry': '#enquiry'}

def extract_body(name, fname):
    html = (SITE / fname).read_text()
    m = re.search(r'<body[^>]*>(.*)</body>', html, re.S)
    body = m.group(1)
    body = re.sub(r'<script src="[^"]+"></script>', '', body)
    for old, new in sorted(LINK_MAP.items(), key=lambda kv: -len(kv[0])):
        body = body.replace(f'href="{old}"', f'href="{new}"')
    # de-duplicate the per-page top anchor and its skip link
    body = body.replace('id="top"', f'id="top-{name}"')
    body = body.replace('href="#top"', f'href="#top-{name}"')
    inner = ' class="inner"' if name != 'home' else ''
    return f'<div class="page" id="page-{name}" data-page{inner}>\n{body}\n</div>'

sections = [extract_body(n, f) for n, f in PAGES.items()]

# ---- css -----------------------------------------------------------------
css = (SITE / 'css/styles.css').read_text()
# page-inner tokens hang off the wrapper instead of <body> in the artifact
css = css.replace('body.page-inner', '.page.inner')
css += '''
/* ---------- artifact router ---------- */
.page { display: none; background: var(--cr); }
.page.is-active { display: block; }
.page.inner { background: var(--cr); }
'''

# ---- js ------------------------------------------------------------------
main_js = (SITE / 'js/main.js').read_text()
products_js = (SITE / 'js/products.js').read_text()

# preview build: no backend — say so honestly instead of faking a send
main_js = main_js[:main_js.index("  var FORM_ENDPOINT")] + '''
  document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('[data-form-note]');
      if (note) note.textContent = 'Preview build — on the live site this reaches the desk. For now, email contact@wildrootsint.in.';
    });
  });
''' + main_js[main_js.index('  /* ' + '-' * 71 + '\n     Hero journey phases'):]

router_js = '''
(function () {
  'use strict';
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page[data-page]'));
  function show(name) {
    pages.forEach(function (p) {
      p.classList.toggle('is-active', p.id === 'page-' + name);
    });
  }
  function route() {
    var h = (location.hash || '#home').slice(1);
    if (document.getElementById('page-' + h)) {
      show(h);
      window.scrollTo(0, 0);
      return;
    }
    var el = document.getElementById(h);
    if (el) {
      var page = el.closest('.page[data-page]');
      if (page && !page.classList.contains('is-active')) show(page.id.slice(5));
      requestAnimationFrame(function () { el.scrollIntoView(); });
      return;
    }
    show('home');
  }
  window.addEventListener('hashchange', route);
  route();
})();
'''

# ---- assemble ------------------------------------------------------------
doc = f'''<title>Wild Roots International</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&family=Libre+Franklin:wght@300;400;500&display=swap" rel="stylesheet">
<style>
{css}
</style>
{chr(10).join(sections)}
<script>
{router_js}
{main_js}
{products_js}
</script>
'''

for path, uri in uris.items():
    doc = doc.replace(f"'{path}'", f"'{uri}'")   # js references
    doc = doc.replace(f'"{path}"', f'"{uri}"')   # html src attributes

OUT.write_text(doc)
print(f'{OUT.name}: {len(doc) / 1e6:.1f} MB, pages: {len(sections)}, images: {len(uris)}')
