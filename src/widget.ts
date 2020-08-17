import { createPopper, Instance as PopperInstance } from '@popperjs/core'
import { stringify } from 'querystringify'
import { getCurrentScript } from 'tiny-current-script'
import uid from 'uid'
import { preload } from './preload'

const TRIGGER_ATTR_NAME = `data-feedbackok-trigger`
const INLINE_ATTR_NAME = `data-feedbackok-inline`
const POPUP_IFRAME_ID = uid(4)
let popper: PopperInstance | undefined

const currentScript = getCurrentScript()

if (!currentScript) {
  throw new Error(`Unsupported browser, please upgrade!`)
}

const globalPid = currentScript.getAttribute('data-pid')

const hidePopper = () => {
  const iframe = getExistingIframe(POPUP_IFRAME_ID)
  if (iframe) {
    iframe.style.display = 'none'
  }
  if (popper) {
    try {
      popper.destroy()
    } catch (err) {}
    popper = undefined
  }
}

window.addEventListener('message', (e) => {
  const data = e.data
  if (typeof data !== 'object') return
  if (data.type === 'feedbackok-close') {
    hidePopper()
  } else if (data.type === 'feedbackok-resize') {
    const iframe = getExistingIframe(data.iframe)
    if (iframe) {
      iframe.height = data.data
    }
  }
})

const getExistingIframe = (id: string) => {
  const existing = document.getElementById(id) as HTMLIFrameElement
  if (existing) {
    return existing
  }
}

const getIframeSrc = (options: any) => {
  const EMBED_HTML =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:4000/embed.html`
      : `https://cdn.feedbackok.com/embed.html`
  return `${EMBED_HTML}#${stringify(options)}`
}

const createIframe = (id: string) => {
  const iframe = document.createElement('iframe')
  iframe.id = id
  iframe.src = getIframeSrc({ show: false })
  iframe.style.display = 'none'
  iframe.style.border = 'none'
  iframe.style.boxShadow = `0 18px 50px -10px rgba(0, 0, 0, 0.2)`
  iframe.style.overflow = 'hidden'
  iframe.style.borderRadius = '6px'
  iframe.width = '320'
  iframe.height = '166'

  return iframe
}

const ensurePopupIframe = () => {
  let iframe = getExistingIframe(POPUP_IFRAME_ID)
  if (!iframe) {
    iframe = createIframe(POPUP_IFRAME_ID)
    document.body.appendChild(iframe)
  }
  return iframe
}

const renderInline = (
  $el: HTMLElement,
  { pid, iframeId }: { pid?: string; iframeId?: string } = {},
) => {
  if ($el.firstChild) {
    $el.removeChild($el.firstChild)
  }
  iframeId = iframeId || uid(4)
  const $iframe = createIframe(iframeId)
  $iframe.id = `feedbackok_${iframeId}`
  $el.appendChild($iframe)
  showIframe($el, $iframe, { pidAttr: INLINE_ATTR_NAME, pid })
  $el.removeAttribute(INLINE_ATTR_NAME)
}

const replaceInline = () => {
  const els = document.body.querySelectorAll(
    `[${INLINE_ATTR_NAME}]`,
  ) as NodeListOf<HTMLElement>
  els.forEach(($el) => {
    renderInline($el)
  })
}

const showIframe = (
  $el: HTMLElement,
  $iframe: HTMLIFrameElement,
  { pidAttr, pid }: { pidAttr: string; pid?: string },
) => {
  const isInline = pidAttr === INLINE_ATTR_NAME
  $iframe.src = getIframeSrc({
    from: $el.getAttribute(`data-feedbackok-from`) || undefined,
    pid: pid || $el.getAttribute(pidAttr) || globalPid,
    inline: isInline,
    iframe: $iframe.id,
    show: true,
  })
  $iframe.style.display = 'block'
}

document.addEventListener('mouseover', (e: any) => {
  const $el: HTMLElement | null =
    e.target.closest && e.target.closest(`[${TRIGGER_ATTR_NAME}]`)

  if (!$el) return

  const pid = $el.getAttribute(TRIGGER_ATTR_NAME) || globalPid
  if (pid) {
    preload(pid)
  }
})

document.addEventListener('click', (e: any) => {
  const $el: HTMLElement | null = e.target.closest(`[${TRIGGER_ATTR_NAME}]`)

  if (!$el) return

  e.preventDefault()

  if (popper && popper.state.elements.reference === $el) {
    hidePopper()
    return
  }

  const iframe = ensurePopupIframe()

  showIframe($el, iframe, { pidAttr: TRIGGER_ATTR_NAME })
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
})

function onDomReady() {
  ensurePopupIframe()

  replaceInline()
}

if (document.readyState === 'interactive') {
  onDomReady()
} else {
  document.addEventListener('DOMContentLoaded', onDomReady)
}

// Support turbolinks
document.addEventListener('turbolinks:load', () => {
  hidePopper()
  ensurePopupIframe()
  replaceInline()
})

// @ts-ignore
window.feedbackok_widget = {
  renderInline,
}
