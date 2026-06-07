import requests
import random

base_url = "http://127.0.0.1:8000"
rand_id = random.randint(1000, 9999)
email = f"testcitizen_{rand_id}@example.com"
password = "Password123!"

# 1. Register a new citizen user
register_payload = {
    "username": f"testcitizen_{rand_id}",
    "email": email,
    "password": password,
    "role": "citizen",
    "address": "Test Address 123",
    "phone_number": f"+91987654{rand_id}"
}

print(f"Registering user: {email}...")
reg_response = requests.post(f"{base_url}/auth/register", json=register_payload)
if reg_response.status_code != 200:
    print(f"Registration failed: {reg_response.status_code} - {reg_response.text}")
    exit(1)

print("Registration successful!")

# 2. Login to get the access token
login_payload = {
    "email": email,
    "password": password
}
print("Logging in...")
login_response = requests.post(f"{base_url}/auth/login", json=login_payload)
if login_response.status_code != 200:
    print(f"Login failed: {login_response.status_code} - {login_response.text}")
    exit(1)

token = login_response.json()["access_token"]
print("Login successful! Token acquired.")

# 3. Call the ID verification endpoint with file upload
headers = {
    "Authorization": f"Bearer {token}"
}
data = {
    "id_proof_type": "Aadhaar Card",
    "id_proof_number": "123456789012"
}
files = {
    "file": ("dummy.pdf", open("dummy.pdf", "rb"), "application/pdf")
}

print("Sending ID Verification request (multipart/form-data)...")
verify_response = requests.post(
    f"{base_url}/auth/citizen/verify-id",
    headers=headers,
    data=data,
    files=files
)

print(f"Status Code: {verify_response.status_code}")
print(f"Response Body: {verify_response.json() if verify_response.status_code == 200 else verify_response.text}")
