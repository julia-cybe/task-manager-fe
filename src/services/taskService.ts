import axios from 'axios'
import type { Task } from '../types/Task'

// Configure axios for the Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api/v1/tasks'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Type guard to check if error has response property
const hasResponseStatus = (error: unknown): error is { response: { status: number } } => {
  return typeof error === 'object' && error !== null && 'response' in error &&
         typeof (error as any).response === 'object' && 'status' in (error as any).response
}

export const taskService = {
  /**
   * Get all tasks from the backend
   */
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await apiClient.get<Task[]>('')
      return response.data
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      throw new Error('Failed to fetch tasks')
    }
  },

  /**
   * Get a specific task by ID
   */
  async getTaskById(id: number): Promise<Task> {
    try {
      const response = await apiClient.get<Task>(`/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch task with id ${id}:`, error)
      if (hasResponseStatus(error) && error.response.status === 404) {
        throw new Error('Task not found')
      }
      throw new Error('Failed to fetch task')
    }
  },

  /**
   * Create a new task
   */
  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      const response = await apiClient.post<Task>('', task)
      return response.data
    } catch (error) {
      console.error('Failed to create task:', error)
      if (hasResponseStatus(error) && error.response.status === 400) {
        throw new Error('Invalid task data')
      }
      throw new Error('Failed to create task')
    }
  },

  /**
   * Update an existing task
   */
  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    try {
      // For the backend API, we need to send the complete task object
      // First get the current task, then merge with updates
      const currentTask = await this.getTaskById(id)
      const updatedTask = { ...currentTask, ...task }
      
      const response = await apiClient.put<Task>(`/${id}`, updatedTask)
      return response.data
    } catch (error) {
      console.error(`Failed to update task with id ${id}:`, error)
      if (hasResponseStatus(error)) {
        if (error.response.status === 404) {
          throw new Error('Task not found')
        }
        if (error.response.status === 400) {
          throw new Error('Invalid task data')
        }
      }
      throw new Error('Failed to update task')
    }
  },

  /**
   * Delete a task by ID
   */
  async deleteTask(id: number): Promise<void> {
    try {
      await apiClient.delete(`/${id}`)
    } catch (error) {
      console.error(`Failed to delete task with id ${id}:`, error)
      if (hasResponseStatus(error) && error.response.status === 404) {
        throw new Error('Task not found')
      }
      throw new Error('Failed to delete task')
    }
  }
}