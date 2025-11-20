#!/bin/bash
# Git Push Script
# Usage: ./git-push.sh "your commit message"

echo ""
echo "===================================="
echo "   Git Add, Commit, and Push"
echo "===================================="
echo ""

# Check if commit message is provided
if [ -z "$1" ]; then
    echo "Error: Please provide a commit message!"
    echo "Usage: ./git-push.sh \"your commit message\""
    exit 1
fi

# Add all changes
echo "[1/3] Adding all changes..."
git add .

# Commit with message
echo ""
echo "[2/3] Committing changes..."
git commit -m "$1"

# Push to origin main
echo ""
echo "[3/3] Pushing to origin main..."
git push origin main

echo ""
echo "===================================="
echo "   Done! ✓"
echo "===================================="
