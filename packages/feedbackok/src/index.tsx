import * as React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { FeedbackForm, FormConfig } from 'feedbackok-react'

export * from 'feedbackok-react'

export const mount = (config: FormConfig, target: HTMLElement) => {
  render(<FeedbackForm config={config} />, target)
  return () => {
    unmountComponentAtNode(target)
  }
}

export const unmount = (target: HTMLElement) => unmountComponentAtNode(target)
