import urllib.request
import urllib.parse
import json
import os

import ssl

def search_wikimedia(query, limit=5):
    endpoint = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": f"{query} filetype:bitmap",
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|mime|thumburl",
        "iiurlwidth": 800,
        "format": "json"
    }
    url = endpoint + "?" + urllib.parse.urlencode(params)
    headers = {'User-Agent': 'ArtCraftStore/1.0 (https://example.com; artcraft@example.com)'}
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as res:
            data = json.loads(res.read().decode('utf-8'))
            pages = data.get("query", {}).get("pages", {})
            results = []
            for pid, pdata in pages.items():
                title = pdata.get("title", "")
                imageinfo = pdata.get("imageinfo", [{}])[0]
                thumburl = imageinfo.get("thumburl") or imageinfo.get("url")
                if thumburl:
                    results.append({"title": title, "url": thumburl})
            return results
    except Exception as e:
        print(f"Error searching for {query}: {e}")
        return []

workshop_topics = {
    "watercolor": "watercolor paint brushes palette paper",
    "calligraphy": "calligraphy lettering script pen",
    "pottery_clay": "pottery wheel clay hands ceramic",
    "acrylic_pouring": "acrylic paint fluid art pouring",
    "urban_sketching": "urban sketching drawing sketchbook building",
    "candle_making": "candle making wax handmade",
    "botanical_watercolor": "botanical watercolor flower leaves illustration",
    "art_studio_workshop": "art workshop studio painting easel students"
}

for name, q in workshop_topics.items():
    print(f"\n--- {name.upper()} ({q}) ---")
    imgs = search_wikimedia(q, limit=4)
    for idx, item in enumerate(imgs):
        print(f"  [{idx}] {item['title'][:60]}")
        print(f"      URL: {item['url']}")
