#!/bin/bash

# Submission-ready zip script for CafeFausse project
# This script will create a zip file under 10MB by excluding large images

echo "Creating SUBMISSION-READY zip file for CafeFausse..."

# Remove any existing zip files
rm -f CafeFausse_submission.zip
rm -f CafeFausse_minimal.zip
rm -f CafeFausse_ultra_clean.zip
rm -f CafeFausse_clean.zip

# Create a temporary directory for submission files
TEMP_DIR="temp_submission_project"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

echo "📁 Copying essential files (excluding large images)..."

# Copy root files
cp README.md "$TEMP_DIR/" 2>/dev/null || true
cp DEPLOYMENT.md "$TEMP_DIR/" 2>/dev/null || true

# Copy backend
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

# Copy frontend (excluding large images)
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
    
    # Remove large images from assets (keep only smaller ones)
    if [ -d "$TEMP_DIR/frontend/src/assets" ]; then
        echo "🗑️  Removing large images to reduce size..."
        rm -f "$TEMP_DIR/frontend/src/assets/about-chef-portrait.jpg"
        rm -f "$TEMP_DIR/frontend/src/assets/about-kitchen-action.jpg"
        rm -f "$TEMP_DIR/frontend/src/assets/about-team-collaboration.jpg"
        rm -f "$TEMP_DIR/frontend/src/assets/gallery-bar-area.jpg"
        rm -f "$TEMP_DIR/frontend/src/assets/gallery-private-dining.jpg"
        rm -f "$TEMP_DIR/frontend/src/assets/gallery-seasonal-decor.jpg"
        rm -f "$TEMP_DIR/frontend/src/assets/gallery-special-event.webp"
        rm -f "$TEMP_DIR/frontend/src/assets/home-cafe-fausse.webp"
        
        echo "✅ Kept smaller images for functionality"
    fi
fi

# Copy other important files
cp cookies*.txt "$TEMP_DIR/" 2>/dev/null || true
cp .gitignore "$TEMP_DIR/" 2>/dev/null || true

# Remove any problematic files
find "$TEMP_DIR" -name ".DS_Store" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find "$TEMP_DIR" -name "*.pyc" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "*.log" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "*.tmp" -delete 2>/dev/null || true

echo "📦 Creating submission zip..."

# Create zip from the submission directory
cd "$TEMP_DIR"
zip -r ../CafeFausse_submission.zip . -x "*.DS_Store" "*.pyc" "__pycache__/*" "*.log" "*.tmp"
cd ..

# Clean up temporary directory
rm -rf "$TEMP_DIR"

# Check the final size
if [ -f "CafeFausse_submission.zip" ]; then
    size=$(du -h CafeFausse_submission.zip | cut -f1)
    size_bytes=$(du -k CafeFausse_submission.zip | cut -f1)
    
    echo ""
    echo "✅ SUBMISSION zip file created: CafeFausse_submission.zip"
    echo "📏 Size: $size ($size_bytes KB)"
    echo ""
    
    if [ "$size_bytes" -lt 10240 ]; then
        echo "🎯 SUCCESS! File is under 10MB (10,240 KB)"
        echo "✅ Ready for submission!"
    else
        echo "⚠️  File is still over 10MB. Size: $size_bytes KB"
        echo "📊 Analyzing zip contents..."
        unzip -l CafeFausse_submission.zip | head -20
    fi
    
    echo ""
    echo "📋 What's included:"
    echo "  ✅ All source code (React + Flask)"
    echo "  ✅ Essential configuration files"
    echo "  ✅ Documentation"
    echo "  ✅ Smaller images (for functionality)"
    echo "  ✅ Database migrations"
    echo ""
    echo "📋 What's excluded:"
    echo "  ❌ Large images (>1MB each)"
    echo "  ❌ package-lock.json (114KB)"
    echo "  ❌ node_modules/ (182MB)"
    echo "  ❌ venv/ (54MB)"
    echo "  ❌ dist/ (36MB)"
    echo "  ❌ .git/ (37MB)"
    echo "  ❌ All cache and temporary files"
    echo ""
    echo "💡 Note: Large images were removed to meet submission size limit."
    echo "   The application will still function with placeholder images."
else
    echo "❌ Failed to create submission zip file"
    exit 1
fi 