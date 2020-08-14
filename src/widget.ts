import { createPopper, Instance as PopperInstance } from '@popperjs/core'
import { stringify } from 'querystringify'
import { getCurrentScript } from 'tiny-current-script'
import { Config } from './config'
import { preload } from './preload'

const TRIGGER_ATTR_NAME = `data-feedbackok-trigger`
const IFRAME_ID = `feedbackok-iframe`
let popper: PopperInstance | undefined

const currentScript = getCurrentScript()

const configFromScript = {
  pid: currentScript?.getAttribute('data-pid') || undefined,
  debug: currentScript?.hasAttribute('data-debug'),
}

const close = () => {
  const iframe = getExistingIframe()
  if (iframe) {
    iframe.style.display = 'none'
  }
  if (popper) {
    popper.destroy()
    popper = undefined
  }
}

window.addEventListener('message', (e) => {
  const data = e.data
  if (typeof data !== 'object') return
  if (data.type === 'feedbackok-close') {
    close()
  } else if (data.type === 'feedbackok-resize') {
    const iframe = getExistingIframe()
    console.log(data)
    if (iframe) {
      iframe.height = data.data
    }
  }
})

const getExistingIframe = () => {
  const existing = document.getElementById(IFRAME_ID) as HTMLIFrameElement
  if (existing) {
    return existing
  }
}

const getIframeSrc = (config: Config) => {
  const EMBED_HTML =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3030/cdn/embed${
          configFromScript.debug ? '.dev' : ''
        }.html`
      : `https://cdn.feedbackok.com/embed${
          configFromScript.debug ? '.dev' : ''
        }.html`
  return `${EMBED_HTML}#${stringify(config)}`
}

const ensureIframe = () => {
  const existing = getExistingIframe()
  if (existing) {
    return existing
  }

  if (!currentScript) {
    return console.error(`Unsupported browser, please upgrade!`)
  }

  const iframe = document.createElement('iframe')
  iframe.id = IFRAME_ID
  iframe.src = getIframeSrc(configFromScript)
  iframe.style.display = 'none'
  iframe.style.border = 'none'
  iframe.style.boxShadow = `0 18px 50px -10px rgba(0, 0, 0, 0.2)`
  iframe.style.overflow = 'hidden'
  iframe.style.borderRadius = '6px'
  iframe.width = '320px'
  iframe.height = '180px'

  document.body.appendChild(iframe)
  return iframe
}

ensureIframe()

document.addEventListener('mouseover', (e: any) => {
  const $el: HTMLElement | null =
    e.target.closest && e.target.closest(`[${TRIGGER_ATTR_NAME}]`)

  if (!$el) return

  const pid = $el.getAttribute(TRIGGER_ATTR_NAME) || configFromScript.pid
  if (pid) {
    preload(pid)
  }
})

document.addEventListener('click', (e: any) => {
  const $el: HTMLElement | null = e.target.closest(`[${TRIGGER_ATTR_NAME}]`)

  if (!$el) return

  e.preventDefault()

  if (popper) {
    close()
    return
  }

  const iframe = getExistingIframe()

  if (iframe) {
    iframe.src = getIframeSrc({
      ...configFromScript,
      from: $el.getAttribute('data-feedbackok-from') || undefined,
      pid: $el.getAttribute(TRIGGER_ATTR_NAME) || configFromScript.pid,
      popup: true,
    })
    iframe.style.display = 'block'
    popper = createPopper($el, iframe, {
      placement: 'bottom',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    })
  }
})

// Support turbolinks
document.addEventListener('turbolinks:load', () => {
  ensureIframe()
})
