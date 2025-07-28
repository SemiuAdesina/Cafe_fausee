#!/bin/bash

# Minimal zip script for CafeFausse project
# This script will create a truly minimal zip file under 10MB

echo "Creating MINIMAL zip file for CafeFausse..."

# Remove any existing zip files
rm -f CafeFausse_minimal.zip
rm -f CafeFausse_ultra_clean.zip
rm -f CafeFausse_clean.zip

# Create a temporary directory for minimal files
TEMP_DIR="temp_minimal_project"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

echo "📁 Copying only essential files..."

# Copy root files (only the most important ones)
cp README.md "$TEMP_DIR/" 2>/dev/null || true
cp DEPLOYMENT.md "$TEMP_DIR/" 2>/dev/null || true

# Copy backend (only source code and essential config)
if [ -d "backend" ]; then
    mkdir -p "$TEMP_DIR/backend"
    cp -r backend/app "$TEMP_DIR/backend/" 2>/dev/null || true
    cp -r backend/migrations "$TEMP_DIR/backend/" 2>/dev/null || true
    cp backend/run.py "$TEMP_DIR/backend/" 2>/dev/null || true
    cp backend/requirements.txt "$TEMP_DIR/backend/" 2>/dev/null || true
    cp backend/config.py "$TEMP_DIR/backend/" 2>/dev/null || true
    cp backend/.env "$TEMP_DIR/backend/" 2>/dev/null || true
    cp backend/README.md "$TEMP_DIR/backend/" 2>/dev/null || true
    cp backend/.gitignore "$TEMP_DIR/backend/" 2>/dev/null || true
fi

# Copy frontend (only source code, no package-lock.json)
if [ -d "frontend" ]; then
    mkdir -p "$TEMP_DIR/frontend"
    cp -r frontend/src "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp -r frontend/public "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp frontend/package.json "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp frontend/vite.config.js "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp frontend/index.html "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp frontend/eslint.config.js "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp frontend/README.md "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp frontend/.gitignore "$TEMP_DIR/frontend/" 2>/dev/null || true
fi

# Copy other important files
cp cookies*.txt "$TEMP_DIR/" 2>/dev/null || true
cp .gitignore "$TEMP_DIR/" 2>/dev/null || true

# Remove any problematic files that might have been copied
find "$TEMP_DIR" -name ".DS_Store" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find "$TEMP_DIR" -name "*.pyc" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "*.log" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "*.tmp" -delete 2>/dev/null || true

echo "📦 Creating minimal zip..."

# Create zip from the minimal directory
cd "$TEMP_DIR"
zip -r ../CafeFausse_minimal.zip . -x "*.DS_Store" "*.pyc" "__pycache__/*" "*.log" "*.tmp"
cd ..

# Clean up temporary directory
rm -rf "$TEMP_DIR"

# Check the final size
if [ -f "CafeFausse_minimal.zip" ]; then
    size=$(du -h CafeFausse_minimal.zip | cut -f1)
    size_bytes=$(du -b CafeFausse_minimal.zip | cut -f1)
    
    echo ""
    echo "✅ MINIMAL zip file created: CafeFausse_minimal.zip"
    echo "📏 Size: $size ($size_bytes bytes)"
    echo ""
    
    if [ "$size_bytes" -lt 10485760 ]; then
        echo "🎯 SUCCESS! File is under 10MB (10,485,760 bytes)"
        echo "✅ Ready for submission!"
    else
        echo "⚠️  File is still over 10MB. Let's check what's taking up space..."
        echo "📊 Analyzing zip contents..."
        unzip -l CafeFausse_minimal.zip | head -20
    fi
    
    echo ""
    echo "📋 What's included:"
    echo "  ✅ All source code (React + Flask)"
    echo "  ✅ Essential configuration files"
    echo "  ✅ Documentation"
    echo "  ✅ Assets and images"
    echo "  ✅ Database migrations"
    echo ""
    echo "📋 What's excluded:"
    echo "  ❌ package-lock.json (114KB)"
    echo "  ❌ node_modules/ (182MB)"
    echo "  ❌ venv/ (54MB)"
    echo "  ❌ dist/ (36MB)"
    echo "  ❌ .git/ (37MB)"
    echo "  ❌ All cache and temporary files"
else
    echo "❌ Failed to create minimal zip file"
    exit 1
fi 