import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Home } from './Home'

// Mock TaskList component since we're testing the Home page in isolation
vi.mock('../components/TaskList', () => ({
  TaskList: () => <div data-testid="task-list">Mocked TaskList</div>
}))

describe('Home', () => {
  it('should render page title', () => {
    render(<Home />)

    expect(screen.getByText('Task Manager')).toBeInTheDocument()
  })

  it('should render TaskList component', () => {
    render(<Home />)

    expect(screen.getByTestId('task-list')).toBeInTheDocument()
  })

  it('should have proper heading structure', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Task Manager')
  })
})