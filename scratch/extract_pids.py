import urllib.request
import re
import ssl

redirect_urls = [
    # Watercolor sources
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFqv8NivaxvAWWhMeKAkwSqAreKCqb4ZNc0sIvmCo4TnwiS-MjrpZ2AfzE2Xo2umbC2aqyE-lwVv5EHCYLNISuDbM4GpBuJPA32-nzoqTrwdWl-WXTqMAiayRunJNo15X3TDx98qkdP_Olni11ZmmamtY0jdPXq4nyv7TNWwFPENg5dV-RwpIHDc3-dKIj6pg==",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEtWsuBdxrP-gTJZpbke7KptlOyznTw8Ujhy_nyzU1zjfQ0kNvKyOuQ_tCBevBHpawA2JXUUHr07BqTz5KWTN1i9I46xbwV374K6saPtALjORADVfIADwwMS82L-Bxp-8fvZ5E6iOQSjxkf1s1kcjIwKIcB1suLCs6AmqncURBuONxtdZTGAfHBrwirb3W2EirKYdkx3hpl",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHrwDGxCuat3mkjOMNN0LuAmR49kDzx1PyFSC1jIokSfYcPZWzxPrGZ2y6IJte4WwUFmlWB7_XRRTkfvmsBHbFCyMTZZ8ucMUz-88VmWAoXMIDE-9OqadCM58bqOnS5RRx_uZfvRQoBidSDFltMG4zmjyy_BQKykN8ovwHNCcBlrqRQ5u8gvwxkfGo=",
    
    # Pottery sources
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFM8UDoTMMRuRiMHCQ6zboNbxbnFrXwDAHK6hQV1Ly5VTnT9BZInmk1WcuIhQicCkjNvgdBUB9iO3n_aekGSE-Fkxt74iKrnoBPvvhoLhNI8j-9bSKFdQLPk-DSiSD8AutMEDIKeajL4rjo1IM-Ii4XLBeY6ug1MIMisMYxdfjMwKc7",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFPKPTF2WGD9c28rYd1FR4XTvxHkicHtCqeyG6ndXHRePCIrGdk4sUay8fr6fFPAJONV9l-ahVu9jx3WKC-O5loo48XuUx4ah3mPI_cGDOLwqjbG0HQFvqXOsSECJFsUwXSUGlnbyJ7h4APcpQoQBqN-rbePiG0zi1stZxjY-8uCNKtSONiLGGM6IQr",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFNiXygHM-w9r6xQNXKXdYSyL-3a-h94n4oeAuEEkd54iNpOjK8l4eCsfc7NaXE1ToBPFiv6Y_bRUdqEQI8PEEMbCtUPIahG21mekKO8mqlZq3zmfVacJ3s6R9o-zUHCYpeapfCujlHFcED6jkoZVGCD-_2C_8xqPr2TJngzlmto56T3999hL4mDqQ="
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

for u in redirect_urls:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, timeout=10, context=ctx) as res:
            final_url = res.geturl()
            print(f"Final URL: {final_url}")
            photo_id_match = re.search(r'photos/[^/]*?-([0-9a-zA-Z_\-]+)', final_url) or re.search(r'photos/([0-9a-zA-Z_\-]+)', final_url)
            if photo_id_match:
                pid = photo_id_match.group(1)
                print(f"  -> Extracted Photo ID: {pid}")
    except Exception as e:
        print(f"Error: {e}")
