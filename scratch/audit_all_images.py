import json
import urllib.request
import ssl
import os
import shutil

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

os.makedirs("scratch/audit", exist_ok=True)

with open("scratch/all_products_dump.json", "r", encoding="utf-8") as f:
    products = json.load(f)

print(f"Auditing {len(products)} products...")

results = []
for p in products:
    pid = p["id"]
    name = p["name"]
    cat = p["category"]
    img = p["image"]
    
    local_target = f"scratch/audit/p_{pid}_{cat}.jpg"
    status = "UNKNOWN"
    size = 0
    
    if img.startswith("images/"):
        if os.path.exists(img):
            size = os.path.getsize(img)
            shutil.copy(img, local_target)
            status = f"LOCAL_OK ({size} bytes)"
        else:
            status = "LOCAL_MISSING"
    else:
        try:
            req = urllib.request.Request(img, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
            with urllib.request.urlopen(req, context=ctx, timeout=6) as resp:
                data = resp.read()
                size = len(data)
                with open(local_target, "wb") as f_out:
                    f_out.write(data)
                status = f"REMOTE_OK ({size} bytes)"
        except Exception as e:
            status = f"FAILED: {e}"
            
    print(f"[ID {pid:02d}] [{cat.upper():16s}] {name:40s} -> {status}")
    results.append({"id": pid, "name": name, "category": cat, "image": img, "status": status, "size": size})

with open("scratch/audit_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("\nAudit complete! Results saved to scratch/audit_results.json")
