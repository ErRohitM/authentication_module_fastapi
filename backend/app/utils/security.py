from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def validate_password_strength(password: str) -> bool:
    """
    Validates that password meets complexity requirements:
    - At least 12 characters
    - Mix of uppercase and lowercase
    - Contains numbers and symbols
    """
    if len(password) < 12:
        return False

    has_uppercase = any(c.isupper() for c in password)
    has_lowercase = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(not c.isalnum() for c in password)

    return has_uppercase and has_lowercase and has_digit and has_special