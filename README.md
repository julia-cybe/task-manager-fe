# Task Manager Frontend

A modern task management application built with React, TypeScript, Vite, and Tailwind CSS. This application provides a clean, responsive interface for managing tasks with full CRUD operations.

## 🚀 Tech Stack

- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Fast unit testing framework
- **Axios** - HTTP client for API calls
- **ESLint** - Code linting and formatting

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## 🏗️ Architecture & Best Practices

This project follows modern React development best practices as demonstrated in the codebase:

### 1. **TypeScript First Approach**
- Strict type definitions for all data structures
- Interface-based component props
- Type guards for runtime type checking
- Proper error handling with typed responses

### 2. **Component Design Patterns**
- **Composition over inheritance**: Components are composed of smaller, reusable pieces
- **Props interface definitions**: Every component has clearly defined prop interfaces
- **Controlled components**: Form inputs are controlled with React state
- **Separation of concerns**: Logic separated from presentation

### 3. **State Management**
- Local state with `useState` for component-specific data
- Form validation state management
- Loading states for async operations
- Error boundary patterns

### 4. **API Integration**
- **Service layer pattern**: All API calls centralized in `taskService.ts`
- **Axios interceptors**: Global error handling and request configuration
- **Type-safe API responses**: All API responses are properly typed
- **Error handling**: Comprehensive error handling with user-friendly messages

### 5. **Testing Strategy**
- **Unit tests**: Components tested in isolation
- **Integration tests**: User interaction testing with Testing Library
- **Mock dependencies**: Services and external dependencies mocked
- **Accessibility testing**: ARIA roles and labels tested

### 6. **Code Quality**
- **ESLint configuration**: Strict linting rules for code consistency
- **TypeScript strict mode**: Enhanced type checking
- **Consistent naming**: camelCase for variables, PascalCase for components
- **File organization**: Clear separation by feature and type

## 🛠️ Development Guidelines

### Component Development Best Practices

#### 1. **Component Structure**
```tsx
// ✅ Good: Well-structured component with clear interfaces
interface TaskFormProps {
  mode: 'create' | 'edit'
  initialTask?: Task
  onSubmit: (taskData: Omit<Task, 'id'>) => void
  onCancel: () => void
  isLoading?: boolean
}

export const TaskForm = ({ mode, initialTask, onSubmit, onCancel, isLoading = false }: TaskFormProps) => {
  // Component implementation
}
```

#### 2. **Form Handling**
- Use controlled components for all form inputs
- Implement client-side validation before submission
- Handle loading states during async operations
- Provide clear error messages to users

#### 3. **Type Safety**
```tsx
// ✅ Type definitions
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
  id: number
  title: string
  description?: string
  status: Status
  dueDate?: string
}
```

#### 4. **Service Layer Pattern**
```tsx
// ✅ Centralized API service
export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await apiClient.get<Task[]>('')
      return response.data
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      throw new Error('Failed to fetch tasks')
    }
  }
}
```

### Testing Best Practices

#### 1. **Component Testing**
```tsx
// ✅ Comprehensive component testing
describe('TaskForm', () => {
  it('should render empty form for creating new task', () => {
    render(
      <TaskForm
        mode="create"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )
    // Test assertions
  })
})
```

#### 2. **Testing Patterns**
- Test user interactions, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Mock external dependencies
- Test error states and edge cases

### Code Organization

#### 1. **File Naming Conventions**
- Components: `PascalCase.tsx` (e.g., `TaskForm.tsx`)
- Services: `camelCase.ts` (e.g., `taskService.ts`)
- Types: `PascalCase.ts` (e.g., `Task.ts`)
- Tests: `ComponentName.test.tsx`

#### 2. **Import Organization**
```tsx
// ✅ Import order
import { useState, useEffect } from 'react'  // React imports first
import axios from 'axios'                    // Third-party libraries
import type { Task } from '../types/Task'    // Local type imports
import { taskService } from '../services'   // Local service imports
```

## 🔧 Setup and Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run lint         # Lint code
npm run preview      # Preview production build
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server with hot reload |
| `build` | Build optimized production bundle |
| `test` | Run unit tests with Vitest |
| `test:ui` | Run tests with interactive UI |
| `lint` | Run ESLint for code quality checks |
| `preview` | Preview production build locally |

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific configurations:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## 🚀 Deployment

### Build Optimization
```bash
npm run build
```

The build process:
1. TypeScript compilation with strict type checking
2. Vite bundling with tree-shaking
3. CSS optimization with Tailwind's purge
4. Asset optimization and minification

### Production Checklist
- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] Accessibility tested
- [ ] Performance optimized
- [ ] Tests passing

## 🤝 Contributing

### Code Style Guidelines
1. **Use TypeScript strictly** - No `any` types allowed
2. **Component naming** - Use descriptive, PascalCase names
3. **Props destructuring** - Destructure props in function signature
4. **Error handling** - Always handle promise rejections
5. **Testing** - Write tests for new components and functions
6. **Documentation** - Update README for significant changes

### Git Workflow
1. Create feature branch from `main`
2. Write tests for new functionality
3. Ensure all tests pass
4. Run linting and fix any issues
5. Create pull request with descriptive title
6. Request code review

## 📚 Learning Resources

Based on the patterns used in this codebase:

- [React Documentation](https://react.dev/) - Official React docs
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [Vite Guide](https://vitejs.dev/guide/) - Vite configuration and optimization
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing best practices
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework

## 🐛 Troubleshooting

### Common Issues

**Build failures:**
- Check TypeScript errors: `npm run build`
- Verify all imports are correct
- Ensure no unused variables (ESLint will catch these)

**Test failures:**
- Check mock implementations
- Verify component props match interfaces
- Ensure async operations are properly awaited

**Development server issues:**
- Clear node_modules and reinstall
- Check port conflicts (default: 5173)
- Verify environment variables are set correctly
