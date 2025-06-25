'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DocumentsSection from '@/components/documents/DocumentsSection'

interface ProjectItem {
  slug: string
  name: string
}

interface DocumentItem {
  title: string
  content: string
  lastModified: string
}

interface DocumentsWrapperProps {
  projects: ProjectItem[]
  apiUrl: string
}

const DocumentsWrapper = ({ projects, apiUrl }: DocumentsWrapperProps) => {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') ?? undefined
  const [documents, setDocuments] = useState<DocumentItem[]>([])

  useEffect(() => {
    const controller = new AbortController()
    const fetchDocs = async () => {
      if (!slug) {
        setDocuments([])
        return
      }
      setDocuments([])
      try {
        const resp = await fetch(`/api/documents?slug=${encodeURIComponent(slug)}`, { signal: controller.signal })
        if (!resp.ok) {
          throw new Error('Failed to load documents')
        }
        const data = await resp.json()
        if (!controller.signal.aborted) {
          setDocuments(data.documents || [])
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err)
          setDocuments([])
        }
      }
    }
    fetchDocs()
    return () => controller.abort()
  }, [slug])

  return (
    <DocumentsSection projects={projects} slug={slug} documents={documents} apiUrl={apiUrl} />
  )
}

export default DocumentsWrapper
