from app.db.session import SessionLocal
from app.models.entities import User
from app.services.auth import hash_password

def fix_all_passwords():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for user in users:
            print(f"User ID: {user.id}, Username: {user.username}, Password: {user.password}")
            if not user.password.startswith("$2b$") or len(user.password) != 60:
                print(f"  -> Fixing password for user {user.username}...")
                user.password = hash_password("admin123")
            elif user.password == "$2b$12$replace_with_hash":
                print(f"  -> Replacing placeholder password for user {user.username}...")
                user.password = hash_password("admin123")
        
        db.commit()
        print("All passwords fixed!")
    except Exception as e:
        print("Error:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_all_passwords()
