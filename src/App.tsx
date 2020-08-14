import { h } from 'preact'
import { parse } from 'querystringify'
import { FeedbackOK } from './FeedbackForm'
import { useState, useEffect } from 'preact/hooks'
import { Config } from './config'

const getConfigFromHash = () => {
  const config = parse(location.hash.replace(/^#/, '')) as any
  Object.keys(config).forEach((key) => {
    if (config[key] === 'false') {
      config[key] = false
    }
  })
  return config
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

  return <FeedbackOK config={config} />
}
