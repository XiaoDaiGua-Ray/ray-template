import { installAutocompleteDefaults } from '@/app-components/provider/AppAutocompleteDefaults'

describe('autocomplete defaults', () => {
  it('handles present and newly mounted controls and respects explicit opt-ins', async () => {
    const root = document.createElement('div')

    root.innerHTML =
      '<input><input autocomplete="email"><form autocomplete="on"><textarea></textarea></form>'
    const stop = installAutocompleteDefaults(root)

    try {
      expect(root.querySelector('input')?.autocomplete).toBe('off')
      expect(root.querySelector('input[autocomplete=email]')).not.toBeNull()
      expect(root.querySelector('textarea')?.hasAttribute('autocomplete')).toBe(
        false,
      )

      const portal = document.createElement('div')

      portal.innerHTML = '<input type="search"><textarea></textarea>'
      root.append(portal)
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(portal.querySelector('input')?.autocomplete).toBe('off')
      expect(portal.querySelector('textarea')?.autocomplete).toBe('off')
    } finally {
      stop()
    }
  })
})
