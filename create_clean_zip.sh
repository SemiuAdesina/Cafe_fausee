#!/bin/bash

# Script to create a clean zip file for CafeFausse project
# This will exclude all large directories and unnecessary files

echo "Creating clean zip file for CafeFausse..."

# Remove any existing zip file
if [ -f "CafeFausse_clean.zip" ]; then
    rm "CafeFausse_clean.zip"
    echo "Removed existing zip file"
fi

# Create zip file excluding large directories and files
zip -r CafeFausse_clean.zip . \
    -x "node_modules/*" \
    -x "frontend/node_modules/*" \
    -x "backend/venv/*" \
    -x "venv/*" \
    -x ".venv/*" \
    -x "frontend/dist/*" \
    -x "dist/*" \
    -x "build/*" \
    -x ".git/*" \
    -x "*.pyc" \
    -x "__pycache__/*" \
    -x "*.DS_Store" \
    -x ".DS_Store" \
    -x "*.log" \
    -x "logs/*" \
    -x "instance/*" \
    -x "backend/instance/*" \
    -x "*.tmp" \
    -x "*.temp" \
    -x ".vscode/*" \
    -x ".idea/*" \
    -x "*.swp" \
    -x "*.swo" \
    -x "*.tgz" \
    -x ".npm/*" \
    -x "coverage/*" \
    -x "jspm_packages/*" \
    -x ".mypy_cache/*" \
    -x ".pyre/*" \
    -x ".pytype/*" \
    -x "cython_debug/*"

# Check the size of the created zip file
if [ -f "CafeFausse_clean.zip" ]; then
    size=$(du -h CafeFausse_clean.zip | cut -f1)
    echo "✅ Clean zip file created: CafeFausse_clean.zip (Size: $size)"
    echo "📦 This should be much smaller than the original 352MB file"
else
    echo "❌ Failed to create zip file"
    exit 1
fi

echo ""
echo "🎉 Your submission-ready zip file is ready!"
echo "📁 File: CafeFausse_clean.zip"
echo "📏 Size: $size"
echo ""
echo "This zip file excludes:"
echo "  • node_modules/ (182MB)"
echo "  • venv/ (54MB)" 
echo "  • dist/ (36MB)"
echo "  • .git/ (37MB)"
echo "  • Other unnecessary files" 