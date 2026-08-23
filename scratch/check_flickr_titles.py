import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Query Flickr info for titles/descriptions
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
    ("modeling_clay_1", "54761545887"),
    ("modeling_clay_2", "54761539897"),
    ("modeling_clay_3", "54066275241"),
    ("modeling_clay_4", "53740873881"),
    ("modeling_clay_5", "52296334478"),
    ("polymer_clay_1", "55462174924"),
    ("polymer_clay_2", "55446203639"),
    ("polymer_clay_3", "55445528754"),
    ("polymer_clay_4", "55445759455"),
    ("polymer_clay_5", "55445364626"),
    ("air_dry_clay_1", "55168951018"),
    ("air_dry_clay_2", "54922043744"),
    ("fimo_1", "53650441413"),
    ("fimo_2", "53649348047"),
    ("pottery_clay_2", "51415185005"),
    ("pottery_clay_3", "51413455407"),
    ("pottery_clay_5", "15907870316")
]

for name, pid in photos:
    t, d, tags = get_photo_info(pid)
    print(f"[{name}] Title: {t} | Tags: {tags[:6]}")
