import { db, generateId } from './db'

// Project mutations
export async function createProject(name: string) {
  const projectId = generateId()
  const { error } = await db
    .from('projects')
    .insert({
      id: projectId,
      name,
      created_at: Date.now(),
    })
  
  if (error) {
    console.error('Create project error:', error)
    throw new Error(`Failed to create project: ${error.message || error.details || error.hint || 'Unknown database error'}`)
  }
  
  return projectId
}

export async function updateProject(projectId: string, updates: { name?: string }) {
  const { error } = await db
    .from('projects')
    .update(updates)
    .eq('id', projectId)
  
  if (error) {
    console.error('Update project error:', error)
    throw new Error(`Failed to update project: ${error.message || error.details || 'Unknown database error'}`)
  }
}

export async function deleteProject(projectId: string) {
  // Supabase will handle cascading deletes automatically due to ON DELETE CASCADE
  const { error } = await db
    .from('projects')
    .delete()
    .eq('id', projectId)
  
  if (error) {
    console.error('Delete project error:', error)
    throw new Error(`Failed to delete project: ${error.message || error.details || 'Unknown database error'}`)
  }
}

// Experiment mutations
export async function createExperiment(projectId: string, name: string, url: string) {
  const experimentId = generateId()
  const { error } = await db
    .from('experiments')
    .insert({
      id: experimentId,
      name,
      url,
      created_at: Date.now(),
      project_id: projectId,
    })
  
  if (error) {
    console.error('Create experiment error:', error)
    throw new Error(`Failed to create experiment: ${error.message || error.details || 'Unknown database error'}`)
  }
  
  return experimentId
}

export async function updateExperiment(experimentId: string, updates: { name?: string, url?: string }) {
  const { error } = await db
    .from('experiments')
    .update(updates)
    .eq('id', experimentId)
  
  if (error) {
    console.error('Update experiment error:', error)
    throw new Error(`Failed to update experiment: ${error.message || error.details || 'Unknown database error'}`)
  }
}

export async function deleteExperiment(experimentId: string) {
  // Supabase will handle cascading deletes automatically due to ON DELETE CASCADE
  const { error } = await db
    .from('experiments')
    .delete()
    .eq('id', experimentId)
  
  if (error) {
    console.error('Delete experiment error:', error)
    throw new Error(`Failed to delete experiment: ${error.message || error.details || 'Unknown database error'}`)
  }
}

// Chat message mutations
export async function addChatMessage(experimentId: string, message: string, role: 'user' | 'assistant') {
  const messageId = generateId()
  const { error } = await db
    .from('chat_messages')
    .insert({
      id: messageId,
      message,
      role,
      created_at: Date.now(),
      experiment_id: experimentId,
    })
  
  if (error) {
    console.error('Add chat message error:', error)
    throw new Error(`Failed to add chat message: ${error.message || error.details || 'Unknown database error'}`)
  }
  
  return messageId
}

// Canvas node mutations
export async function createCanvasNode(experimentId: string, type: string, x: number, y: number, data: any, width?: number, height?: number) {
  const nodeId = generateId()
  const { error } = await db
    .from('canvas_nodes')
    .insert({
      id: nodeId,
      type,
      x,
      y,
      width,
      height,
      data,
      created_at: Date.now(),
      experiment_id: experimentId,
    })
  
  if (error) {
    console.error('Create canvas node error:', error)
    throw new Error(`Failed to create canvas node: ${error.message || error.details || 'Unknown database error'}`)
  }
  
  return nodeId
}

export async function createScreenshotNode(experimentId: string, url: string) {
  try {
    // Take screenshot
    const apiUrl = typeof window !== 'undefined' 
      ? '/api/screenshot' 
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/screenshot`;
      
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error('Failed to take screenshot')
    }

    const { screenshot, title } = await response.json()

    // Create canvas node with screenshot data
    const nodeId = await createCanvasNode(
      experimentId,
      'screenshot',
      100, // default x position
      100, // default y position
      {
        screenshot,
        title,
        url: url.startsWith('http') ? url : `https://${url}`,
      },
      320, // default width
      200  // default height
    )

    return nodeId
  } catch (error) {
    console.error('Error creating screenshot node:', error)
    throw error
  }
} 