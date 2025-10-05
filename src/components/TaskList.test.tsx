import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'


import { TaskList } from './TaskList'
import { taskService } from '../services/taskService'
import type { Task, Status } from '../types/Task'

// Mock the taskService
vi.mock('../services/taskService')

const mockTaskService = vi.mocked(taskService)

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'First Task',
      description: 'First task description',
      status: 'TODO' as Status,
      dueDate: '2024-12-31'
    },
    {
      id: 2,
      title: 'Second Task',
      description: 'Second task description',
      status: 'IN_PROGRESS' as Status,
      dueDate: '2024-12-25'
    },
    {
      id: 3,
      title: 'Third Task',
      status: 'DONE' as Status
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render loading state initially', () => {
    mockTaskService.getAllTasks.mockReturnValue(new Promise(() => {})) // Never resolves

    render(<TaskList />)

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
  })

  it('should render list of tasks when loaded successfully', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks)

    render(<TaskList />)

    await waitFor(() => {
      expect(screen.getByText('First Task')).toBeInTheDocument()
      expect(screen.getByText('Second Task')).toBeInTheDocument()
      expect(screen.getByText('Third Task')).toBeInTheDocument()
    })

    expect(screen.getByText('First task description')).toBeInTheDocument()
    expect(screen.getByText('Second task description')).toBeInTheDocument()
    expect(screen.getByText('TODO')).toBeInTheDocument()
    expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument()
    expect(screen.getByText('DONE')).toBeInTheDocument()
  })

  it('should render empty message when no tasks', async () => {
    mockTaskService.getAllTasks.mockResolvedValue([])

    render(<TaskList />)

    await waitFor(() => {
      expect(screen.getByText('No tasks found')).toBeInTheDocument()
    })
  })

  it('should render error message when API call fails', async () => {
    mockTaskService.getAllTasks.mockRejectedValue(new Error('API Error'))

    render(<TaskList />)

    await waitFor(() => {
      expect(screen.getByText('Error loading tasks: API Error')).toBeInTheDocument()
    })
  })

  it('should display due dates when present', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks)

    render(<TaskList />)

    await waitFor(() => {
      expect(screen.getByText('Due: 2024-12-31')).toBeInTheDocument()
      expect(screen.getByText('Due: 2024-12-25')).toBeInTheDocument()
    })
  })

  it('should call taskService.getAllTasks on mount', async () => {
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks)

    render(<TaskList />)

    await waitFor(() => {
      expect(mockTaskService.getAllTasks).toHaveBeenCalledTimes(1)
    })
  })
})