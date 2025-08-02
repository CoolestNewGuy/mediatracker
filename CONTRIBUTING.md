# Contributing to MediaTracker

Thank you for your interest in contributing to MediaTracker! This document provides guidelines and information for contributors.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/mediatracker.git
   cd mediatracker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Architecture

### Frontend (React + TypeScript)
- **Components**: Reusable UI components in `client/src/components/`
- **Pages**: Main page components in `client/src/pages/`
- **Hooks**: Custom React hooks in `client/src/hooks/`
- **State Management**: TanStack Query for server state, React hooks for local state

### Backend (Node.js + Express)
- **Routes**: API endpoints in `server/routes/`
- **Storage**: Data access layer in `server/storage.ts`
- **Database**: PostgreSQL with Drizzle ORM

### Shared Types
- **Schema**: Database schema and TypeScript types in `shared/schema.ts`

## Code Style Guidelines

### TypeScript
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper type annotations for function parameters and return types

### React
- Use functional components with hooks
- Prefer custom hooks for complex logic
- Use React.memo() for performance optimization when needed

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow the existing color scheme and design patterns
- Ensure responsive design for desktop and mobile

### Database
- Use Drizzle ORM for all database operations
- Write migrations using `drizzle-kit`
- Follow the existing schema patterns

## Feature Development

### Adding New Media Types
1. Update the schema in `shared/schema.ts`
2. Add UI components for the new type
3. Update the filtering and display logic
4. Add appropriate platform links in the context menu

### Adding New Gamification Features
1. Design the achievement/reward system
2. Update the database schema if needed
3. Implement backend logic in `storage.ts`
4. Create UI components for the feature
5. Update user statistics calculation

### External API Integration
1. Research the API and its rate limits
2. Add environment variables for API keys
3. Implement the API client with proper error handling
4. Cache responses appropriately
5. Update the UI to display external data

## Testing

Currently, the project focuses on manual testing. When adding new features:

1. Test all user flows manually
2. Verify database operations work correctly
3. Check responsive design on different screen sizes
4. Ensure error handling works properly

## Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the code style guidelines
   - Update documentation if needed
   - Test your changes thoroughly

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: descriptive commit message"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Create a pull request on GitHub
   - Provide a clear description of your changes
   - Reference any related issues

## Code Review Guidelines

### For Reviewers
- Check code style and consistency
- Verify functionality works as described
- Look for potential security issues
- Ensure proper error handling
- Check for performance implications

### For Contributors
- Respond to feedback promptly
- Make requested changes in separate commits
- Keep discussions focused and constructive

## Database Migrations

When modifying the database schema:

1. Update `shared/schema.ts`
2. Test the migration locally:
   ```bash
   npm run db:push
   ```
3. Document any breaking changes

## Performance Considerations

- **Frontend**: Use React.memo() and useMemo() judiciously
- **Backend**: Implement proper database indexing
- **Images**: Optimize image loading and caching
- **API Calls**: Implement proper caching strategies

## Security Guidelines

- Never commit sensitive data (API keys, passwords)
- Validate all user inputs
- Use parameterized queries for database operations
- Implement proper session management
- Follow OWASP security guidelines

## Questions and Support

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code Questions**: Comment on specific lines in pull requests

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks for major features or improvements

Thank you for contributing to MediaTracker! 🎬📚🎮