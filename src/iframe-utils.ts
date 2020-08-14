export function getParent() {
  return typeof window !== 'undefined' && window.parent
}

export function closeIframe() {
  const parent = getParent()
  if (parent) {
    window.parent.postMessage({ type: 'feedbackok-close' }, '*')
  }
}

export function resizeIframe(height: number) {
  const parent = getParent()
  if (parent) {
    window.parent.postMessage({ type: 'feedbackok-resize', data: height }, '*')
  }
}
