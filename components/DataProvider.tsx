'use client'

import { supabase } from '@/lib/supabase'
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

type Project = {
  id: string
  name: string
  created_at: number
  experiments?: Experiment[]
}

type Experiment = {
  id: string
  name: string
  url: string
  bookmarked_at?: number
  created_at: number
  project_id?: string
  project?: Project
  chat_messages?: ChatMessage[]
  canvas_nodes?: CanvasNode[]
}

type ChatMessage = {
  id: string
  message: string
  role: string
  created_at: number
  experiment_id?: string
}

type CanvasNode = {
  id: string
  type: string
  x: number
  y: number
  width?: number
  height?: number
  data: any
  created_at: number
  experiment_id?: string
}

export const DataContext = createContext({
  projects: [] as Project[],
  experiments: [] as Experiment[],
  db: supabase,
  refreshData: () => {},
})

export const useData = () => useContext(DataContext)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const fetchData = async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Fetching data...')
      
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          experiments (*)
        `)
      
      if (projectsError) throw projectsError
      
      const { data: experimentsData, error: experimentsError } = await supabase
        .from('experiments')
        .select(`
          *,
          projects (*),
          chat_messages (*),
          canvas_nodes (*)
        `)
        .order('created_at', { ascending: true, foreignTable: 'chat_messages' })
      
      if (experimentsError) throw experimentsError
      
      console.log('📦 Fetched experiments:', experimentsData?.length)
      console.log('💬 Total chat messages:', experimentsData?.reduce((acc, exp) => acc + (exp.chat_messages?.length || 0), 0))
      
      setProjects(projectsData || [])
      setExperiments(experimentsData || [])
      setError(null)
    } catch (err) {
      console.error('❌ Data fetch error:', err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()

    // Set up realtime subscriptions for all relevant tables
    console.log('🔧 Setting up realtime subscriptions...')
    
    const realtimeChannel = supabase
      .channel('all-realtime-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects' 
        }, 
        (payload) => {
          console.log('🏗️ Project changed:', payload)
          
          if (payload.eventType === 'INSERT') {
            // Add new project
            setProjects(prev => [...prev, payload.new as Project])
          } else if (payload.eventType === 'UPDATE') {
            // Update existing project
            setProjects(prev => prev.map(proj => 
              proj.id === payload.new.id ? { ...proj, ...payload.new } : proj
            ))
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted project
            setProjects(prev => prev.filter(proj => proj.id !== payload.old.id))
          }
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'experiments' 
        }, 
        (payload) => {
          console.log('🧪 Experiment changed:', payload)
          
          if (payload.eventType === 'INSERT') {
            // Add new experiment
            setExperiments(prev => [...prev, payload.new as Experiment])
          } else if (payload.eventType === 'UPDATE') {
            // Update existing experiment
            setExperiments(prev => prev.map(exp => 
              exp.id === payload.new.id ? { ...exp, ...payload.new } : exp
            ))
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted experiment
            setExperiments(prev => prev.filter(exp => exp.id !== payload.old.id))
          }
        }
      )
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages' 
        }, 
        (payload) => {
          console.log('🚀 New chat message received:', payload)
          
          // Immediately add the new message to state
          setExperiments(prev => prev.map(exp => 
            exp.id === payload.new.experiment_id
              ? {
                  ...exp,
                  chat_messages: [...(exp.chat_messages || []), payload.new as ChatMessage]
                    .sort((a, b) => a.created_at - b.created_at)
                }
              : exp
          ))
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'canvas_nodes' 
        }, 
        (payload) => {
          console.log('🎨 Canvas node changed:', payload)
          
          if (payload.eventType === 'INSERT') {
            setExperiments(prev => prev.map(exp => 
              exp.id === payload.new.experiment_id
                ? {
                    ...exp,
                    canvas_nodes: [...(exp.canvas_nodes || []), payload.new as CanvasNode]
                  }
                : exp
            ))
          } else if (payload.eventType === 'UPDATE') {
            setExperiments(prev => prev.map(exp => 
              exp.id === payload.new.experiment_id
                ? {
                    ...exp,
                    canvas_nodes: (exp.canvas_nodes || []).map(node => 
                      node.id === payload.new.id ? payload.new as CanvasNode : node
                    )
                  }
                : exp
            ))
          } else if (payload.eventType === 'DELETE') {
            setExperiments(prev => prev.map(exp => 
              exp.id === payload.old.experiment_id
                ? {
                    ...exp,
                    canvas_nodes: (exp.canvas_nodes || []).filter(node => node.id !== payload.old.id)
                  }
                : exp
            ))
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to chat messages')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime subscription error')
          // Fallback to periodic refresh if realtime fails
          const fallbackInterval = setInterval(() => {
            console.log('🔄 Fallback: Refreshing data every 3 seconds...')
            fetchData()
          }, 3000)
          
          return () => clearInterval(fallbackInterval)
        }
      })

    // Cleanup subscriptions
    return () => {
      console.log('🧹 Cleaning up subscriptions...')
      realtimeChannel.unsubscribe()
    }
  }, [])

  return (
    <DataContext.Provider
      value={{
        projects,
        experiments,
        db: supabase,
        refreshData: fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
