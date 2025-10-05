import { describe, it, expect, vi, beforeEach } from 'vitest'
import { taskService } from './taskService'
import type { Task, Status } from '../types/Task'

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
          status: 'TODO' as Status,
          dueDate: '2024-12-31'
        },
        {
          id: 2,
          title: 'Test Task 2',
          status: 'IN_PROGRESS' as Status
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

    it('should return mock data when backend is not available', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await taskService.getAllTasks()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('getTaskById', () => {
    it('should fetch and return a specific task', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'TODO' as Status,
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

  describe('createTask', () => {
    it('should create a new task and return it', async () => {
      const newTask: Omit<Task, 'id'> = {
        title: 'New Task',
        description: 'New Description',
        status: 'TODO' as Status,
        dueDate: '2024-12-31'
      }

      const createdTask: Task = { ...newTask, id: 3 }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json'
        },
        json: async () => createdTask
      })

      const result = await taskService.createTask(newTask)

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
      expect(result).toEqual(createdTask)
    })

    it('should throw error when creation fails', async () => {
      const newTask: Omit<Task, 'id'> = {
        title: 'New Task',
        status: 'TODO' as Status
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      })

      await expect(taskService.createTask(newTask)).rejects.toThrow('Failed to create task')
    })

    it('should handle mock data creation when backend is not available', async () => {
      const newTask: Omit<Task, 'id'> = {
        title: 'Mock Task',
        status: 'TODO' as Status
      }

      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await taskService.createTask(newTask)

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.title).toBe(newTask.title)
      expect(result.status).toBe(newTask.status)
    })
  })

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const taskUpdate: Partial<Task> = {
        title: 'Updated Task',
        status: 'IN_PROGRESS' as Status
      }

      const updatedTask: Task = {
        id: 1,
        title: 'Updated Task',
        status: 'IN_PROGRESS' as Status,
        description: 'Original description'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json'
        },
        json: async () => updatedTask
      })

      const result = await taskService.updateTask(1, taskUpdate)

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskUpdate),
      })
      expect(result).toEqual(updatedTask)
    })

    it('should throw error when update fails', async () => {
      const taskUpdate: Partial<Task> = {
        title: 'Updated Task'
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(taskService.updateTask(999, taskUpdate)).rejects.toThrow('Failed to update task')
    })

    it('should handle mock data update when backend is not available', async () => {
      const taskUpdate: Partial<Task> = {
        title: 'Mock Updated Task',
        status: 'DONE' as Status
      }

      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await taskService.updateTask(1, taskUpdate)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(result.title).toBe(taskUpdate.title)
      expect(result.status).toBe(taskUpdate.status)
    })
  })

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      await expect(taskService.deleteTask(1)).resolves.not.toThrow()

      expect(mockFetch).toHaveBeenCalledWith('/api/tasks/1', {
        method: 'DELETE',
      })
    })

    it('should throw error when deletion fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(taskService.deleteTask(999)).rejects.toThrow('Failed to delete task')
    })

    it('should handle mock data deletion when backend is not available', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(taskService.deleteTask(1)).resolves.not.toThrow()
    })
  })
})