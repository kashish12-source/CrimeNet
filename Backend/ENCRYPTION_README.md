# Encryption Setup Instructions

Since when the officer sends the notes to the investigation book, it needs to be encrypted and confidential. For this encryption, we use the `cryptography` library.

### Key Generation

While using `cryptography`, you need to generate the secret key only once and then paste that key into `secret_encrypt_key`.

You can get this key by pasting the following in the python terminal:

```python
from cryptography.fernet import Fernet
print(Fernet.generate_key()) 
```
