import { h, FunctionalComponent } from 'preact'
import { css, keyframes } from 'emotion'

export const Spinner: FunctionalComponent<{
  themeColor?: string
  size?: string
}> = ({ themeColor, size }) => {
  return (
    <svg
      class={css({
        width: size || '1em',
        height: size || '1em',
        color: themeColor || '#999',
        animation: `${keyframes`
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
            `} 1s linear infinite`,
      })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading.."
    >
      <circle
        class={css({ opacity: '25%' })}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class={css({ opacity: '75%' })}
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}
