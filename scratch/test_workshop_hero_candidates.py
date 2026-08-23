import urllib.request

candidates = [
    "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1525909015029-551da8184433?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
]

for url in candidates:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as response:
            status = response.getcode()
            print(f"Status {status}: {url}")
    except Exception as e:
        print(f"FAILED: {url} -> {e}")
