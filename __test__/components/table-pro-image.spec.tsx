import { flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'
import { RTablePro, useTablePro } from '../../packages/ui/src/RTablePro'
import type {
  TableProInst,
  TableProResult,
} from '../../packages/ui/src/RTablePro'
import {
  copyTableImage,
  createTableImageSnapshot,
} from '../../packages/ui/src/RTablePro/src/image'
import { provideUiServices } from '../../packages/ui/src/services'

const renderer = vi.hoisted(() => ({
  create: vi.fn(),
  options: [] as Record<string, unknown>[],
  nodes: [] as HTMLElement[],
}))

vi.mock('@ray-template/composables/useDomToImage', () => ({
  useDomToImage: (node: HTMLElement, options: Record<string, unknown>) => {
    renderer.nodes.push(node)
    renderer.options.push(options)

    return { create: renderer.create }
  },
}))

class Item {
  constructor(readonly data: Record<string, Promise<Blob>>) {}
}

const png = () => new Blob(['png'], { type: 'image/png' })
let write: ReturnType<typeof vi.fn<(items: Item[]) => Promise<void>>>
let originalClipboard: PropertyDescriptor | undefined
const columns = [{ key: 'name', title: 'Name' }]
const data = [{ id: 1, name: 'Ray' }]
const tickCapture = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

beforeEach(() => {
  renderer.create.mockReset().mockResolvedValue(png())
  renderer.options.length = 0
  renderer.nodes.length = 0
  write = vi.fn(async ([item]) => {
    await item.data['image/png']
  })
  originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { write },
  })
  vi.stubGlobal('ClipboardItem', Item)
  vi.stubGlobal('isSecureContext', true)
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(640)
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(240)
})

