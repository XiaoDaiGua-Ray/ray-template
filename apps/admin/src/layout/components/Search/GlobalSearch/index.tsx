import './index.scss'
import { RIcon } from '@/components'
import { useI18n } from '@/hooks'
import { positionSelectedMenuItem } from '@/layout/utils/position-selected-menu-item'
import {
  useMenuActions,
  useMenuGetters,
  useNavigationHistoryActions,
  useNavigationHistoryGetters,
} from '@/store'
import type { AppMenuOption } from '@/types'
import { useEventListener } from '@vueuse/core'
import { NButton, NCard, NInput, NModal, NScrollbar } from 'naive-ui'
import type { InputInst } from 'naive-ui'

export default defineComponent({
  name: 'GlobalSearch',
  props: { show: { type: Boolean, default: false } },
  emits: ['update:show'],
  setup(props, { emit }) {
    const { t } = useI18n('navigationSearch')
    const { changeMenuModelValue } = useMenuActions()
    const { getMenuOptions } = useMenuGetters()
    const { recentPaths, favoritePaths, storageUnavailable } =
      useNavigationHistoryGetters()
    const { recordVisit, toggleFavorite, clearRecent } =
      useNavigationHistoryActions()
    const input = shallowRef<InputInst>()
    const inputId = useId()
    const searchValue = ref('')
    const activeIndex = ref(0)
    const rowButtons = new Map<string, HTMLButtonElement>()
    const resetSearch = () => {
      searchValue.value = ''
      activeIndex.value = 0
    }
    const modelShow = computed({
      get: () => props.show,
      set: (value) => {
        emit('update:show', value)

        if (!value) resetSearch()
      },
    })
    const visibleLeaves = computed(() => {
      const leaves: AppMenuOption[] = []
      const visit = (items: AppMenuOption[]) => {
        for (const item of items) {
          if (item.show === false) continue

          if (item.children?.length) visit(item.children)
          else leaves.push(item)
        }
      }

      visit(getMenuOptions.value)

      return leaves
    })
    const menuByPath = computed(
      () => new Map(visibleLeaves.value.map((item) => [item.fullPath, item])),
    )
    const savedOptions = (paths: readonly string[]) =>
      paths.flatMap((path) => {
        const option = menuByPath.value.get(path)

        return option ? [option] : []
      })
    const groups = computed(() => {
      const term = searchValue.value.trim().toLocaleLowerCase()

      if (term)
        return [
          {
            key: 'results',
            options: visibleLeaves.value.filter((item) =>
              item.breadcrumbLabel?.toLocaleLowerCase().includes(term),
            ),
          },
        ]

      return [
        { key: 'favorites', options: savedOptions(favoritePaths.value) },
        {
          key: 'recent',
          options: savedOptions(
            recentPaths.value.filter(
              (path) => !favoritePaths.value.includes(path),
            ),
          ),
        },
      ].filter(({ options }) => options.length)
    })
    const options = computed(() =>
      groups.value.flatMap((group) => group.options),
    )

    watch(options, () => {
      activeIndex.value = 0
    })
    watch(
      () => props.show,
      (show) => {
        if (show) resetSearch()
      },
    )

    const openPage = async (option: AppMenuOption) => {
      // 从当前菜单重新解析，缓存里的旧路径不能绕过权限或路由来源变化。
      const current = menuByPath.value.get(option.fullPath)

      if (!current) return

      await changeMenuModelValue(current.fullPath, current)

      if (current.meta.windowOpen) recordVisit(current.fullPath)
      else {
        modelShow.value = false
        positionSelectedMenuItem()
      }
    }
    const moveResult = (event: KeyboardEvent, fromInput = false) => {
      if (event.isComposing || !options.value.length) return

      if (fromInput && event.key === 'Enter') {
        event.preventDefault()
        void openPage(options.value[activeIndex.value]!)

        return
      }

      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

      event.preventDefault()
      const count = options.value.length

      activeIndex.value = fromInput
        ? event.key === 'ArrowDown'
          ? 0
          : count - 1
        : (activeIndex.value + (event.key === 'ArrowDown' ? 1 : -1) + count) %
          count
      const button = rowButtons.get(options.value[activeIndex.value]!.fullPath)

      button?.focus({ preventScroll: true })
      button?.scrollIntoView?.({ block: 'nearest' })
    }
    const toggle = (path: string) => {
      toggleFavorite(path)

      if (!searchValue.value.trim()) void nextTick(() => input.value?.focus())
    }

    useEventListener(window, 'keydown', (event: KeyboardEvent) => {
      if (event.isComposing || modelShow.value) return

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        resetSearch()
        modelShow.value = true
      }
    })

    return () => (
      <NModal
        show={modelShow.value}
        onUpdateShow={(value) => {
          modelShow.value = value
        }}
        onAfterEnter={() => input.value?.focus()}
        transformOrigin="center"
        displayDirective="if"
      >
        <NCard
          class="global-search"
          role="dialog"
          aria-modal="true"
          aria-label={t('title')}
        >
          {{
            header: () => (
              <div class="global-search__header">
                <label for={inputId}>{t('title')}</label>
                <NButton
                  quaternary
                  size="small"
                  aria-label={t('close')}
                  onClick={() => {
                    modelShow.value = false
                  }}
                >
                  <RIcon name="action/close" />
                </NButton>
              </div>
            ),
            default: () => (
              <>
                <NInput
                  ref={input}
                  size="large"
                  value={searchValue.value}
                  onUpdateValue={(value) => {
                    searchValue.value = value
                  }}
                  placeholder={t('placeholder')}
                  inputProps={{
                    id: inputId,
                    name: 'page-search',
                    autocapitalize: 'off',
                    spellcheck: false,
                  }}
                  onKeydown={(event) => moveResult(event, true)}
                  clearable
                >
                  {{ prefix: () => <RIcon name="action/search" /> }}
                </NInput>
                {storageUnavailable.value && (
                  <p class="global-search__hint" role="status">
                    {t('storageUnavailable')}
                  </p>
                )}
                <NScrollbar class="global-search__results">
                  {options.value.length ? (
                    groups.value.map((group) => (
                      <section class="global-search__group" key={group.key}>
                        <div class="global-search__group-heading">
                          <h2>{t(group.key)}</h2>
                        </div>
                        <ul role="list">
                          {group.options.map((option) => {
                            const favorite = favoritePaths.value.includes(
                              option.fullPath,
                            )

                            return (
                              <li
                                key={option.fullPath}
                                class="global-search__item"
                              >
                                <button
                                  type="button"
                                  class="global-search__destination"
                                  ref={(element) => {
                                    if (element instanceof HTMLButtonElement)
                                      rowButtons.set(option.fullPath, element)
                                    else rowButtons.delete(option.fullPath)
                                  }}
                                  onFocus={() => {
                                    activeIndex.value =
                                      options.value.indexOf(option)
                                  }}
                                  onKeydown={(event) => moveResult(event)}
                                  onClick={() => void openPage(option)}
                                >
                                  {typeof option.meta.icon === 'string' &&
                                  option.meta.icon ? (
                                    <RIcon name={option.meta.icon} size={20} />
                                  ) : (
                                    <RIcon name="navigation/menu" size={20} />
                                  )}
                                  <span>{option.breadcrumbLabel}</span>
                                  {option.meta.windowOpen && (
                                    <RIcon
                                      name="action/external-link"
                                      size={14}
                                    />
                                  )}
                                </button>
                                <NButton
                                  quaternary
                                  size="small"
                                  class="global-search__favorite"
                                  type={favorite ? 'primary' : 'default'}
                                  aria-pressed={favorite}
                                  aria-label={t(
                                    favorite ? 'removeFavorite' : 'addFavorite',
                                    { title: option.breadcrumbLabel },
                                  )}
                                  onClick={() => toggle(option.fullPath)}
                                >
                                  <span aria-hidden="true">
                                    {favorite ? '★' : '☆'}
                                  </span>
                                </NButton>
                              </li>
                            )
                          })}
                        </ul>
                      </section>
                    ))
                  ) : (
                    <p class="global-search__empty">
                      {t(searchValue.value.trim() ? 'noResults' : 'empty')}
                    </p>
                  )}
                </NScrollbar>
              </>
            ),
            action: () => (
              <div class="global-search__help">
                <span class="global-search__shortcut">
                  <kbd>↑</kbd> <kbd>↓</kbd> {t('move')}
                </span>
                <span class="global-search__shortcut">
                  <kbd>↵</kbd> {t('open')}
                </span>
                <span class="global-search__shortcut">
                  <kbd>Esc</kbd> {t('close')}
                </span>
                {recentPaths.value.length > 0 && (
                  <NButton text size="tiny" onClick={clearRecent}>
                    {t('clearRecent')}
                  </NButton>
                )}
              </div>
            ),
          }}
        </NCard>
      </NModal>
    )
  },
})
