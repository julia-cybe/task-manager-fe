import { describe, it, expect, vi, beforeEach } from 'vitest'
import { taskService } from './taskService'
import { type Task, Status } from '../types/Task'

// Mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('taskService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('getAllTasks', () => {
    it('should fetch and return all tasks', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Test Task 1',
          description: 'Description 1',
          status: Status.TODO,
          dueDate: '2024-12-31'
        },
        {
          id: 2,
          title: 'Test Task 2',
          status: Status.IN_PROGRESS
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks
      })

      const result = await taskService.getAllTasks()

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks')
      expect(result).toEqual(mockTasks)
    })

    it('should throw error when API call fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(taskService.getAllTasks()).rejects.toThrow('Failed to fetch tasks')
    })

    it('should throw error when network request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(taskService.getAllTasks()).rejects.toThrow('Network error')
    })
  })

  describe('getTaskById', () => {
    it('should fetch and return a specific task', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        dueDate: '2024-12-31'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTask
      })

      const result = await taskService.getTaskById(1)

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks/1')
      expect(result).toEqual(mockTask)
    })

    it('should throw error when task not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(taskService.getTaskById(999)).rejects.toThrow('Failed to fetch task')
    })
  })
})