import urllib.request
import urllib.parse
import json
import ssl

def search_wikimedia(query, limit=5):
    endpoint = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "list": "search",
        "srsearch": f"{query} insource:jpg",
        "srlimit": limit,
        "srnamespace": "6", # File namespace
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
            search_items = data.get("query", {}).get("search", [])
            titles = "|".join([item["title"] for item in search_items])
            if not titles:
                return []
            
            # Get image URLs
            info_params = {
                "action": "query",
                "titles": titles,
                "prop": "imageinfo",
                "iiprop": "url",
                "iiurlwidth": "800",
                "format": "json"
            }
            info_url = endpoint + "?" + urllib.parse.urlencode(info_params)
            info_req = urllib.request.Request(info_url, headers=headers)
            with urllib.request.urlopen(info_req, timeout=10, context=ctx) as info_res:
                info_data = json.loads(info_res.read().decode('utf-8'))
                pages = info_data.get("query", {}).get("pages", {})
                results = []
                for pid, pdata in pages.items():
                    title = pdata.get("title", "")
                    imageinfo = pdata.get("imageinfo", [{}])[0]
                    thumburl = imageinfo.get("thumburl") or imageinfo.get("url")
                    if thumburl:
                        results.append({"title": title, "url": thumburl})
                return results
    except Exception as e:
        print(f"Error: {e}")
        return []

workshop_topics = {
    "watercolor": "watercolor painting artist",
    "calligraphy": "calligraphy lettering hand",
    "pottery_clay": "pottery wheel clay hands",
    "acrylic_pouring": "acrylic paint fluid",
    "urban_sketching": "urban sketch drawing",
    "candle_making": "candle making craft",
    "botanical_watercolor": "botanical watercolor illustration",
    "art_studio_workshop": "art workshop studio painting"
}

for name, q in workshop_topics.items():
    print(f"\n--- {name.upper()} ---")
    imgs = search_wikimedia(q, limit=3)
    for idx, item in enumerate(imgs):
        print(f"  [{idx}] {item['title'][:60]}")
        print(f"      URL: {item['url']}")
