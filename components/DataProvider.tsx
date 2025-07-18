'use client'

import { init } from '@instantdb/react'
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { InstaQLEntity } from '@instantdb/react'
import { AppSchema } from '@/instant.schema'
import schema from '@/instant.schema'

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  schema,
  devtool: false,
})

export const DataContext = createContext({
  projects: [] as InstaQLEntity<AppSchema, 'projects', { experiments: {} }>[],
  experiments: [] as InstaQLEntity<AppSchema, 'experiments', { project: {}, chatMessages: {} }>[],
  db,
})

export const useData = () => useContext(DataContext)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<InstaQLEntity<AppSchema, 'projects'>[]>([])
  const [experiments, setExperiments] = useState<InstaQLEntity<AppSchema, 'experiments'>[]>([])
  

  const query = {
    projects: {
      experiments: {}
    },
    experiments: {
      project: {},
      chatMessages: {}
    },
  }

  const { isLoading, error, data } = db.useQuery(query)

  return (
    <DataContext.Provider
      value={{
        projects: data?.projects || ([] as any),
        experiments: data?.experiments || ([] as any),
        db,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
