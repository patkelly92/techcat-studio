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
    const fetchDocs = async () => {
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
    }
    fetchDocs()
  }, [slug])

  return (
    <DocumentsSection projects={projects} slug={slug} documents={documents} apiUrl={apiUrl} />
  )
}

export default DocumentsWrapper