afterEach(() => {
  document
    .querySelectorAll('[data-r-table-image-snapshot]')
    .forEach((node) => node.remove())

  if (originalClipboard)
    Object.defineProperty(navigator, 'clipboard', originalClipboard)
  else Reflect.deleteProperty(navigator, 'clipboard')

  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

it('requests clipboard writing synchronously and supplies an eventual PNG without retaining its snapshot', async () => {
  const target = document.createElement('div')

  target.textContent = 'Current table'
  document.body.append(target)

  try {
    const copying = copyTableImage(target, { pixelRatio: 1 })

    expect(write).toHaveBeenCalledOnce()
    expect(renderer.create).not.toHaveBeenCalled()
    expect(write.mock.calls[0][0][0].data['image/png']).toBeInstanceOf(Promise)
    await copying
    expect(renderer.create).toHaveBeenCalledExactlyOnceWith('blob')
    expect(renderer.options[0]).toMatchObject({
      imageType: 'blob',
      type: 'image/png',
      pixelRatio: 1,
    })
    expect(document.querySelector('[data-r-table-image-snapshot]')).toBeNull()
  } finally {
    target.remove()
  }
})

it('preserves scroll viewport and input state in an inert clone without touching the live table', () => {
  const target = document.createElement('div')

  target.innerHTML =
    '<div class="viewport"><div class="rows"><input type="checkbox"><input type="radio" name="snapshot-choice" checked autofocus><textarea>Initial</textarea></div></div>'
  const viewport = target.querySelector<HTMLElement>('.viewport')!

  viewport.scrollLeft = 80
  viewport.scrollTop = 120
  target.querySelector<HTMLInputElement>('input')!.checked = true
  target.querySelector<HTMLTextAreaElement>('textarea')!.value = 'Current'
  target.style.setProperty('--example-color', 'rgb(10, 20, 30)')
  document.body.append(target)

  const snapshot = createTableImageSnapshot(target)

  try {
    expect(snapshot.element.inert).toBe(true)
    expect(snapshot.element.getAttribute('aria-hidden')).toBe('true')
    expect(snapshot.element.style.width).toBe('640px')
    expect(snapshot.element.style.height).toBe('240px')
    expect(snapshot.element.style.getPropertyValue('--example-color')).toBe(
      'rgb(10, 20, 30)',
    )
    expect(
      snapshot.element.querySelector<HTMLElement>('.rows')!.style.transform,
    ).toContain('translate(-80px, -120px)')
    expect(
      snapshot.element.querySelector<HTMLInputElement>('input')!.defaultChecked,
    ).toBe(true)
    expect(
      snapshot.element.querySelector<HTMLTextAreaElement>('textarea')!.value,
    ).toBe('Current')
    expect(viewport.scrollLeft).toBe(80)
    expect(viewport.scrollTop).toBe(120)
    expect(target.querySelector<HTMLElement>('.rows')!.style.transform).toBe('')
    expect(
      target.querySelector<HTMLInputElement>('[type="radio"]')!.checked,
    ).toBe(true)
    expect(snapshot.element.querySelector('[name], [autofocus]')).toBeNull()
  } finally {
    snapshot.dispose()
    target.remove()
  }
})

it('removes active event attributes and scripts before connecting a snapshot', () => {
  const target = document.createElement('div')

  target.innerHTML =
    '<span onclick="throw 1">Cell</span><img onload="throw 1" onerror="throw 1"><script type="application/json">{}</script>'
  document.body.append(target)
  const snapshot = createTableImageSnapshot(target)

  try {
    expect(
      snapshot.element.querySelector('script, [onclick], [onload], [onerror]'),
    ).toBeNull()
    expect(target.querySelector('[onclick]')).not.toBeNull()
    expect(target.querySelector('script')).not.toBeNull()
  } finally {
    snapshot.dispose()
    target.remove()
  }
})

it.each(['iframe', 'object', 'embed', 'audio', 'video'])(
  'rejects %s content before creating a connected clone',
  (tag) => {
    const target = document.createElement('div')

    target.append(document.createElement(tag))
    vi.spyOn(target, 'isConnected', 'get').mockReturnValue(true)
    const clone = vi.spyOn(target, 'cloneNode')

    try {
      expect(() => createTableImageSnapshot(target)).toThrow('Embedded media')
      expect(clone).not.toHaveBeenCalled()
      expect(document.querySelector('[data-r-table-image-snapshot]')).toBeNull()
    } finally {
      target.remove()
    }
  },
)

it('aborts a pending sprite request on unmount without rasterizing or leaving a snapshot', async () => {
  const fetchAsset = vi.fn(
    (_url: string, options: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        options.signal!.addEventListener(
          'abort',
          () => reject(new DOMException('Cancelled', 'AbortError')),
          { once: true },
        )
      }),
  )

  vi.stubGlobal('fetch', fetchAsset)
  const wrapper = mount(RTablePro, {
    attachTo: document.body,
    props: {
      columns: [
        {
          key: 'icon',
          title: 'Icon',
          render: () =>
            h('svg', [h('use', { href: '/public/sprite.svg#icon' })]),
        },
      ],
      data,
    },
  })
  const copying = (wrapper.vm as unknown as TableProInst).copyImage()

  await tickCapture()
  expect(fetchAsset).toHaveBeenCalledOnce()
  wrapper.unmount()
  expect(await copying).toBe(false)
  expect(fetchAsset.mock.calls[0][1].signal!.aborted).toBe(true)
  expect(renderer.create).not.toHaveBeenCalled()
  expect(document.querySelector('[data-r-table-image-snapshot]')).toBeNull()
})

it('copies only the native table region and supports configured options and hidden actions through the hook', async () => {
  const [register, actions] = useTablePro()
  const wrapper = mount(RTablePro, {
    attachTo: document.body,
    props: {
      columns,
      data,
      title: 'Excluded heading',
      onRegister: register,
      search: [{ key: 'name', label: 'Excluded search' }],
      copyImageOptions: { pixelRatio: 1, backgroundColor: '#ffffff' },
    },
    slots: {
      toolbar: 'Excluded toolbar',
      tableFooter: 'Excluded footer',
      tableAction: 'Excluded action',
    },
  })

  try {
    expect(wrapper.find('[aria-label="Copy table image"]').exists()).toBe(true)
    expect(await actions.copyImage({ pixelRatio: 2 })).toBe(true)
    const target = renderer.nodes[0]

    expect(target.classList.contains('n-data-table')).toBe(true)
    expect(target.textContent).toContain('Ray')
    expect(target.querySelector('th')).not.toBeNull()
    expect(target.querySelector('.n-data-table__pagination')).not.toBeNull()
    expect(target.textContent).not.toMatch(/Excluded/)
    expect(renderer.options[0]).toMatchObject({
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    })
    expect(wrapper.get('[role="status"]').text()).toBe('Table image copied')
    await wrapper.setProps({ showCopyImage: false })
    expect(wrapper.find('[aria-label="Copy table image"]').exists()).toBe(false)
    expect(await actions.copyImage()).toBe(true)
  } finally {
    wrapper.unmount()
  }
})

it('reports unavailable and denied clipboard access without rendering or claiming success', async () => {
  const wrapper = mount(RTablePro, {
    attachTo: document.body,
    props: { columns, data },
  })
  const instance = wrapper.vm as unknown as TableProInst

  try {
    vi.stubGlobal('ClipboardItem', void 0)
    expect(await instance.copyImage()).toBe(false)
    expect(wrapper.get('[role="alert"]').text()).toContain('cannot copy PNG')
    expect(write).not.toHaveBeenCalled()
    vi.stubGlobal('ClipboardItem', Item)
    write.mockRejectedValueOnce(new DOMException('Denied', 'NotAllowedError'))
    expect(await instance.copyImage()).toBe(false)
    expect(wrapper.get('[role="alert"]').text()).toContain('access was denied')
    expect(renderer.create).not.toHaveBeenCalled()
    expect(document.querySelector('[data-r-table-image-snapshot]')).toBeNull()
  } finally {
    wrapper.unmount()
  }
})

it.each(['reject', 'empty'] as const)(
  'cleans up a %s render result and allows a later retry',
  async (failure) => {
    if (failure === 'reject')
      renderer.create.mockRejectedValueOnce(new Error('Image failed'))
    else renderer.create.mockResolvedValueOnce(null)

    const wrapper = mount(RTablePro, {
      attachTo: document.body,
      props: { columns, data },
    })
    const instance = wrapper.vm as unknown as TableProInst

    try {
      expect(await instance.copyImage()).toBe(false)
      expect(wrapper.get('[role="alert"]').text()).toContain("Couldn't copy")
      expect(document.querySelector('[data-r-table-image-snapshot]')).toBeNull()
      expect(await instance.copyImage()).toBe(true)
    } finally {
      wrapper.unmount()
    }
  },
)

it('deduplicates an in-flight capture and cancels unfinished clipboard data on unmount', async () => {
  const pending = Promise.withResolvers<Blob>()

  renderer.create.mockReturnValueOnce(pending.promise)
  const success = vi.fn()
  const error = vi.fn()
  const wrapper = mount(
    {
      setup() {
        provideUiServices({ reportSuccess: success, reportError: error })

        return () => h(RTablePro, { columns, data })
      },
    },
    { attachTo: document.body },
  )
  const instance = wrapper.getComponent(RTablePro).vm as unknown as TableProInst
  const copying = instance.copyImage()

  await tickCapture()
  expect(renderer.create).toHaveBeenCalledOnce()
  expect(await instance.copyImage()).toBe(false)
  expect(write).toHaveBeenCalledOnce()
  wrapper.unmount()
  expect(await copying).toBe(false)
  expect(document.querySelector('[data-r-table-image-snapshot]')).toBeNull()
  pending.resolve(png())
  await flushPromises()
  expect(success).not.toHaveBeenCalled()
  expect(error).not.toHaveBeenCalled()
})

it('does not capture unconfirmed remote results', async () => {
  const pending = Promise.withResolvers<TableProResult>()
  const wrapper = mount(RTablePro, {
    attachTo: document.body,
    props: { columns, request: () => pending.promise },
  })

  try {
    expect(await (wrapper.vm as unknown as TableProInst).copyImage()).toBe(
      false,
    )
    expect(write).not.toHaveBeenCalled()
    pending.resolve({ data, total: 1 })
    await flushPromises()
    expect(await (wrapper.vm as unknown as TableProInst).copyImage()).toBe(true)
  } finally {
    wrapper.unmount()
  }
})

it('uses bilingual host feedback and preserves a successful result if the host notifier fails', async () => {
  const success = vi.fn(() => {
    throw new Error('Notifier unavailable')
  })
  const wrapper = mount(
    {
      setup() {
        provideUiServices({ locale: () => 'zh-CN', reportSuccess: success })

        return () => h(RTablePro, { columns, data })
      },
    },
    { attachTo: document.body },
  )

  try {
    const instance = wrapper.getComponent(RTablePro)
      .vm as unknown as TableProInst

    expect(await instance.copyImage()).toBe(true)
    expect(success).toHaveBeenCalledExactlyOnceWith('表格图片已复制')
    expect(wrapper.get('[role="status"]').text()).toBe('表格图片已复制')
  } finally {
    wrapper.unmount()
  }
})

it('cancels pending capture when the displayed dataset changes', async () => {
  const pending = Promise.withResolvers<Blob>()

  renderer.create.mockReturnValueOnce(pending.promise)
  const wrapper = mount(RTablePro, {
    attachTo: document.body,
    props: { columns, data },
  })
  const copying = (wrapper.vm as unknown as TableProInst).copyImage()

  try {
    await tickCapture()
    expect(
      document.querySelector('[data-r-table-image-snapshot]'),
    ).not.toBeNull()
    await wrapper.setProps({ data: [{ id: 2, name: 'New query' }] })
    expect(await copying).toBe(false)
    expect(document.querySelector('[data-r-table-image-snapshot]')).toBeNull()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    pending.resolve(png())
    await flushPromises()
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  } finally {
    wrapper.unmount()
  }
})
