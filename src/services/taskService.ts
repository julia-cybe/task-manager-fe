import type { Task } from '../types/Task'
import { Status } from '../types/Task'

const API_BASE_URL = '/api'

// Mock data for development when backend is not available
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Complete project setup',
    description: 'Set up the frontend React application with TypeScript and Tailwind CSS',
    status: Status.IN_PROGRESS,
    dueDate: '2024-12-20'
  },
  {
    id: 2,
    title: 'Implement task listing',
    description: 'Create a component to display all tasks with proper styling',
    status: Status.DONE,
    dueDate: '2024-12-15'
  },
  {
    id: 3,
    title: 'Add task creation form',
    description: 'Build a form to add new tasks to the system',
    status: Status.TODO,
    dueDate: '2024-12-25'
  },
  {
    id: 4,
    title: 'Setup backend API',
    description: 'Create Spring Boot backend with REST endpoints',
    status: Status.TODO
  }
]

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
      throw error
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
      throw error
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
      throw error
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
      throw error
    }
  }
}