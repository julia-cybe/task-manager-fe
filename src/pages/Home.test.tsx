import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Home } from './Home'

// Mock the TaskList component
vi.mock('../components/TaskList', () => ({
  TaskList: ({ onTaskEdit, onTaskDelete }: any) => (
    <div data-testid="task-list">
      TaskList Component
      <button onClick={() => onTaskEdit?.({ id: 1, title: 'Test Task', status: 'TODO' })}>
        Edit Task
      </button>
      <button onClick={() => onTaskDelete?.(1)}>Delete Task</button>
    </div>
  )
}))

// Mock the TaskForm component
vi.mock('../components/TaskForm', () => ({
  TaskForm: ({ mode, initialTask, onSubmit, onCancel }: any) => (
    <div data-testid="task-form">
      <span>TaskForm - {mode} mode</span>
      {initialTask && <span>Initial: {initialTask.title}</span>}
      <button onClick={() => onSubmit({ title: 'New Task', status: 'TODO' })}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}))

// Mock taskService
vi.mock('../services/taskService', () => ({
  taskService: {
    createTask: vi.fn().mockResolvedValue({ id: 1, title: 'New Task', status: 'TODO' }),
    updateTask: vi.fn().mockResolvedValue({ id: 1, title: 'Updated Task', status: 'TODO' }),
    deleteTask: vi.fn().mockResolvedValue(undefined)
  }
}))

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render page title', () => {
    render(<Home />)
    expect(screen.getByText('Task Manager')).toBeInTheDocument()
  })

  it('should render TaskList component', () => {
    render(<Home />)
    expect(screen.getByTestId('task-list')).toBeInTheDocument()
  })

  it('should show task form modal when Add Task is clicked', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const addButton = screen.getByRole('button', { name: /add task/i })
    await user.click(addButton)

    expect(screen.getByTestId('task-form')).toBeInTheDocument()
    expect(screen.getByText('TaskForm - create mode')).toBeInTheDocument()
  })

  it('should close task form modal when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<Home />)

    // Open modal
    const addButton = screen.getByRole('button', { name: /add task/i })
    await user.click(addButton)

    // Close modal
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
  })

  it('should show edit modal with prefilled data when edit is triggered', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const editButton = screen.getByText('Edit Task')
    await user.click(editButton)

    expect(screen.getByTestId('task-form')).toBeInTheDocument()
    expect(screen.getByText('TaskForm - edit mode')).toBeInTheDocument()
    expect(screen.getByText('Initial: Test Task')).toBeInTheDocument()
  })

  it('should handle task deletion', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const deleteButton = screen.getByText('Delete Task')
    await user.click(deleteButton)

    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument()
  })
})

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