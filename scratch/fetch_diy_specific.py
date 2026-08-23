import urllib.request
import urllib.parse
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'ArtStoreDIYTiles/1.0 (contact@artcraft.org)'}

specific_titles = [
    "File:Glass mosaic tiles.jpg",
    "File:Colorful mosaic tiles.jpg",
    "File:Mosaic craft pieces.jpg",
    "File:Linocut print tools and ink.jpg",
    "File:Printmaking brayer and ink.jpg",
    "File:Epoxy resin art pieces.jpg",
    "File:Pressed flowers in resin craft.jpg",
    "File:Soap making herbs and oils.jpg",
    "File:Natural soap making ingredients.jpg",
    "File:Leather craft working tools.jpg"
]

for t in specific_titles:
    query_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url|size|mime&format=json"
    try:
        req = urllib.request.Request(query_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                if 'imageinfo' in pdata:
                    url = pdata['imageinfo'][0]['url']
                    fname = t.replace('File:', '').replace(' ', '_')
                    dest = f"images/crafting_samples/{fname}"
                    req_img = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(req_img, timeout=15) as img_res:
                        img_data = img_res.read()
                        with open(dest, 'wb') as f:
                            f.write(img_data)
                        print(f"Saved {dest} ({len(img_data)/1024:.1f} KB) from {t}")
    except Exception as e:
        print(f"Error {t}: {e}")
