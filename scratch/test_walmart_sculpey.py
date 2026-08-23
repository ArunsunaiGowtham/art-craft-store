import urllib.request
import re

query_urls = [
    # Sculpey sampler image URLs
    ("sculpey_30_sampler_1", "https://i5.walmartimages.com/seo/Sculpey-III-Polymer-Clay-Color-Sampler-Set-30-Pack-1-oz-Bars_9f8dcf62-5883-4a11-a83d-3bf5b0cfa4b4.9df8c8a14b0b1cb3bcfb7fb25f0e340.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_30_sampler_2", "https://i5.walmartimages.com/asr/3e721d01-e945-4209-847e-2cf1fba502ee_1.09df8c8a14b0b1cb3bcfb7fb25f0e340.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_30_sampler_3", "https://i5.walmartimages.com/asr/3e721d01-e945-4209-847e-2cf1fba502ee.09df8c8a14b0b1cb3bcfb7fb25f0e340.jpeg"),
    ("sculpey_30_sampler_4", "https://i5.walmartimages.com/asr/1efc4059-e938-4e1e-9ca2-61daff15c0e1.d8b8e053f3e2b27464971ae4125b29b4.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_30_sampler_5", "https://i5.walmartimages.com/asr/6f9fb101-70df-4f4a-85d8-e395be3e0eb4.1610bb47b4d081f9a23996773229ec23.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_clay_kit_6", "https://i5.walmartimages.com/asr/b52c0f65-27a3-48eb-bf3a-9e7eeecb281f.e7f8496924b172a39bc6ef6df21a28a2.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"),
    ("sculpey_clay_kit_7", "https://i5.walmartimages.com/asr/e2c0e863-718a-44ce-862d-055047b85437.93043feaeef2ffdb96f8cce8d0ad18cf.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768")
]

for name, url in query_urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            print(f"{name}: SUCCESS ({len(data)} bytes)")
            with open(f"scratch/{name}.jpg", "wb") as f:
                f.write(data)
    except Exception as e:
        print(f"{name}: failed ({e})")
