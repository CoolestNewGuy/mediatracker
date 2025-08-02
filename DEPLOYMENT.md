# Deployment Guide

This guide covers deploying MediaTracker to various platforms.

## Quick Deploy Options

### 1. Replit (Recommended for Development)
1. Import your GitHub repository to Replit
2. Replit will automatically detect the configuration
3. Set up environment variables in the Secrets tab
4. Click "Run" to start the application

### 2. Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add SESSION_SECRET
```

### 3. Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 4. Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set SESSION_SECRET=your-secret-here

# Deploy
git push heroku main
```

### 5. DigitalOcean App Platform
1. Connect your GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. Add environment variables in the dashboard
4. Deploy

## Environment Variables Setup

All platforms require these environment variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-super-secret-session-key
NODE_ENV=production
PORT=5000
```

### Database Setup

#### Option 1: Neon (Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

#### Option 2: Railway PostgreSQL
```bash
railway add postgresql
railway variables
# Copy the DATABASE_URL
```

#### Option 3: Heroku Postgres
```bash
heroku addons:create heroku-postgresql:hobby-dev
heroku config
# Copy the DATABASE_URL
```

## Build Configuration

### For Vercel
Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**/*",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ]
}
```

### For Railway
Railway automatically detects Node.js projects. No additional configuration needed.

### For Heroku
Create `Procfile`:
```
web: npm start
```

## Database Migration

After deploying, run the database migration:

```bash
# For Heroku
heroku run npm run db:push

# For Railway  
railway run npm run db:push

# For other platforms, run locally with production DATABASE_URL
npm run db:push
```

## Performance Optimization

### 1. Enable Compression
The application includes compression middleware for production.

### 2. Database Optimization
- Ensure proper indexing on frequently queried columns
- Use connection pooling (included with Neon)
- Consider read replicas for high traffic

### 3. CDN Configuration
Configure your CDN to cache static assets:
- Cache HTML files for 5 minutes
- Cache CSS/JS files for 1 year
- Cache images for 1 month

### 4. Environment-Specific Settings
```env
# Production optimizations
NODE_ENV=production
ENABLE_COMPRESSION=true
LOG_LEVEL=warn
```

## Monitoring

### Health Check Endpoint
The application includes a health check at `/api/health`:

```bash
curl https://your-app.com/api/health
# Response: {"status":"ok","timestamp":"2025-01-02T..."}
```

### Logging
Logs are output to stdout for easy integration with platform logging:
- Error logs for debugging
- Access logs for monitoring
- Performance metrics

## Security Checklist

- [ ] Set strong `SESSION_SECRET` (32+ random characters)
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Set secure environment variables
- [ ] Configure CORS if needed
- [ ] Enable rate limiting for production
- [ ] Regular security updates

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify `DATABASE_URL` is correct
   - Check network connectivity
   - Ensure database accepts connections

2. **Session Issues**
   - Verify `SESSION_SECRET` is set
   - Check session store configuration
   - Clear browser cookies

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Review build logs for specific errors

4. **Performance Issues**
   - Enable compression
   - Optimize database queries
   - Check for memory leaks

### Platform-Specific Issues

#### Vercel
- Functions timeout after 10 seconds on hobby plan
- File system is read-only (database required)

#### Heroku
- Free dynos sleep after 30 minutes
- Ephemeral file system (use database for storage)

#### Railway
- Resource limits apply to free tier
- Automatic deployments on git push

## Backup and Recovery

### Database Backups
```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

### Application Data Export
Use the admin interface or API to export user data:
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://your-app.com/api/admin/export
```

## Scaling Considerations

### Horizontal Scaling
- Use session store (Redis/PostgreSQL)
- Stateless application design
- Load balancer configuration

### Database Scaling
- Connection pooling
- Read replicas
- Query optimization
- Caching layer (Redis)

### CDN Integration
- Static asset caching
- Image optimization
- Geographic distribution