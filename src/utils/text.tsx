// MemoryContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { memory } from '@/utils/memory'

type Memory = Record<string, any>

interface MemoryContextType
{
  data: Memory
  set: (key: string, val: any) => Promise<void>
  reload: () => Promise<void>
  delete: (key: string) => Promise<void>
}

const MemoryContext = createContext<MemoryContextType | null>(null)

export const MemoryProvider: React.FC = ({ children }) =>
{
  const [data, setData] = useState<Memory>({})

  const reload = async () =>
  {
    const fresh = await memory.ensureMemory('yourFileName')
    setData(fresh)
  }

  const set = async (key: string, val: any) =>
  {
    await memory.updateValue('yourFileName', { [key]: val })
    setData(d => ({ ...d, [key]: val }))
  }

  const del = async (key: string) =>
  {
    const newData = { ...data }
    delete newData[key]
    await memory.updateValue('yourFileName', newData)
    setData(newData)
  }

  useEffect(() =>
  {
    reload()
  }, [])

  return (
    <MemoryContext.Provider value={{ data, reload, set, delete: del }}>
      {children}
    </MemoryContext.Provider>
  )
}

export const useMemory = () =>
{
  const ctx = useContext(MemoryContext)
  if (!ctx) throw new Error('useMemory must be inside MemoryProvider')
  return ctx
}
