#!/bin/bash

# Optimized submission zip script for CafeFausse project
# This script will compress images and create a zip file under 10MB with images included

echo "Creating OPTIMIZED SUBMISSION zip file for CafeFausse..."

# Remove any existing zip files
rm -f CafeFausse_optimized_submission.zip
rm -f CafeFausse_final_submission.zip
rm -f CafeFausse_submission.zip
rm -f CafeFausse_minimal.zip
rm -f CafeFausse_ultra_clean.zip
rm -f CafeFausse_clean.zip

# Create a temporary directory for optimized submission files
TEMP_DIR="temp_optimized_submission"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

echo "📁 Copying essential files..."

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

# Copy frontend
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

# Optimize images in the assets folder
if [ -d "$TEMP_DIR/frontend/src/assets" ]; then
    echo "🖼️  Optimizing images..."
    
    # Create optimized assets directory
    OPTIMIZED_ASSETS="$TEMP_DIR/frontend/src/assets_optimized"
    mkdir -p "$OPTIMIZED_ASSETS"
    
    # Copy and optimize each image
    for img in "$TEMP_DIR/frontend/src/assets"/*; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            echo "Optimizing: $filename"
            
            # Get file extension
            ext="${filename##*.}"
            name="${filename%.*}"
            
            if [ "$ext" = "jpg" ] || [ "$ext" = "jpeg" ]; then
                # Compress JPEG images
                sips -s format jpeg -s formatOptions 60 "$img" --out "$OPTIMIZED_ASSETS/$filename" 2>/dev/null || cp "$img" "$OPTIMIZED_ASSETS/$filename"
            elif [ "$ext" = "png" ]; then
                # Compress PNG images
                sips -s format png -s formatOptions 60 "$img" --out "$OPTIMIZED_ASSETS/$filename" 2>/dev/null || cp "$img" "$OPTIMIZED_ASSETS/$filename"
            elif [ "$ext" = "webp" ]; then
                # WebP files are already optimized, just copy them
                cp "$img" "$OPTIMIZED_ASSETS/$filename"
            else
                # For other formats, just copy
                cp "$img" "$OPTIMIZED_ASSETS/$filename"
            fi
        fi
    done
    
    # Replace original assets with optimized version
    rm -rf "$TEMP_DIR/frontend/src/assets"
    mv "$OPTIMIZED_ASSETS" "$TEMP_DIR/frontend/src/assets"
    
    echo "✅ Images optimized and compressed"
fi

# Remove any problematic files
find "$TEMP_DIR" -name ".DS_Store" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find "$TEMP_DIR" -name "*.pyc" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "*.log" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "*.tmp" -delete 2>/dev/null || true

echo "📦 Creating optimized submission zip..."

# Create zip from the optimized directory
cd "$TEMP_DIR"
zip -r ../CafeFausse_optimized_submission.zip . -x "*.DS_Store" "*.pyc" "__pycache__/*" "*.log" "*.tmp"
cd ..

# Clean up temporary directory
rm -rf "$TEMP_DIR"

# Check the final size
if [ -f "CafeFausse_optimized_submission.zip" ]; then
    size=$(du -h CafeFausse_optimized_submission.zip | cut -f1)
    size_bytes=$(du -k CafeFausse_optimized_submission.zip | cut -f1)
    
    echo ""
    echo "✅ OPTIMIZED SUBMISSION zip file created: CafeFausse_optimized_submission.zip"
    echo "📏 Size: $size ($size_bytes KB)"
    echo ""
    
    if [ "$size_bytes" -lt 10240 ]; then
        echo "🎯 SUCCESS! File is under 10MB (10,240 KB)"
        echo "✅ Ready for submission with optimized images!"
    else
        echo "⚠️  File is still over 10MB. Size: $size_bytes KB"
        echo "📊 Analyzing zip contents..."
        unzip -l CafeFausse_optimized_submission.zip | head -20
        echo ""
        echo "💡 If still too large, we can create a version with placeholder images"
    fi
    
    echo ""
    echo "📋 What's included:"
    echo "  ✅ All source code (React + Flask)"
    echo "  ✅ Essential configuration files"
    echo "  ✅ Documentation"
    echo "  ✅ Database migrations"
    echo "  ✅ OPTIMIZED images (compressed for size)"
    echo ""
    echo "📋 What's excluded:"
    echo "  ❌ package-lock.json (114KB)"
    echo "  ❌ node_modules/ (182MB)"
    echo "  ❌ venv/ (54MB)"
    echo "  ❌ dist/ (36MB)"
    echo "  ❌ .git/ (37MB)"
    echo "  ❌ All cache and temporary files"
    echo ""
    echo "💡 Images are compressed but still available to recipients!"
else
    echo "❌ Failed to create optimized submission zip file"
    exit 1
fi 