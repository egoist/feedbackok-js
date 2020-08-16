import * as React from 'react'
import { render } from 'react-dom'
import { FeedbackForm } from 'feedbackok-react'

render(
  <div>
    <FeedbackForm config={{ pid: 'skzcvzn' }} />
  </div>,
  document.getElementById('root'),
)
