import urllib.request
import urllib.parse
import json
import ssl

q = "Vijay"
url = f"https://nominatim.openstreetmap.org/search?format=json&q={urllib.parse.quote(q)}&countrycodes=in&viewbox=74.0,26.9,82.8,21.0&bounded=1&limit=8"
print(f"URL: {url}")

req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "CrimeNet-MP-App-Backend/1.0 (contact: admin@crimenet.mp.gov.in)",
        "Accept-Language": "en-US,en;q=0.9"
    }
)

try:
    print("Sending request with default SSL context...")
    with urllib.request.urlopen(req, timeout=5) as response:
        data = json.loads(response.read().decode("utf-8"))
        print(f"Success! Data count: {len(data)}")
        print(json.dumps(data[:2], indent=2))
except Exception as e:
    print(f"Error: {e}")

try:
    print("\nSending request with unverified SSL context...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    with urllib.request.urlopen(req, timeout=5, context=ctx) as response:
        data = json.loads(response.read().decode("utf-8"))
        print(f"Success (unverified SSL)! Data count: {len(data)}")
except Exception as e:
    print(f"Error (unverified SSL): {e}")
