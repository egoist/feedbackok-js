import * as React from 'react'
import clsx from 'clsx'
import { CloseIcon } from './CloseIcon'
import { createStyles } from './styles'
import { css } from 'emotion'
import { IssueIcon } from './IssueIcon'
import { IdeaIcon } from './IdeaIcon'
import { OtherIcon } from './OtherIcon'
import type { Config } from './config'
import { useProjectData } from './useProjectData'
import { API_ENDPOINT } from './constants'
import { Spinner } from './Spinner'
import { closeIframe, getParent, resizeIframe } from './iframe-utils'
import { SetRequired } from './types/set-required'

export type { Config }

export type FormConfig = SetRequired<Config, 'pid'>

export * from './constants'

export const FeedbackForm: React.FC<{
  config: FormConfig
}> = ({ config }) => {
  if (!config.pid) {
    return null
  }

  const { styles, theme } = createStyles()
  const [emotionIndex, setEmotionIndex] = React.useState<number | undefined>(
    undefined,
  )
  const [content, setContent] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)

  const project = useProjectData(config.pid)

  React.useEffect(() => {
    setTimeout(() => {
      const parent = getParent()
      if (parent && rootRef.current) {
        let height = rootRef.current.clientHeight
        if (config.iframe) {
          resizeIframe(height, config.iframe)
        }
      }
    })
  }, [emotionIndex, successMessage, errorMessage, project.isLoading])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)
    fetch(`${API_ENDPOINT}/feedback/${config.pid}`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        emotion_index: emotionIndex,
        from: config.from || undefined,
      }),
    }).then((res) => {
      setIsSubmitting(false)
      if (res.ok) {
        setSuccessMessage('🙏 Thank you for the feedback!')
      } else {
        setErrorMessage('Error')
      }
    })
  }

  const reset = () => {
    setSuccessMessage('')
    setEmotionIndex(undefined)
    setContent('')
  }

  const closeButtonForResult = config.popup && (
    <button
      className={clsx(
        styles.iconButton,
        css({
          top: '20px',
          right: '20px',
        }),
      )}
      onClick={closeIframe}
    >
      <CloseIcon />
    </button>
  )

  if (project.isLoading) {
    return (
      <>
        <div
          ref={rootRef}
          className={clsx(
            styles.root,
            css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
            }),
          )}
        >
          <Spinner size="30px" themeColor={theme.themeColor} />
        </div>
      </>
    )
  }

  if (project.error || errorMessage) {
    return (
      <div ref={rootRef} className={styles.root}>
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          {closeButtonForResult}
          {project.error || errorMessage}
        </div>
      </div>
    )
  }

  if (successMessage) {
    return (
      <div className={styles.root} ref={rootRef}>
        {closeButtonForResult}
        <div className="success-checkmark">
          <div className="check-icon">
            <span className="icon-line line-tip" />
            <span className="icon-line line-long" />
            <div className="icon-circle" />
            <div className="icon-fix" />
          </div>
        </div>
        <div
          className={css`
            text-align: center;
          `}
        >
          {successMessage}
        </div>
        <div className={css({ textAlign: 'center', paddingTop: '5px' })}>
          <span
            onClick={reset}
            className={css({
              borderRadius: '3px',
              color: theme.themeColor,
              cursor: 'pointer',
              fontSize: '13px',
            })}
          >
            Submit another feedback
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root} ref={rootRef}>
      {project.data.emotions && (
        <div className={styles.header}>
          <div className={styles.title} style={{ margin: '0 20px' }}>
            {emotionIndex === undefined
              ? `Give us feedback`
              : `What's on your mind?`}
          </div>
          {config.popup && (
            <button
              className={clsx(
                styles.iconButton,
                css({
                  right: 0,
                }),
              )}
              onClick={closeIframe}
            >
              <CloseIcon />
            </button>
          )}
        </div>
      )}

      <>
        <div
          className={css({ display: 'flex', justifyContent: 'space-around' })}
        >
          {project.data.emotions.map((emotion, index) => {
            return (
              <div
                className={css({
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  fontWeight: 500,
                  flexDirection: 'column',
                  textAlign: 'center',
                  transition: 'transform .3s cubic-bezier(0.19, 1, 0.22, 1) 0s',
                  opacity:
                    emotionIndex === undefined || emotionIndex === index
                      ? '1'
                      : '0.5',
                  transform: emotionIndex === index ? 'scale(1.2)' : undefined,
                  '&:hover': {
                    transform: 'scale(1.2)',
                  },
                })}
                onClick={() => setEmotionIndex(index)}
              >
                {project.data.notEmoji &&
                  (index === 0 ? (
                    <IssueIcon />
                  ) : index === 1 ? (
                    <IdeaIcon />
                  ) : (
                    <OtherIcon />
                  ))}
                <span
                  className={css({
                    textTransform: 'capitalize',
                    fontSize: project.data.notEmoji ? '1rem' : '2.3rem',
                  })}
                >
                  {emotion}
                </span>
              </div>
            )
          })}
        </div>
        {emotionIndex === undefined && (
          <div
            className={css({
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '12px',
              bottom: '15px',
              width: '100%',
            })}
          >
            Powered by{' '}
            <a
              className={css({
                fontWeight: 600,
                color: 'inherit',
                textDecoration: 'none',
              })}
              href="https://feedbackok.com"
              target="_blank"
            >
              Feedback OK
            </a>
          </div>
        )}
      </>

      {typeof emotionIndex === 'number' && (
        <form onSubmit={handleSubmit} className={css({ marginTop: '20px' })}>
          <textarea
            className={css({
              width: '100%',
              borderRadius: '6px',
              border: `1px solid ${theme.inputBorderColor}`,
              padding: '10px',
              boxSizing: 'border-box',
              resize: 'none',
              '&:focus': {
                outline: 'none',
                boxShadow: `0 0 0 3px ${theme.inputShadowColor}`,
              },
            })}
            value={content}
            onInput={(e: any) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!content || isSubmitting}
          >
            {isSubmitting && <Spinner themeColor={theme.themeColor} />} Send
            Feedback
          </button>
        </form>
      )}
    </div>
  )
}
