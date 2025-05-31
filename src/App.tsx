import React, { useState, useEffect } from 'react'
    import { Plus, Trash2, CheckCircle } from 'lucide-react'
    import { createClient } from '@supabase/supabase-js'
    
    // Initialize Supabase client
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_ANON_KEY!
    )
    
    interface Todo {
      id: number
      text: string
      completed: boolean
      created_at: string
    }
    
    export default function App() {
      const [todos, setTodos] = useState<Todo[]>([])
      const [newTodo, setNewTodo] = useState('')
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
      
      // Fetch tasks from Supabase on component mount
      useEffect(() => {
        const fetchTodos = async () => {
          try {
            const { data, error } = await supabase
              .from('todos')
              .select('*')
              .order('created_at', { ascending: false })
            
            if (error) {
              console.error('Supabase error:', error)
              throw error
            }
            
            setTodos(data as Todo[])
            setLoading(false)
          } catch (err) {
            console.error('Failed to load tasks:', err)
            setError('Failed to load tasks')
            setLoading(false)
          }
        }
        
        fetchTodos()
      }, [])
      
      // Add new task to Supabase
      const addTodo = async () => {
        if (newTodo.trim() === '') return
        
        try {
          const { data, error } = await supabase
            .from('todos')
            .insert([
              {
                text: newTodo.trim(),
                completed: false,
                created_at: new Date().toISOString()
              }
            ])
            
          if (error) {
            console.error('Supabase error:', error)
            throw error
          }
            
          // Update local state
          setTodos([...todos, {
            id: data[0].id,
            text: newTodo.trim(),
            completed: false,
            created_at: data[0].created_at
          }])
          
          setNewTodo('')
        } catch (err) {
          console.error('Failed to add task:', err)
          setError('Failed to add task')
        }
      }
      
      // Toggle task completion
      const toggleComplete = async (id: number) => {
        try {
          const { data, error } = await supabase
            .from('todos')
            .update({ completed: !todos.find(todo => todo.id === id)?.completed })
            .eq('id', id)
            
          if (error) {
            console.error('Supabase error:', error)
            throw error
          }
            
          setTodos(
            todos.map(todo =>
              todo.id === id 
                ? { ...todo, completed: !todo.completed } 
                : todo
            )
          )
        } catch (err) {
          console.error('Failed to update task:', err)
          setError('Failed to update task')
        }
      }
      
      // Delete task
      const deleteTodo = async (id: number) => {
        try {
          const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id)
            
          if (error) {
            console.error('Supabase error:', error)
            throw error
          }
            
          setTodos(todos.filter(todo => todo.id !== id))
        } catch (err) {
          console.error('Failed to delete task:', err)
          setError('Failed to delete task')
        }
      }
      
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">My Todo App</h1>
              
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addTodo}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {loading ? (
                  <p className="text-gray-500 text-center py-4">Loading tasks...</p>
                ) : error ? (
                  <p className="text-red-500 text-center py-4">{error}</p>
                ) : todos.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tasks yet. Add one above!</p>
                ) : (
                  todos.map(todo => (
                    <div 
                      key={todo.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleComplete(todo.id)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span 
                          className={`ml-2 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                        >
                          {todo.text}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }
