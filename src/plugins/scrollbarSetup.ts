import { darkTheme, lightTheme } from 'naive-ui'

function setupScrollbarStyle() {
  const style = document.createElement('style')
  const styleContent = `
    //light theme
    // ::-webkit-scrollbar {
    //   background-color: transparent;
    //   width: ${lightTheme.Scrollbar.common?.scrollbarWidth};
    // }
    // ::-webkit-scrollbar-thumb {
    //   background-color: ${lightTheme.Scrollbar.common?.scrollbarColor};
    //   border-radius: ${lightTheme.Scrollbar.common?.scrollbarBorderRadius};
    // }
    ::-webkit-scrollbar {
      background-color: transparent;
      width: ${darkTheme.Scrollbar.common?.scrollbarWidth};
    }
    ::-webkit-scrollbar-thumb {
      background-color: ${darkTheme.Scrollbar.common?.scrollbarColor};
      border-radius: ${darkTheme.Scrollbar.common?.scrollbarBorderRadius};
    }
  `

  style.innerHTML = styleContent
  document.head.appendChild(style)
}

export default setupScrollbarStyle
