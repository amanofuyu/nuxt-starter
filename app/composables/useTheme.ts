import { computed } from 'vue'

type Theme = 'light' | 'dark'

export function useTheme() {
  const theme = useState<Theme>('colorway-theme', () => 'light')

  function applyTheme(nextTheme: Theme) {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark')
      window.localStorage.setItem('colorway-theme', nextTheme)
    }
  }

  function setTheme(nextTheme: Theme) {
    theme.value = nextTheme
    applyTheme(nextTheme)
  }

  onMounted(() => {
    const savedTheme = window.localStorage.getItem('colorway-theme') as Theme | null
    setTheme(savedTheme ?? 'light')
  })

  const resolvedTheme = computed(() => theme.value)

  return {
    resolvedTheme,
    setTheme,
    theme,
  }
}
