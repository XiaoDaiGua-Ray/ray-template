import { queryElements } from '../../src/utils/element'

describe('queryElements', () => {
  const div = document.createElement('div')
  const CLASS_NAME = 'demo'
  const ATTR_KEY = 'attr_key'
  const ATTR_VALUE = 'attr_value'

  it('should be defined', () => {
    expect(queryElements).toBeDefined()
  })

  it('should return empty array', () => {
    const el = queryElements('.demo')

    expect(el?.length).toBe(0)
  })

  it('should return element list', () => {
    div.parentNode?.removeChild(div)

    div.classList.add(CLASS_NAME)
    document.body.appendChild(div)

    const el = queryElements('.demo')

    expect(el?.length).toBe(1)
  })

  it('should return default element', () => {
    div.parentNode?.removeChild(div)

    const el = queryElements('.demo', {
      defaultElement: document.body,
    })

    expect(el?.length).toBe(1)
  })

  it('should return element list by attr', () => {
    div.parentNode?.removeChild(div)

    div.setAttribute(ATTR_KEY, ATTR_VALUE)
    document.body.appendChild(div)

    const el = queryElements(`attr:${ATTR_KEY}`)
    const el2 = queryElements(`attr:${ATTR_KEY}=${ATTR_VALUE}`)

    expect(el?.length).toBe(1)
    expect(el2?.length).toBe(1)
  })
})
