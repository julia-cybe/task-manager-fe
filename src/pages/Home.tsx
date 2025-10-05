import { useState } from 'react'
import { TaskList } from '../components/TaskList'
import { TaskForm } from '../components/TaskForm'
import { Modal } from '../components/Modal'
import { taskService } from '../services/taskService'
import type { Task } from '../types/Task'

type FormMode = 'create' | 'edit'

export const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: number; title: string } | null>(null)

  const refreshTaskList = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleAddTask = () => {
    setFormMode('create')
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setFormMode('edit')
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      const task = await taskService.getTaskById(taskId)
      setShowDeleteConfirm({ id: taskId, title: task.title })
    } catch (error) {
      console.error('Failed to get task details:', error)
      setShowDeleteConfirm({ id: taskId, title: 'this task' })
    }
  }

  const handleFormSubmit = async (taskData: Omit<Task, 'id'>) => {
    try {
      setIsLoading(true)
      
      if (formMode === 'create') {
        await taskService.createTask(taskData)
      } else if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData)
      }
      
      setIsModalOpen(false)
      setEditingTask(null)
      refreshTaskList()
    } catch (error) {
      console.error('Failed to save task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormCancel = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return
    
    try {
      setIsLoading(true)
      await taskService.deleteTask(showDeleteConfirm.id)
      setShowDeleteConfirm(null)
      refreshTaskList()
    } catch (error) {
      console.error('Failed to delete task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Task Manager
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Stay organized and boost your productivity with our intuitive task management system.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Your Tasks</h2>
              <p className="mt-1 text-sm text-gray-600">
                Manage and track your daily tasks efficiently
              </p>
            </div>
            <button 
              onClick={handleAddTask}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Task
            </button>
          </div>
        </div>

        <TaskList 
          onTaskEdit={handleEditTask}
          onTaskDelete={handleDeleteTask}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Task Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={formMode === 'create' ? 'Create New Task' : 'Edit Task'}
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Modal is working! Mode: {formMode}
          </p>
          <TaskForm
            mode={formMode}
            initialTask={editingTask || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isLoading}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={cancelDelete}
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{showDeleteConfirm?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={cancelDelete}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Task'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}