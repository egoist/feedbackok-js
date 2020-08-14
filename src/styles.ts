import { css, injectGlobal } from 'emotion'

export type Theme = {
  themeColor?: string
  bg?: string
  textColor?: string
  emotionBg?: string
  emotionHoverBg?: string
  inputBorderColor?: string
  inputShadowColor?: string
  iconButtonColor?: string
  iconButtonHoverColor?: string
  buttonDisabledBg?: string
  buttonDisabledColor?: string
}

export const createStyles = (_theme?: Theme) => {
  injectGlobal({
    body: {
      margin: 0,
    },
    '*': {
      boxSizing: 'border-box',
    },
  })

  injectGlobal`
  body::-webkit-scrollbar {
    display: none;
  }

  body {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  .success-checkmark {
    width: 80px;
    height: 100px;
    margin: 0 auto;
    
    .check-icon {
        width: 80px;
        height: 80px;
        position: relative;
        border-radius: 50%;
        box-sizing: content-box;
        border: 4px solid #4CAF50;
        
        &::before {
            top: 3px;
            left: -2px;
            width: 30px;
            transform-origin: 100% 50%;
            border-radius: 100px 0 0 100px;
        }
        
        &::after {
            top: 0;
            left: 30px;
            width: 60px;
            transform-origin: 0 50%;
            border-radius: 0 100px 100px 0;
            animation: rotate-circle 4.25s ease-in;
        }
        
        &::before, &::after {
            content: '';
            height: 100px;
            position: absolute;
            background: #FFFFFF;
            transform: rotate(-45deg);
        }
        
        .icon-line {
            height: 5px;
            background-color: #4CAF50;
            display: block;
            border-radius: 2px;
            position: absolute;
            z-index: 10;
            
            &.line-tip {
                top: 46px;
                left: 14px;
                width: 25px;
                transform: rotate(45deg);
                animation: icon-line-tip 0.75s;
            }
            
            &.line-long {
                top: 38px;
                right: 8px;
                width: 47px;
                transform: rotate(-45deg);
                animation: icon-line-long 0.75s;
            }
        }
        
        .icon-circle {
            top: -4px;
            left: -4px;
            z-index: 10;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            position: absolute;
            box-sizing: content-box;
            border: 4px solid rgba(76, 175, 80, .5);
        }
        
        .icon-fix {
            top: 8px;
            width: 5px;
            left: 26px;
            z-index: 1;
            height: 85px;
            position: absolute;
            transform: rotate(-45deg);
            background-color: #FFFFFF;
        }
    }
}

@keyframes rotate-circle {
    0% {
        transform: rotate(-45deg);
    }
    5% {
        transform: rotate(-45deg);
    }
    12% {
        transform: rotate(-405deg);
    }
    100% {
        transform: rotate(-405deg);
    }
}

@keyframes icon-line-tip {
    0% {
        width: 0;
        left: 1px;
        top: 19px;
    }
    54% {
        width: 0;
        left: 1px;
        top: 19px;
    }
    70% {
        width: 50px;
        left: -8px;
        top: 37px;
    }
    84% {
        width: 17px;
        left: 21px;
        top: 48px;
    }
    100% {
        width: 25px;
        left: 14px;
        top: 45px;
    }
}

@keyframes icon-line-long {
    0% {
        width: 0;
        right: 46px;
        top: 54px;
    }
    65% {
        width: 0;
        right: 46px;
        top: 54px;
    }
    84% {
        width: 55px;
        right: 0px;
        top: 35px;
    }
    100% {
        width: 47px;
        right: 8px;
        top: 38px;
    }
}
  `
  const theme = Object.assign<Theme, Theme | undefined>(
    {
      themeColor: '#26c6da',
      bg: '#fff',
      textColor: 'inherit',
      emotionBg: '#f7fafc',
      emotionHoverBg: '#edf2f7',
      inputBorderColor: '#cbd5e0',
      inputShadowColor: '#26c6da',
      iconButtonColor: '#cbd5e0',
      iconButtonHoverColor: '#999',
      buttonDisabledBg: '#E2E8F0',
      buttonDisabledColor: '#A0AEC0',
    },
    _theme,
  ) as Required<Theme>
  const styles = {
    root: css({
      fontFamily: 'system-ui, sans-serif',
      padding: '20px',
      borderRadius: '10px',
      minWidth: '260px',
      maxWidth: '100%',
      backgroundColor: theme.bg,
      color: theme.textColor,
      position: 'relative',
    }),
    header: css({
      textAlign: 'center',
      margin: ' 0 0 20px 0',
      position: 'relative',
    }),
    title: css({
      textAlign: 'center',
      fontWeight: 600,
      fontSize: '1rem',
      padding: '0 20px',
    }),
    actions: css({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }),
    iconButton: css({
      width: '20px',
      height: '20px',
      color: theme.iconButtonColor,
      border: 'none',
      backgroundColor: 'transparent',
      display: 'inline-block',
      padding: 0,
      cursor: 'pointer',
      position: 'absolute',
      top: '2px',
      '&:hover': {
        color: theme.iconButtonHoverColor,
      },
      '&:focus': {
        outline: 'none',
      },
      '& svg': {
        width: '20px',
        height: '20px',
      },
    }),
    submitButton: css({
      borderRadius: '6px',
      boxSizing: 'border-box',
      backgroundColor: theme.themeColor,
      color: 'white',
      width: '100%',
      border: 0,
      padding: '10px',
      marginTop: '5px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.themeColor,
      },
      '&[disabled]': {
        backgroundColor: theme.buttonDisabledBg,
        color: theme.buttonDisabledColor,
        cursor: 'default',
      },
    }),
  }

  return {
    styles,
    theme,
  }
}
