import type { Task } from '../types/Task'
import type { Status } from '../types/Task'

const API_BASE_URL = '/api'

// Mock data for development when backend is not available
let mockTasks: Task[] = [
  {
    id: 1,
    title: 'Complete project setup',
    description: 'Set up the frontend React application with TypeScript and Tailwind CSS',
    status: 'IN_PROGRESS' as Status,
    dueDate: '2024-12-20'
  },
  {
    id: 2,
    title: 'Implement task listing',
    description: 'Create a component to display all tasks with proper styling',
    status: 'DONE' as Status,
    dueDate: '2024-12-15'
  },
  {
    id: 3,
    title: 'Add task creation form',
    description: 'Build a form to add new tasks to the system',
    status: 'TODO' as Status,
    dueDate: '2024-12-25'
  },
  {
    id: 4,
    title: 'Setup backend API',
    description: 'Create Spring Boot backend with REST endpoints',
    status: 'TODO' as Status
  }
]

let nextMockId = 5

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`)

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        // Backend not available, return mock data
        console.log('Backend not available, using mock data')
        return Promise.resolve(mockTasks)
      }

      return await response.json()
    } catch (error) {
      // Backend not available, return mock data
      console.log('Backend not available, using mock data')
      return Promise.resolve(mockTasks)
    }
  },

  async getTaskById(id: number): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch task')
      }

      return await response.json()
    } catch (error) {
      // Backend not available, find task in mock data
      console.log('Backend not available, finding task in mock data')
      const task = mockTasks.find(t => t.id === id)
      if (!task) {
        throw new Error('Task not found')
      }
      return Promise.resolve(task)
    }
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      return await response.json()
    } catch (error) {
      // Backend not available, create task in mock data
      console.log('Backend not available, creating task in mock data')
      const newTask: Task = {
        ...task,
        id: nextMockId++
      }
      mockTasks.push(newTask)
      return Promise.resolve(newTask)
    }
  },

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      return await response.json()
    } catch (error) {
      // Backend not available, update task in mock data
      console.log('Backend not available, updating task in mock data')
      const existingTaskIndex = mockTasks.findIndex(t => t.id === id)
      if (existingTaskIndex === -1) {
        throw new Error('Task not found')
      }
      
      const updatedTask: Task = {
        ...mockTasks[existingTaskIndex],
        ...task
      }
      mockTasks[existingTaskIndex] = updatedTask
      return Promise.resolve(updatedTask)
    }
  },

  async deleteTask(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
    } catch (error) {
      // Backend not available, delete task from mock data
      console.log('Backend not available, deleting task from mock data')
      const taskIndex = mockTasks.findIndex(t => t.id === id)
      if (taskIndex === -1) {
        throw new Error('Task not found')
      }
      mockTasks.splice(taskIndex, 1)
      return Promise.resolve()
    }
  }
}