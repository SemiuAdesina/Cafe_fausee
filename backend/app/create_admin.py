from app import create_app, db
from app.models import Admin

app = create_app()

if __name__ == "__main__":
    import getpass
    username = input("Enter admin username: ")
    password = getpass.getpass("Enter admin password: ")

    with app.app_context():
        if Admin.query.filter_by(username=username).first():
            print(f"Admin user '{username}' already exists.")
        else:
            admin = Admin(username=username)
            admin.set_password(password)
            db.session.add(admin)
            db.session.commit()
            print(f"Admin user '{username}' created successfully.") 