# backend/auth.py
import time
import random
import secrets

OTP_STORE = {}       # { email: { otp, expires } }
SESSION_STORE = {}   # { token: { email, created } }

OTP_EXPIRY_SECONDS = 300  # 5 minutes


def generate_otp(email: str):
    otp = str(random.randint(100000, 999999))
    OTP_STORE[email] = {
        "otp": otp,
        "expires": time.time() + OTP_EXPIRY_SECONDS
    }
    return otp


def verify_otp(email: str, otp: str):
    data = OTP_STORE.get(email)
    if not data:
        return None

    if time.time() > data["expires"]:
        OTP_STORE.pop(email, None)
        return None

    if data["otp"] != otp:
        return None

    # OTP valid → create session
    token = secrets.token_hex(16)
    SESSION_STORE[token] = {
        "email": email,
        "created": time.time()
    }

    OTP_STORE.pop(email, None)
    return token


def get_user_from_token(token: str):
    session = SESSION_STORE.get(token)
    return session["email"] if session else None
