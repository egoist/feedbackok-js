import { createApp, h } from 'vue'
import { FeedbackForm } from 'feedbackok-vue'

createApp({
  setup() {
    return () => h('div', [h(FeedbackForm, { config: { pid: 'skzcvzn' } })])
  },
}).mount('#root')
