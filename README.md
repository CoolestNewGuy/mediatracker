# MediaTracker

A comprehensive media tracking platform with gamification features designed to help users manage and track their entertainment consumption across multiple media types.

## Features

- **Multi-Media Support**: Track Anime, Movies, TV Shows, Manhwa, Novels, and Pornhwa
- **Progress Tracking**: Monitor episodes, chapters, seasons with detailed progress indicators
- **Gamification**: Points/coins system with daily login rewards (20→30→50→100→150→200→300)
- **Achievements & Leaderboards**: Unlock achievements and compete with other users
- **Smart Context Menus**: Right-click any media for platform-specific links (AniList, Crunchyroll, Netflix, Amazon, etc.)
- **User Profiles**: Customizable nicknames and profile management
- **Responsive Design**: Optimized for desktop with 1600px max-width layout
- **Real-time Search**: Fuzzy search across your entire library
- **Advanced Filtering**: Sort by status, type, rating, and update date

## Tech Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom dark theme
- **Shadcn/ui** component library built on Radix UI
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** with Drizzle ORM for type-safe database operations
- **Neon** serverless PostgreSQL database
- **Session-based authentication** with secure cookie management

### Infrastructure
- **Replit** for development and hosting
- **Database migrations** with Drizzle Kit
- **Environment-based configuration**

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Required environment variables (see .env.example)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mediatracker.git
cd mediatracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and other configuration
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express application
│   ├── routes/           # API route handlers
│   ├── db.ts            # Database connection
│   ├── storage.ts       # Data access layer
│   └── index.ts         # Server entry point
├── shared/               # Shared TypeScript types
│   └── schema.ts        # Database schema and types
└── drizzle.config.ts    # Database configuration
```

## API Endpoints

### Media Management
- `GET /api/media` - Get all media items with filtering
- `POST /api/media` - Create new media item
- `PUT /api/media/:id` - Update media item
- `DELETE /api/media/:id` - Delete media item
- `GET /api/media/in-progress` - Get currently watching/reading items

### User & Gamification
- `GET /api/auth/user` - Get current user
- `POST /api/daily-login` - Claim daily login reward
- `GET /api/user/points` - Get user points
- `GET /api/achievements` - Get user achievements
- `GET /api/stats` - Get user statistics

### External APIs
- `GET /api/search-external` - Search external APIs for media

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User profiles and authentication
- `media_items` - Media content and progress tracking
- `achievements` - Achievement definitions and user unlocks
- `user_stats` - Aggregated user statistics
- `daily_login_rewards` - Daily reward tracking
- `sessions` - User session management

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-session-secret-key
NODE_ENV=development
PORT=5000
```

## Deployment

The application is designed to work seamlessly on Replit and can be deployed to any Node.js hosting platform:

1. Set up environment variables on your hosting platform
2. Ensure PostgreSQL database is accessible
3. Run database migrations: `npm run db:push`
4. Start the application: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with love for media enthusiasts
- Inspired by MyAnimeList, AniList, and Goodreads
- UI components powered by Radix UI and Tailwind CSS