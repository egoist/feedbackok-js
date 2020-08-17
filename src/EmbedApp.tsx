import * as React from 'react'
import { parse } from 'querystringify'
import { FeedbackForm } from 'feedbackok-react'
import { closeIframe, resizeIframe } from './iframe-utils'

const getOptionsFromHash = () => {
  const options = parse(location.hash.replace(/^#/, '')) as any
  Object.keys(options).forEach((key) => {
    if (options[key] === 'false') {
      options[key] = false
    }
  })
  return options
}

export const App = () => {
  const [options, setOptions] = React.useState<any>({})

  React.useEffect(() => {
    setOptions(getOptionsFromHash())
    const handler = () => {
      setOptions(getOptionsFromHash())
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const pid = options.pid

  if (!pid) {
    return null
  }

  return (
    <FeedbackForm
      pid={pid}
      from={options.from}
      closeHandler={
        options.inline
          ? undefined
          : () => {
              closeIframe()
            }
      }
      resizeHandler={(height) => {
        resizeIframe(height, options.iframe)
      }}
    />
  )
}
