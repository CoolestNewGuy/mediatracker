# Moving MediaTracker to GitHub

Complete guide for transferring your MediaTracker project from Replit to GitHub.

## Quick Setup (Automated)

1. **Run the setup script:**
   ```bash
   ./scripts/github-setup.sh
   ```

2. **Create GitHub repository:**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it `mediatracker`
   - Keep it public or private as preferred
   - Don't initialize with README (we already have one)

3. **Connect and push:**
   ```bash
   git remote add origin https://github.com/YOURUSERNAME/mediatracker.git
   git push -u origin main
   ```

## Manual Setup (Step by Step)

### 1. Initialize Git Repository
```bash
git init
git branch -M main
```

### 2. Add Files to Git
```bash
git add .
git commit -m "Initial commit: MediaTracker platform"
```

### 3. Create GitHub Repository
- Visit [github.com/new](https://github.com/new)
- Repository name: `mediatracker`
- Description: "A comprehensive media tracking platform with gamification features"
- Choose public or private
- Don't add README, .gitignore, or license (we have them)
- Click "Create repository"

### 4. Connect Local to GitHub
```bash
git remote add origin https://github.com/YOURUSERNAME/mediatracker.git
git push -u origin main
```

## Project Structure Ready for GitHub

Your repository now includes:

### 📁 Core Application
- `client/` - React frontend with TypeScript
- `server/` - Express.js backend
- `shared/` - Shared types and schema
- `package.json` - Dependencies and scripts

### 📄 Documentation
- `README.md` - Comprehensive project overview
- `CONTRIBUTING.md` - Development guidelines
- `DEPLOYMENT.md` - Platform deployment guides
- `LICENSE` - MIT license

### 🔧 Configuration
- `.gitignore` - Git ignore rules
- `.env.example` - Environment variable template
- `drizzle.config.ts` - Database configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Styling configuration

### 🚀 Scripts
- `scripts/github-setup.sh` - Automated GitHub setup
- `scripts/deploy.sh` - Deployment helper

## Environment Variables for Production

When deploying to other platforms, you'll need:

```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-super-secret-session-key-here
NODE_ENV=production
PORT=5000
```

## Recommended Next Steps

### 1. Update Repository Settings
- Add repository description
- Add topics: `media-tracker`, `react`, `typescript`, `gamification`
- Configure branch protection rules
- Set up issue templates

### 2. Deploy to Production
Use the deployment helper:
```bash
./scripts/deploy.sh
```

Or follow platform-specific guides in `DEPLOYMENT.md`

### 3. Set Up CI/CD (Optional)
Create `.github/workflows/deploy.yml` for automatic deployments.

### 4. Database Setup
- Create production database (Neon, Railway, or Heroku Postgres)
- Run migrations: `npm run db:push`
- Import any existing data

## Platform-Specific Instructions

### Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Railway
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run npm run db:push
```

## Troubleshooting

### Git Issues
```bash
# If you get permission errors
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# If remote already exists
git remote remove origin
git remote add origin https://github.com/YOURUSERNAME/mediatracker.git
```

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Issues
```bash
# Reset database (careful: this deletes all data)
npm run db:push

# Check connection
node -e "console.log(process.env.DATABASE_URL)"
```

## Success! 🎉

Your MediaTracker is now ready for GitHub and production deployment. The complete platform includes:

- ✅ Full-featured media tracking
- ✅ Gamification system
- ✅ Enhanced context menus
- ✅ Production-ready code
- ✅ Comprehensive documentation
- ✅ Deployment scripts
- ✅ Open source ready

Happy tracking! 📚🎬🎮