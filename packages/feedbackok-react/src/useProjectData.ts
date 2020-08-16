import * as React from 'react'
import { API_ENDPOINT } from './constants'

export function useProjectData(pid: string) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [data, setData] = React.useState<{
    emotions: string[]
    notEmoji: boolean
  }>({
    emotions: [],
    notEmoji: false,
  })

  React.useEffect(() => {
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
