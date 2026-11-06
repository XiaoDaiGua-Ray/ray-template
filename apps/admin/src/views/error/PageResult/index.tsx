import './index.scss'
import AppPageHeader from '@/app-components/app/AppPageHeader'
import { RIcon } from '@/components'
import { useI18n } from '@/hooks'
import { WELCOME_ROUTE_PATH } from '@/router/constant'
import { resolveLandingPath } from '@/router/utils/resolve-landing-path'
import { NButton, NFlex, NResult, resultProps } from 'naive-ui'

const statusKeys = {
  '403': 'forbidden',
  '404': 'notFound',
  '500': 'serverError',
} as const

export default defineComponent({
  name: 'PageResult',
  props: { ...resultProps },
  setup(props, { slots }) {
    const { t } = useI18n('workspaceStates')
    const router = useRouter()
    const route = useRoute()
    const statusKey = computed(
      () =>
        statusKeys[props.status as keyof typeof statusKeys] ?? 'unavailable',
    )
    const retryTarget = computed(() =>
      props.status === '500'
        ? resolveLandingPath(router, route.query.from)
        : WELCOME_ROUTE_PATH,
    )
    const previousTarget = () =>
      resolveLandingPath(router, router.options.history.state.back)
    const openWorkspace = () => router.replace(WELCOME_ROUTE_PATH)

    return () => {
      const retry = retryTarget.value !== WELCOME_ROUTE_PATH
      const previous = previousTarget()
      const code = Object.hasOwn(statusKeys, props.status) ? props.status : null

      return (
        <section class="error-page">
          <NResult {...props} title={void 0} description={void 0}>
            {{
              ...slots,
              icon:
                slots.icon ??
                (() => (
                  <div class="error-page__mark" aria-hidden="true">
                    {code ? (
                      <span>{code}</span>
                    ) : (
                      <RIcon name="status/question" size={64} />
                    )}
                  </div>
                )),
              default: () => (
                <>
                  <AppPageHeader
                    eyebrow={t(`${statusKey.value}.eyebrow`)}
                    title={props.title ?? t(`${statusKey.value}.title`)}
                    description={
                      props.description ?? t(`${statusKey.value}.description`)
                    }
                  />
                  {slots.default?.()}
                </>
              ),
              footer:
                slots.footer ??
                (() => (
                  <NFlex align="center" justify="center" size={12}>
                    {retry && (
                      <NButton
                        type="primary"
                        onClick={() => router.replace(retryTarget.value)}
                      >
                        {t('actions.retry')}
                      </NButton>
                    )}
                    <NButton
                      type={retry ? 'default' : 'primary'}
                      onClick={openWorkspace}
                    >
                      {t('actions.workspace')}
                    </NButton>
                    {!retry && previous !== WELCOME_ROUTE_PATH && (
                      <NButton onClick={() => router.replace(previousTarget())}>
                        {t('actions.back')}
                      </NButton>
                    )}
                  </NFlex>
                )),
            }}
          </NResult>
        </section>
      )
    }
  },
})
