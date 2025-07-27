#!/usr/bin/env python3
"""
Database migration script for Render deployment
Run this script on Render to create the database tables
"""

import os
from app import create_app, db

def migrate_database():
    """Create all database tables"""
    try:
        app = create_app()
        with app.app_context():
            # Create all tables
            db.create_all()
            print("✅ Database tables created successfully!")
            
            # Test the connection
            from sqlalchemy import text
            result = db.session.execute(text('SELECT 1'))
            print("✅ Database connection test successful!")
            
            # Check if newsletter table exists
            try:
                from app.models.newsletter import Newsletter
                count = Newsletter.query.count()
                print(f"✅ Newsletter table exists with {count} records")
            except Exception as e:
                print(f"⚠️ Newsletter table check: {e}")
                
    except Exception as e:
        print(f"❌ Database migration failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Starting database migration...")
    success = migrate_database()
    if success:
        print("🎉 Database migration completed successfully!")
    else:
        print("💥 Database migration failed!")
        exit(1) 