import urllib.request
import urllib.parse
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) UrbanSketcherCrawler2/1.0'}

# Search for specific titles on Wikimedia
terms = [
    "sketchbook",
    "plein air",
    "architectural drawing",
    "street sketch",
    "sketching"
]

for t in terms:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(t)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                title = pdata.get('title', '')
                if 'imageinfo' in pdata:
                    ii = pdata['imageinfo'][0]
                    img_url = ii['url']
                    mime = ii.get('mime', '')
                    size = ii.get('size', 0)
                    if 'image' in mime and size > 200000 and ('jpg' in img_url.lower() or 'jpeg' in img_url.lower()):
                        clean_name = title.replace('File:', '').replace('/', '_').replace(' ', '_')[:35] + '.jpg'
                        dest = f"images/art_culture_samples/{clean_name}"
                        try:
                            req2 = urllib.request.Request(img_url, headers=headers)
                            with urllib.request.urlopen(req2, timeout=15) as dl:
                                c = dl.read()
                                with open(dest, 'wb') as f:
                                    f.write(c)
                                print(f"Saved {dest} ({len(c)/1024:.1f} KB) - {title}")
                        except:
                            pass
    except Exception as e:
        print(f"Error {t}: {e}")
