import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from './TaskForm'
import type { Task, Status } from '../types/Task'

const mockOnSubmit = vi.fn()
const mockOnCancel = vi.fn()

describe('TaskForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockReset()
    mockOnCancel.mockReset()
  })

  describe('Create mode', () => {
    it('should render empty form for creating new task', () => {
      render(
        <TaskForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue('')
      expect(screen.getByRole('textbox', { name: /description/i })).toHaveValue('')
      expect(screen.getByRole('combobox', { name: /status/i })).toHaveValue('TODO')
      expect(screen.getByRole('textbox', { name: /due date/i })).toHaveValue('')
      expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument()
    })

    it('should submit form with correct data when creating', async () => {
      const user = userEvent.setup()
      
      render(
        <TaskForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      await user.type(screen.getByRole('textbox', { name: /title/i }), 'New Task')
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Task description')
      await user.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'IN_PROGRESS')
      await user.type(screen.getByRole('textbox', { name: /due date/i }), '2024-12-31')

      await user.click(screen.getByRole('button', { name: /create task/i }))

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task description',
        status: 'IN_PROGRESS',
        dueDate: '2024-12-31'
      })
    })

    it('should not submit form with empty title', async () => {
      const user = userEvent.setup()
      
      render(
        <TaskForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      await user.click(screen.getByRole('button', { name: /create task/i }))

      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    })
  })

  describe('Edit mode', () => {
    const existingTask: Task = {
      id: 1,
      title: 'Existing Task',
      description: 'Existing description',
      status: 'IN_PROGRESS' as Status,
      dueDate: '2024-12-25'
    }

    it('should render form with existing task data', () => {
      render(
        <TaskForm
          mode="edit"
          initialTask={existingTask}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue('Existing Task')
      expect(screen.getByRole('textbox', { name: /description/i })).toHaveValue('Existing description')
      expect(screen.getByRole('combobox', { name: /status/i })).toHaveValue('IN_PROGRESS')
      expect(screen.getByRole('textbox', { name: /due date/i })).toHaveValue('2024-12-25')
      expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument()
    })

    it('should submit form with updated data', async () => {
      const user = userEvent.setup()
      
      render(
        <TaskForm
          mode="edit"
          initialTask={existingTask}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      await user.clear(screen.getByRole('textbox', { name: /title/i }))
      await user.type(screen.getByRole('textbox', { name: /title/i }), 'Updated Task')
      await user.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'DONE')

      await user.click(screen.getByRole('button', { name: /update task/i }))

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Updated Task',
        description: 'Existing description',
        status: 'DONE',
        dueDate: '2024-12-25'
      })
    })
  })

  describe('Common behavior', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <TaskForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      await user.click(screen.getByRole('button', { name: /cancel/i }))

      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should reset form when cancelled', async () => {
      const user = userEvent.setup()
      
      render(
        <TaskForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      await user.type(screen.getByRole('textbox', { name: /title/i }), 'Some title')
      await user.click(screen.getByRole('button', { name: /cancel/i }))

      expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue('')
    })
  })
})
