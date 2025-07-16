# Eisenhower Matrix - SaaS Task Manager

## Project Overview
A modern, professional SaaS application for task prioritization using the Eisenhower Decision Matrix framework. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## Development Setup

### Prerequisites
- [Bun](https://bun.sh) (latest version)
- Node.js 18+ (if using npm/yarn)

### Installation
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Available Scripts

### Development
```bash
bun run dev          # Start development server (http://localhost:3000)
bun run build        # Build for production
bun run preview      # Preview production build
```

### Code Quality
```bash
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript compiler check
```

## Project Structure

```
src/
├── auth/              # Authentication system
│   ├── AuthContext.tsx    # Auth state management
│   ├── AuthPage.tsx       # Main auth page layout
│   ├── LoginForm.tsx      # Login form component
│   ├── RegisterForm.tsx   # Registration form
│   └── ForgotPasswordForm.tsx # Password reset form
├── components/        # Reusable UI components
│   ├── ui/               # Shadcn/UI components
│   ├── landing/          # Landing page components
│   ├── Matrix.tsx        # Main Eisenhower Matrix
│   ├── Quadrant.tsx      # Individual quadrant component
│   ├── TaskItem.tsx      # Task card component
│   ├── TaskForm.tsx      # Task creation/editing form
│   └── ...
├── pages/             # Main application pages
│   ├── LandingPage.tsx   # Marketing/homepage
│   └── Dashboard.tsx     # Main app dashboard
├── utils/             # Utility functions
│   ├── storage.ts        # Local storage helpers
│   └── localStorage.ts   # Data persistence
├── types.ts           # TypeScript type definitions
└── main.tsx          # Application entry point
```

## Technology Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality component library

### Development Tools
- **Bun** - Fast JavaScript runtime and package manager
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing and optimization

## Design System

### Color Palette
- **Primary**: Indigo (500-600) to Purple (500-600) gradients
- **Success**: Green (500-600) for completed tasks
- **Warning**: Amber (500-600) for urgent tasks
- **Error**: Red (500-600) for high priority and errors
- **Neutral**: Gray scale (50-900) for text and backgrounds

### Typography
- **Headings**: Bold (700-900) weights for hierarchy
- **Body**: Regular (400-500) for readability
- **Labels**: Semibold (600) for form labels and UI elements

### Component Standards
- **Rounded Corners**: xl (12px) for cards, lg (8px) for buttons
- **Shadows**: Layered shadow system for depth
- **Spacing**: Consistent 4px grid system
- **Animations**: 200ms transitions for smooth interactions

## Development Guidelines

### Code Style
- Use TypeScript for all new components
- Follow React functional component patterns
- Use Tailwind CSS for styling
- Implement proper error handling
- Add proper TypeScript types for all props and state

### Component Structure
```typescript
interface ComponentProps {
  // Define all props with proper types
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    <div className="tailwind-classes">
      {/* Component JSX */}
    </div>
  );
}
```

### State Management
- Use React Context for global state (auth, theme)
- Use local state for component-specific data
- Implement proper error boundaries
- Use localStorage for data persistence

### Performance Best Practices
- Use React.memo for pure components
- Implement useMemo for expensive calculations
- Use useCallback for event handlers
- Implement proper key props for lists

## Features

### Core Functionality
- **Eisenhower Matrix**: Organize tasks by urgency and importance
- **Drag & Drop**: Intuitive task movement between quadrants
- **Task Management**: Create, edit, delete, and complete tasks
- **Search & Filter**: Advanced filtering by priority, completion status
- **Export Options**: CSV and PDF export capabilities
- **Statistics Dashboard**: Track productivity and completion rates

### Authentication System
- **Secure Login/Register**: Professional auth forms with validation
- **Password Reset**: Forgot password functionality
- **User Profiles**: Account management and plan information
- **Protected Routes**: Secure access to dashboard features

### SaaS Features
- **Free & Pro Plans**: Tiered subscription model
- **Upgrade Prompts**: Strategic pro feature showcasing
- **User Management**: Profile settings and account controls
- **Data Persistence**: Local storage with export capabilities

## Testing

### Test Demo User Accounts
```javascript
// Use these credentials for testing
const demoUsers = [
  { email: 'demo@example.com', password: 'demo123' },
  { email: 'pro@example.com', password: 'pro123' }
];
```

## Deployment

### Build Process
```bash
# Build for production
bun run build

# Preview build locally
bun run preview
```

### Performance Metrics
- **Bundle Size**: ~405KB (gzipped: ~125KB)
- **CSS Size**: ~61KB (gzipped: ~10KB)
- **Build Time**: ~2.2s average
- **Dev Server**: Hot reload in <100ms

## Troubleshooting

### Common Issues
1. **Port 3000 in use**: Change port in `vite.config.ts`
2. **TypeScript errors**: Run `bun run type-check`
3. **Build failures**: Check for linting errors with `bun run lint`

### Development Tips
- Use React DevTools for debugging
- Check browser console for errors
- Use proper TypeScript types to catch errors early
- Test responsive design on multiple screen sizes

## Future Enhancements

### Planned Features
- **Backend Integration**: API development and database
- **Real-time Sync**: Multi-device task synchronization
- **Team Features**: Collaboration and shared matrices
- **Advanced Analytics**: Detailed productivity insights
- **Mobile App**: Native iOS and Android applications
- **Integrations**: Calendar, email, and productivity tool connections

### Performance Optimizations
- Code splitting and lazy loading
- Service worker for offline support
- Image optimization
- Bundle size optimization

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Make changes following project guidelines
3. Run tests and linting
4. Submit pull request with clear description

### Code Quality
- Follow TypeScript best practices
- Maintain consistent code style
- Add proper error handling
- Write meaningful commit messages

---

**Built with ❤️ using Bun, React, TypeScript, and Tailwind CSS**