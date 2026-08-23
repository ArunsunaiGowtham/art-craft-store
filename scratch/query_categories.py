import urllib.request
import urllib.parse
import json
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'ArtCraftProject/1.0 (art@example.com)'}

def get_category_images(category, limit=6):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{urllib.parse.quote(category)}&cmtype=file&cmlimit={limit}&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10, context=ctx) as res:
            data = json.loads(res.read().decode('utf-8'))
            members = data.get("query", {}).get("categorymembers", [])
            titles = [m["title"] for m in members if m["title"].lower().endswith(('.jpg', '.jpeg', '.png'))]
            if not titles:
                return []
            
            # Fetch image URLs
            info_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={'|'.join([urllib.parse.quote(t) for t in titles])}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json"
            info_req = urllib.request.Request(info_url, headers=headers)
            with urllib.request.urlopen(info_req, timeout=10, context=ctx) as info_res:
                info_data = json.loads(info_res.read().decode('utf-8'))
                pages = info_data.get("query", {}).get("pages", {})
                results = []
                for pid, p in pages.items():
                    title = p.get("title", "")
                    imageinfo = p.get("imageinfo", [{}])[0]
                    thumburl = imageinfo.get("thumburl") or imageinfo.get("url")
                    if thumburl:
                        results.append({"title": title, "url": thumburl})
                return results
    except Exception as e:
        print(f"Error in {category}: {e}")
        return []

categories = {
    "watercolor": "Watercolor_paint",
    "calligraphy": "Calligraphers_at_work",
    "pottery": "Pottery_making",
    "botanical": "Botanical_illustrations_in_watercolor",
    "art_classes": "Art_classes"
}

for name, cat in categories.items():
    print(f"\nCategory: {cat}")
    items = get_category_images(cat)
    for i, it in enumerate(items):
        print(f"  [{i}] {it['title']}")
        print(f"      {it['url']}")
