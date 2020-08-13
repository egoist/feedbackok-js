import { useState, useEffect } from 'preact/hooks'
import { API_ENDPOINT } from './constants'

export function useProjectData(pid: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<{
    emotions: string[]
    notEmoji: boolean
  }>({
    emotions: [],
    notEmoji: false,
  })

  useEffect(() => {
    if (!pid) return

    setIsLoading(true)

    fetch(`${API_ENDPOINT}/project/${pid}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    }).then((res) => {
      setIsLoading(false)
      if (res.ok) {
        res.json().then((data) => {
          setError('')
          setData({
            ...data,
            emotions: data.emotions,
            notEmoji: data.not_emoji,
          })
        })
      } else {
        setError(`${res.status}: ${res.statusText}`)
      }
    })
  }, [pid])

  return {
    error,
    isLoading,
    data,
  }
}
