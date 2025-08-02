#!/bin/bash

# MediaTracker Deployment Script
echo "🚀 MediaTracker Deployment Helper"
echo "=================================="

# Function to show available deployment options
show_deployment_options() {
    echo "Available deployment platforms:"
    echo "1. Vercel (Recommended for frontend)"
    echo "2. Railway (Full-stack friendly)"
    echo "3. Heroku (Traditional option)"
    echo "4. DigitalOcean App Platform"
    echo "5. Replit (Development/Demo)"
    echo ""
}

# Function to validate environment variables
check_env_vars() {
    echo "🔍 Checking environment variables..."
    
    required_vars=("DATABASE_URL" "SESSION_SECRET")
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo "❌ Missing required environment variables:"
        printf '%s\n' "${missing_vars[@]}"
        echo ""
        echo "Please set these variables before deployment:"
        echo "export DATABASE_URL='your-database-url'"
        echo "export SESSION_SECRET='your-secret-key'"
        return 1
    else
        echo "✅ All required environment variables are set"
        return 0
    fi
}

# Function to build the application
build_app() {
    echo "🔨 Building application..."
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm not found. Please install Node.js"
        return 1
    fi
    
    echo "📦 Installing dependencies..."
    npm install
    
    echo "🏗️ Building for production..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build successful"
        return 0
    else
        echo "❌ Build failed"
        return 1
    fi
}

# Function to setup database
setup_database() {
    echo "🗄️ Setting up database..."
    
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ DATABASE_URL not set"
        return 1
    fi
    
    echo "🔄 Running database migrations..."
    npm run db:push
    
    if [ $? -eq 0 ]; then
        echo "✅ Database setup complete"
        return 0
    else
        echo "❌ Database setup failed"
        return 1
    fi
}

# Function for Vercel deployment
deploy_vercel() {
    echo "🌐 Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        echo "📦 Installing Vercel CLI..."
        npm i -g vercel
    fi
    
    echo "🚀 Starting Vercel deployment..."
    vercel --prod
    
    echo "📝 Don't forget to set environment variables in Vercel dashboard:"
    echo "- DATABASE_URL"
    echo "- SESSION_SECRET"
    echo "- NODE_ENV=production"
}

# Function for Railway deployment
deploy_railway() {
    echo "🚂 Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        echo "📦 Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    echo "🔐 Login to Railway..."
    railway login
    
    echo "🚀 Starting Railway deployment..."
    railway up
    
    echo "📝 Set environment variables in Railway dashboard:"
    echo "- SESSION_SECRET"
    echo "- NODE_ENV=production"
    echo "(DATABASE_URL will be auto-provided if you add PostgreSQL service)"
}

# Function for Heroku deployment
deploy_heroku() {
    echo "💜 Deploying to Heroku..."
    
    if ! command -v heroku &> /dev/null; then
        echo "❌ Heroku CLI not found. Please install it from: https://devcenter.heroku.com/articles/heroku-cli"
        return 1
    fi
    
    echo "🔐 Login to Heroku..."
    heroku login
    
    read -p "Enter your Heroku app name: " app_name
    
    echo "🆕 Creating Heroku app..."
    heroku create $app_name
    
    echo "🗄️ Adding PostgreSQL addon..."
    heroku addons:create heroku-postgresql:hobby-dev
    
    echo "🔐 Setting environment variables..."
    read -s -p "Enter SESSION_SECRET: " session_secret
    echo ""
    heroku config:set SESSION_SECRET="$session_secret"
    heroku config:set NODE_ENV=production
    
    echo "🚀 Deploying to Heroku..."
    git push heroku main
    
    echo "🔄 Running database migrations..."
    heroku run npm run db:push
}

# Main deployment function
main() {
    echo "Welcome to MediaTracker Deployment Helper!"
    echo ""
    
    show_deployment_options
    
    read -p "Choose deployment platform (1-5): " choice
    
    case $choice in
        1)
            if check_env_vars && build_app; then
                deploy_vercel
            fi
            ;;
        2)
            if check_env_vars && build_app; then
                deploy_railway
            fi
            ;;
        3)
            if build_app; then
                deploy_heroku
            fi
            ;;
        4)
            echo "📖 For DigitalOcean App Platform:"
            echo "1. Go to https://cloud.digitalocean.com/apps"
            echo "2. Connect your GitHub repository"
            echo "3. Set build command: npm run build"
            echo "4. Set run command: npm start"
            echo "5. Add environment variables in the dashboard"
            if check_env_vars && build_app; then
                echo "✅ Ready for DigitalOcean deployment"
            fi
            ;;
        5)
            echo "🔧 For Replit deployment:"
            echo "1. Import your GitHub repository to Replit"
            echo "2. Set environment variables in Secrets tab"
            echo "3. Click Run button"
            echo "✅ No additional setup needed for Replit"
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
}

# Run main function
main