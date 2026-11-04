const views = {
  dashboard: { load: () => import('@/views/dashboard'), name: 'RDashboard' },
  'demo/axios': {
    load: () => import('@/views/demo/axios/index'),
    name: 'RAxios',
  },
  'demo/barcode-demo': {
    load: () => import('@/views/demo/barcode-demo'),
    name: 'BarcodeDemo',
  },
  'demo/cache-demo': {
    load: () => import('@/views/demo/cache-demo/index'),
    name: 'CacheDemo',
  },
  'demo/context-menu': {
    load: () => import('@/views/demo/context-menu/index'),
    name: 'ContextMenuDemo',
  },
  'demo/directive': {
    load: () => import('@/views/demo/directive/index'),
    name: 'RDirective',
  },
  'demo/doc': {
    load: () => import('@/views/demo/doc'),
    name: 'RTemplateDoc',
  },
  'demo/draggable-card': {
    load: () => import('@/views/demo/draggable-card'),
    name: 'DraggableCardDemo',
  },
  'demo/echart': {
    load: () => import('@/views/demo/echart/index'),
    name: 'REchart',
  },
  'demo/flow-demo': {
    load: () => import('@/views/demo/flow-demo'),
    name: 'RFlowDemo',
  },
  'demo/form': { load: () => import('@/views/demo/form'), name: 'RFormDemo' },
  'demo/hooks/web-hooks': {
    load: () => import('@/views/demo/hooks/web-hooks'),
    name: 'WebHooks',
  },
  'demo/iframe': {
    load: () => import('@/views/demo/iframe/index'),
    name: 'IframeDemo',
  },
  'demo/layout-demo': {
    load: () => import('@/views/demo/layout-demo'),
    name: 'LayoutDemo',
  },
  'demo/modal-demo': {
    load: () => import('@/views/demo/modal-demo/index'),
    name: 'ModalDemo',
  },
  'demo/multi/views/multi-menu-one': {
    load: () => import('@/views/demo/multi/views/multi-menu-one/index'),
    name: 'MultiMenuOne',
  },
  'demo/multi/views/multi-menu-two/views/sub-menu-other': {
    load: () =>
      import('@/views/demo/multi/views/multi-menu-two/views/sub-menu-other/index'),
    name: 'SubMenuOther',
  },
  'demo/multi/views/multi-menu-two/views/sub-menu/views/multi-menu-two-one': {
    load: () =>
      import('@/views/demo/multi/views/multi-menu-two/views/sub-menu/views/multi-menu-two-one/index'),
    name: 'MultiMenuTwoOne',
  },
  'demo/precision': {
    load: () => import('@/views/demo/precision/index'),
    name: 'CalculatePrecision',
  },
  'demo/qrcode': {
    load: () => import('@/views/demo/qrcode/index'),
    name: 'RQRCodeDemo',
  },
  'demo/rely/views/rely-about': {
    load: () => import('@/views/demo/rely/views/rely-about/index'),
    name: 'RelyAbout',
  },
  'demo/router-demo/router-demo-detail': {
    load: () => import('@/views/demo/router-demo/router-demo-detail/index'),
    name: 'RouterDemoDetail',
  },
  'demo/router-demo/router-demo-home': {
    load: () => import('@/views/demo/router-demo/router-demo-home/index'),
    name: 'RouterDemoHome',
  },
  'demo/scroll-reveal': {
    load: () => import('@/views/demo/scroll-reveal/index'),
    name: 'ScrollReveal',
  },
  'demo/segment': {
    load: () => import('@/views/demo/segment'),
    name: 'SegmentDemo',
  },
  'demo/svg-icons': {
    load: () => import('@/views/demo/svg-icons/index'),
    name: 'PreviewSVGIcons',
  },
  'demo/tables/auto-height': {
    load: () => import('@/views/demo/tables/auto-height'),
    name: 'TableDemoAutoHeight',
  },
  'demo/tables/basic': {
    load: () => import('@/views/demo/tables/basic'),
    name: 'TableDemoBasic',
  },
  'demo/tables/columns': {
    load: () => import('@/views/demo/tables/columns'),
    name: 'TableDemoColumns',
  },
  'demo/tables/custom': {
    load: () => import('@/views/demo/tables/custom'),
    name: 'TableDemoCustom',
  },
  'demo/tables/printing': {
    load: () => import('@/views/demo/tables/printing'),
    name: 'TableDemoPrinting',
  },
  'demo/tables/remote': {
    load: () => import('@/views/demo/tables/remote'),
    name: 'TableDemoRemote',
  },
  'demo/template-hooks': {
    load: () => import('@/views/demo/template-hooks/index'),
    name: 'TemplateHooks',
  },
}

export type RouteViewId = keyof typeof views

export const routeViewCatalog = Object.entries(views).map(([id, { name }]) => ({
  id,
  name,
}))

const viewIds = new Map(
  Object.entries(views).map(([id, { load }]) => [load, id]),
)

export const routeView = (id: RouteViewId) => views[id].load

export const findRouteView = (id: string) =>
  Object.hasOwn(views, id) ? views[id as RouteViewId] : void 0

export const findRouteViewId = (loader: unknown) =>
  typeof loader === 'function'
    ? viewIds.get(loader as ReturnType<typeof routeView>)
    : void 0
