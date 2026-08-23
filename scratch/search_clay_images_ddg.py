import urllib.request
import urllib.parse
import json
import re

def search_ddg(query, count=5):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')
        # find image urls or duckduckgo search
    except Exception as e:
        print('Error:', e)
    return []

if __name__ == '__main__':
    print("Ready to search")
