import { h, FunctionalComponent, Fragment } from 'preact'
import { useState } from 'preact/hooks'
import clsx from 'clsx'
import { BackIcon } from './BackIcon'
import { CloseIcon } from './CloseIcon'
import { createStyles } from './styles'
import { css } from 'emotion'
import { IssueIcon } from './IssueIcon'
import { IdeaIcon } from './IdeaIcon'
import { OtherIcon } from './OtherIcon'
import { Config } from './config'
import { useProjectData } from './useProjectData'
import { API_ENDPOINT } from './constants'
import { Spinner } from './Spinner'

export const FeedbackOK: FunctionalComponent<{
  config: Config
  close?: () => void
}> = ({ config, close }) => {
  if (!config.pid) {
    return null
  }

  const { styles, theme } = createStyles()
  const [emotionIndex, setEmotionIndex] = useState<number | undefined>(
    undefined,
  )
  const [content, setContent] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const project = useProjectData(config.pid)

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

  const closeButtonForResult = config.popup && close && (
    <button
      class={clsx(
        styles.iconButton,
        css({
          top: '20px',
          right: '20px',
        }),
      )}
      onClick={close}
    >
      <CloseIcon />
    </button>
  )

  if (project.isLoading) {
    return (
      <div
        class={clsx(
          styles.root,
          css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }),
        )}
      >
        <Spinner size="30px" themeColor={theme.themeColor} />
      </div>
    )
  }

  if (project.error || errorMessage) {
    return (
      <div
        class={clsx(
          styles.root,
          css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }),
        )}
      >
        {closeButtonForResult}
        {project.error || errorMessage}
      </div>
    )
  }

  if (successMessage) {
    return (
      <div class={styles.root}>
        {closeButtonForResult}
        <div class="success-checkmark">
          <div class="check-icon">
            <span class="icon-line line-tip" />
            <span class="icon-line line-long" />
            <div class="icon-circle" />
            <div class="icon-fix" />
          </div>
        </div>
        <div
          class={css`
            text-align: center;
          `}
        >
          {successMessage}
        </div>
        <div class={css({ textAlign: 'center', paddingTop: '5px' })}>
          <span
            onClick={reset}
            class={css({
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
    <div class={styles.root}>
      {project.data.emotions && (
        <div class={styles.header}>
          {typeof emotionIndex === 'number' && (
            <button
              class={clsx(
                styles.iconButton,
                css({
                  left: 0,
                }),
              )}
              onClick={() => setEmotionIndex(undefined)}
            >
              <BackIcon />
            </button>
          )}
          <div class={styles.title} style="margin:0 20px;">
            {emotionIndex === undefined
              ? `Give us feedback`
              : `What's on your mind?`}
          </div>
          {config.popup && close && (
            <button
              class={clsx(
                styles.iconButton,
                css({
                  right: 0,
                }),
              )}
              onClick={close}
            >
              <CloseIcon />
            </button>
          )}
        </div>
      )}
      {emotionIndex === undefined && (
        <Fragment>
          <div class={css({ display: 'flex', justifyContent: 'space-around' })}>
            {project.data.emotions.map((emotion, index) => {
              return (
                <div
                  class={css({
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 500,
                    flexDirection: 'column',
                    textAlign: 'center',
                    transition:
                      'transform .3s cubic-bezier(0.19, 1, 0.22, 1) 0s',
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
                    class={css({
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
          <div
            class={css({
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '12px',
              position: 'absolute',
              bottom: '15px',
              width: '100%',
              left: 0,
            })}
          >
            Powered by{' '}
            <a
              class={css({
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
        </Fragment>
      )}
      {typeof emotionIndex === 'number' && (
        <form onSubmit={handleSubmit}>
          <textarea
            class={css({
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
            class={styles.submitButton}
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
