'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
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

  const fetchDocuments = useCallback(async () => {
    if (!slug) {
      setDocuments([])
      return
    }
    try {
      const resp = await fetch(`/api/documents?slug=${encodeURIComponent(slug)}`)
      if (!resp.ok) {
        throw new Error('Failed to load documents')
      }
      const data = await resp.json()
      setDocuments(data.documents || [])
    } catch (err) {
      console.error(err)
      setDocuments([])
    }
  }, [slug])

  useEffect(() => {
    fetchDocuments()
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
