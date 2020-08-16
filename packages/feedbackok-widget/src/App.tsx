import * as React from 'react'
import { parse } from 'querystringify'
import { FeedbackForm, FormConfig } from 'feedbackok-react'

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
  const [config, setConfig] = React.useState<FormConfig | undefined>(undefined)

  React.useEffect(() => {
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

  return <FeedbackForm config={config} />
}
