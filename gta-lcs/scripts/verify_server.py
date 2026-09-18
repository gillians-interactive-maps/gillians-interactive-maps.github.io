import urllib.request

paths = [
    '/',
    '/css/style.css',
    '/js/app.js',
    '/data/markers.json',
    '/assets/videos/hp_1.mp4',
    '/assets/images/lcs_hp_0.webp'
]

for p in paths:
    url = f'http://127.0.0.1:8085{p}'
    try:
        with urllib.request.urlopen(url) as resp:
            status = resp.status
            size = resp.headers.get('Content-Length', 'chunked')
            ctype = resp.headers.get('Content-Type')
            print(f"PASS: {p} -> HTTP {status}, {size} bytes, {ctype}")
    except Exception as e:
        print(f"FAIL: {p} -> {e}")
