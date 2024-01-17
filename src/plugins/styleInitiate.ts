import '@/style/tailwind.css'

/** Tailwind's Preflight Style Override */
function naiveStyleOverride() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

export default function setupAssets() {
  naiveStyleOverride()
}
