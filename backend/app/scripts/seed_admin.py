import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.db.session import SessionLocal
from app.models.entities import User
from app.services.auth import hash_password


def seed_admin():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == "admin").first()

        if not user:
            print("User admin tidak ditemukan. Membuat user baru...")
            user = User(
                username="admin",
                email="admin@dkmjny.local",
                password=hash_password("admin123"),
                role="Admin",
            )
            db.add(user)
        else:
            print(f"User admin ditemukan (id={user.id}). Mengupdate password...")
            user.password = hash_password("admin123")

        db.commit()
        print("[OK] Password admin berhasil di-set ke: admin123")
        print(f"   Username : admin")
        print(f"   Email    : {user.email}")
        print(f"   Role     : {user.role}")

    except Exception as e:
        print(f"[ERROR] {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()
