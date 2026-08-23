import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def get_photo_info(photo_id):
    url = f"https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=4ecb0dbdd520f9ab40cbbd3ef7bbdeea&photo_id={photo_id}&format=json&nojsoncallback=1"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=5) as r:
            data = json.loads(r.read().decode('utf-8'))
            title = data.get('photo', {}).get('title', {}).get('_content', '')
            desc = data.get('photo', {}).get('description', {}).get('_content', '')
            tags = [t.get('raw', '') for t in data.get('photo', {}).get('tags', {}).get('tag', [])]
            return title, desc, tags
    except Exception as e:
        return str(e), '', []

photos = [
    ("arches_tag_1", "54452697162"),
    ("arches_tag_2", "54402787619"),
    ("arches_tag_3", "54340025842"),
    ("arches_tag_4", "41989977074"),
    ("arches_tag_5", "28058837281"),
    ("pad_tag_1", "6309944810"),
    ("pad_tag_2", "291040494"),
    ("cold_press_pad_3", "52657992190")
]

for name, pid in photos:
    t, d, tags = get_photo_info(pid)
    print(f"[{name}] Title: '{t}' | Tags: {tags[:6]}")
