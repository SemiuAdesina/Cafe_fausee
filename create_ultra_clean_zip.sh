#!/bin/bash

# Ultra-clean zip script for CafeFausse project
# This script will create a minimal zip file excluding ALL large directories

echo "Creating ULTRA CLEAN zip file for CafeFausse..."

# Remove any existing zip files
rm -f CafeFausse_ultra_clean.zip
rm -f CafeFausse.zip

# First, let's check what we're actually including
echo "📊 Analyzing project structure..."

# Create a temporary directory for clean files
TEMP_DIR="temp_clean_project"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Copy only the essential files, excluding all problematic directories
echo "📁 Copying essential files..."

# Copy root files
cp README.md DEPLOYMENT.md "$TEMP_DIR/" 2>/dev/null || true

# Copy backend (excluding venv, __pycache__, etc.)
if [ -d "backend" ]; then
    mkdir -p "$TEMP_DIR/backend"
    cp -r backend/app "$TEMP_DIR/backend/" 2>/dev/null || true
    cp -r backend/migrations "$TEMP_DIR/backend/" 2>/dev/null || true
    cp -r backend/tests "$TEMP_DIR/backend/" 2>/dev/null || true
    cp backend/*.py "$TEMP_DIR/backend/" 2>/dev/null || true
    cp backend/*.txt "$TEMP_DIR/backend/" 2>/dev/null || true
    cp backend/*.md "$TEMP_DIR/backend/" 2>/dev/null || true
    cp backend/.env "$TEMP_DIR/backend/" 2>/dev/null || true
    cp backend/.gitignore "$TEMP_DIR/backend/" 2>/dev/null || true
fi

# Copy frontend (excluding node_modules, dist, etc.)
if [ -d "frontend" ]; then
    mkdir -p "$TEMP_DIR/frontend"
    cp -r frontend/src "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp -r frontend/public "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp frontend/*.json "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp frontend/*.js "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp frontend/*.html "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp frontend/*.md "$TEMP_DIR/frontend/" 2>/dev/null || true
    cp frontend/.gitignore "$TEMP_DIR/frontend/" 2>/dev/null || true
fi

# Copy other important files
cp cookies*.txt "$TEMP_DIR/" 2>/dev/null || true
cp .gitignore "$TEMP_DIR/" 2>/dev/null || true

# Remove any .DS_Store files that might have been copied
find "$TEMP_DIR" -name ".DS_Store" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find "$TEMP_DIR" -name "*.pyc" -delete 2>/dev/null || true

echo "📦 Creating zip from clean directory..."

# Create zip from the clean directory
cd "$TEMP_DIR"
zip -r ../CafeFausse_ultra_clean.zip . -x "*.DS_Store" "*.pyc" "__pycache__/*" "*.log" "*.tmp"
cd ..

# Clean up temporary directory
rm -rf "$TEMP_DIR"

# Check the final size
if [ -f "CafeFausse_ultra_clean.zip" ]; then
    size=$(du -h CafeFausse_ultra_clean.zip | cut -f1)
    echo ""
    echo "✅ ULTRA CLEAN zip file created: CafeFausse_ultra_clean.zip"
    echo "📏 Size: $size"
    echo ""
    echo "🎯 This should be well under 10MB for your submission!"
    echo ""
    echo "📋 What's included:"
    echo "  ✅ All source code (React + Flask)"
    echo "  ✅ Configuration files"
    echo "  ✅ Documentation"
    echo "  ✅ Assets and images"
    echo "  ✅ Database migrations"
    echo ""
    echo "📋 What's excluded:"
    echo "  ❌ node_modules/ (182MB)"
    echo "  ❌ venv/ (54MB)"
    echo "  ❌ dist/ (36MB)"
    echo "  ❌ .git/ (37MB)"
    echo "  ❌ All cache and temporary files"
else
    echo "❌ Failed to create ultra clean zip file"
    exit 1
fi 