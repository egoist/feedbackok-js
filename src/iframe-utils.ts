const getIframeId = () =>
  typeof window !== 'undefined' && window.frameElement && window.frameElement.id

export function getParent() {
  return typeof window !== 'undefined' && window.parent
}

export function closeIframe() {
  const parent = getParent()
  if (parent) {
    window.parent.postMessage({ type: 'feedbackok-close' }, '*')
  }
}

export function resizeIframe(height: number, iframe: string) {
  const parent = getParent()
  if (parent) {
    window.parent.postMessage(
      { type: 'feedbackok-resize', iframe, data: height },
      '*',
    )
  }
}
