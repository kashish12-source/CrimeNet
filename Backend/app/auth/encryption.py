from cryptography.fernet import Fernet


# Generate only once:
# print(Fernet.generate_key())

SECRET_ENCRYPTION_KEY = b'RV9u0-uf9uSmnD3cABHZpYSsB3JryrdDOzSVk66nTmY='

cipher = Fernet(SECRET_ENCRYPTION_KEY)


# Encrypt Notes
def encrypt_notes(note: str):

    encrypted_notes = cipher.encrypt(
        note.encode()
    )

    return encrypted_notes.decode()


# Decrypt Notes
def decrypt_notes(encrypted_notes: str):

    decrypted_notes = cipher.decrypt(
        encrypted_notes.encode()
    )

    return decrypted_notes.decode()