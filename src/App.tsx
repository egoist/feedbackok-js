import { h } from 'preact'
import { parse } from 'querystringify'
import { FeedbackOK } from './FeedbackOK'
import { useState, useEffect } from 'preact/hooks'
import { Config } from './config'

const getConfigFromHash = () => {
  return parse(location.hash.replace(/^#/, '')) as any
}

const close = () => {
  typeof window !== 'undefined' &&
    window.parent &&
    window.parent.postMessage('feedbackok-close', '*')
}

export const App = () => {
  const [config, setConfig] = useState<Config | undefined>(undefined)

  useEffect(() => {
    setConfig(getConfigFromHash())
    const handler = () => {
      setConfig(getConfigFromHash())
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (!config || !config.pid) {
    return null
  }

  return <FeedbackOK config={config} close={close} />
}
