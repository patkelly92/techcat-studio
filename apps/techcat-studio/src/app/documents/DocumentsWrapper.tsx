'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback, useRef } from 'react'
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
  const controllerRef = useRef<AbortController | null>(null)

  const fetchDocuments = useCallback(async () => {
    if (!slug) {
      setDocuments([])
      return
    }

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    try {
      const resp = await fetch(
        `${apiUrl}/api/documents?slug=${encodeURIComponent(slug)}`,
        { signal: controller.signal },
      )
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
  }, [slug, apiUrl])

  useEffect(() => {
    fetchDocuments()
    return () => controllerRef.current?.abort()
  }, [slug, fetchDocuments])

  return (
    <DocumentsSection
      projects={projects}
      slug={slug}
      documents={documents}
      apiUrl={apiUrl}
      refreshDocuments={fetchDocuments}
    />
  )
}

export default DocumentsWrapper
