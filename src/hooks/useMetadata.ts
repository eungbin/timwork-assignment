import { useEffect, useState } from 'react'
import type { Metadata } from '../types/drawing'

const METADATA_PATH = '/timwork/data/metadata.json'

export function useMetadata() {
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadMetadata() {
      try {
        const response = await fetch(METADATA_PATH)
        if (!response.ok) {
          throw new Error(`metadata.json 로드 실패: ${response.status}`)
        }
        const json = (await response.json()) as Metadata
        if (!isMounted) return
        setMetadata(json)
      } catch (fetchError) {
        if (!isMounted) return
        const message =
          fetchError instanceof Error ? fetchError.message : 'metadata.json 로드 중 오류가 발생했습니다.'
        setError(message)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadMetadata()

    return () => {
      isMounted = false
    }
  }, [])

  return { metadata, loading, error }
}
