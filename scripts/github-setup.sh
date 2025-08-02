#!/bin/bash

# MediaTracker GitHub Setup Script
echo "🚀 Setting up MediaTracker for GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git branch -M main
else
    echo "✅ Git repository already exists"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment Variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/
out/

# Runtime files
*.log
logs/
*.pid
*.seed
*.pid.lock

# Database
*.sqlite
*.sqlite3
*.db

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# Replit specific
.replit
.replit.nix
replit.nix

# Temporary files
tmp/
temp/
.tmp/

# Cache
.cache/
.parcel-cache/

# TypeScript
*.tsbuildinfo
EOF
fi

# Add all files to git
echo "📦 Adding files to git..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: MediaTracker - Comprehensive media tracking platform

Features:
- Multi-media support (Anime, Movies, TV Shows, Manhwa, Novels)
- Gamification with points and achievements
- Enhanced context menus with platform links
- PostgreSQL database with Drizzle ORM
- React + TypeScript frontend
- Express.js backend
- Responsive design with Tailwind CSS"

echo "✅ Git setup complete!"
echo ""
echo "🔗 Next steps to push to GitHub:"
echo "1. Create a new repository on GitHub named 'mediatracker'"
echo "2. Run: git remote add origin https://github.com/yourusername/mediatracker.git"
echo "3. Run: git push -u origin main"
echo ""
echo "🌟 Your MediaTracker is ready for GitHub!"