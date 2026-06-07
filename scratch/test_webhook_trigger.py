import requests
import random

base_url = "http://127.0.0.1:8000"
rand_id = random.randint(1000, 9999)
email = f"citizen_{rand_id}@example.com"
password = "Password123!"

# 1. Register a new citizen user
register_payload = {
    "username": f"citizen_{rand_id}",
    "email": email,
    "password": password,
    "role": "citizen",
    "address": "Bhopal, Madhya Pradesh",
    "phone_number": f"+91987654{rand_id}"
}

print(f"Registering citizen: {email}...")
reg_res = requests.post(f"{base_url}/auth/register", json=register_payload)
if reg_res.status_code != 200:
    print(f"Registration failed: {reg_res.status_code} - {reg_res.text}")
    exit(1)

# 2. Login to get token
login_payload = {
    "email": email,
    "password": password
}
print("Logging in...")
login_res = requests.post(f"{base_url}/auth/login", json=login_payload)
if login_res.status_code != 200:
    print(f"Login failed: {login_res.status_code} - {login_res.text}")
    exit(1)

token = login_res.json()["access_token"]
headers = {
    "Authorization": f"Bearer {token}"
}

# 3. Report a crime (mutipart/form-data)
data = {
    "title": "Stolen Vehicle near Square",
    "description": "A silver sedan was stolen by two unidentified men who broke the window lock.",
    "location": "Vijay Nagar",
    "latitude": "22.75",
    "longitude": "75.88",
    "zone": "West Zone (Indore)"
}

print("Reporting crime...")
crime_res = requests.post(
    f"{base_url}/crime/crime",
    headers=headers,
    data=data
)

print(f"Status: {crime_res.status_code}")
if crime_res.status_code == 200:
    print("Crime reported successfully!")
    print(crime_res.json())
else:
    print(f"Failed to report crime: {crime_res.text}")
