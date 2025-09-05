#!/bin/bash

echo "🚀 Deploying Exam Portal to Render..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run 'git init' first."
    exit 1
fi

# Check if files are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected. Committing them..."
    git add .
    git commit -m "Prepare for Render deployment"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No GitHub remote found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/your-repo.git"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Render will auto-detect render.yaml configuration"
echo "5. Click 'Apply' to deploy"
echo ""
echo "📋 Don't forget to:"
echo "- Add persistent disk (1GB minimum)"
echo "- Set environment variables if needed"
echo "- Check deployment logs"
echo ""
echo "🔗 Your app will be available at: https://your-app-name.onrender.com"
