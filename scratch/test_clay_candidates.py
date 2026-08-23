import urllib.request
import urllib.parse
import json
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

# Let's test a curated list of direct high-quality product images for clay sets
candidates = {
    'modeling_clay_super_pack': [
        'https://i5.walmartimages.com/asr/5be8d205-d14f-4d69-959c-6a4ec384950e.97341857945d8b7662c1ae1376ef7172.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768',
        'https://i5.walmartimages.com/asr/5f79be25-1e3d-4c38-8fa8-cf18dc776e62.909930f3a479ff73d42df2e6d62888cf.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768',
        'https://i5.walmartimages.com/asr/a40da5b2-3860-4966-a361-ec853cbf2b6b.e5b87eb8f1ef68ef6fc7377fa13c6b24.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768',
        'https://i5.walmartimages.com/asr/4ef6d96e-55c3-4dbe-a178-83184cfd5e16.c9a3cefae477e7e8b625cf04b7be8251.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768',
        'https://i5.walmartimages.com/asr/4dc74c2e-aa78-43d9-9ec4-d6a36f568393.593da04791ee235ef9b0394017f8a706.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768',
        'https://images-na.ssl-images-amazon.com/images/I/81k3yUj-TPL.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/71PZZpQd3-L.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/81J4U4RzPCL.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/71N%2BQ4GkU2L.jpg'
    ],
    'air_dry_clay_10_pack': [
        'https://i5.walmartimages.com/asr/c5b9bf61-cf8d-4f1e-84fc-7fb91bfe26cf.6b65313988fe709a3fc3a5a73e659b8a.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768',
        'https://i5.walmartimages.com/asr/8f35f3d3-7dc9-40ea-a0a1-fa47d488e040.64095430855ff48e244ef879e6231f8b.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768',
        'https://i5.walmartimages.com/asr/f9c8d37a-f8a4-44bf-8ba5-b54133481239.544bc306c59b6574f9fb5c6d3bc01e67.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768',
        'https://images-na.ssl-images-amazon.com/images/I/71Q3JkC85sL.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/81tB%2BRV7rEL.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/71d1gR76xGL.jpg'
    ],
    'polymer_clay_multipack': [
        'https://i5.walmartimages.com/asr/963f2780-e374-4b5b-8fce-fe2bfa89ce7d.b65aa705ddb78f4b0051e5138f382a93.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768',
        'https://i5.walmartimages.com/asr/4ff336cf-82e7-4581-80cf-f2d4eeadbe51.daef1bbd43714b1b369c2d1dd2cf9bfa.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768',
        'https://i5.walmartimages.com/asr/c1b26f5d-752a-43eb-944f-c4f74d022b78.2d385bb094e9f3b398606aa1d62c2f78.jpeg?odnBg=ffffff&odnHeight=768&odnWidth=768',
        'https://images-na.ssl-images-amazon.com/images/I/81eRk2eQ-kL.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/71T1pYlJqSL.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/81fHwQ%2Bv4ZL.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/81Xm-v0jKxL.jpg'
    ]
}

for cat, urls in candidates.items():
    print(f"\nTesting {cat}:")
    for u in urls:
        try:
            req = urllib.request.Request(u, headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=5) as resp:
                print(f"  OK ({resp.status}, len={len(resp.read())}) -> {u}")
        except Exception as e:
            print(f"  Failed ({e}) -> {u}")
