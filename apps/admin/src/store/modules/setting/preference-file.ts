import { CONTENT_TRANSITION_OPTIONS } from '@/app-config'
import { themeStyles } from '@ray-template/ui/theme-presets'
import { pick } from 'lodash-es'
import * as v from 'valibot'
import { LAYOUT_MODES } from './constant'
import type { SettingState } from './types'

export const PREFERENCE_FILE_LIMIT = 256 * 1024

const flag = v.boolean()
const finite = v.pipe(v.number(), v.finite())
const size = v.pipe(finite, v.minValue(0))
const watermark = v.pipe(
  v.strictObject({
    content: v.string(),
    cross: flag,
    fontSize: finite,
    lineHeight: finite,
    width: finite,
    height: finite,
    xOffset: finite,
    yOffset: finite,
    xGap: finite,
    yGap: finite,
    rotate: finite,
  }),
  v.check(({ width, height, xGap, yGap }) =>
    [width + xGap, height + yGap].every((edge) => edge > 0 && edge <= 4096),
  ),
)
const preferences = v.strictObject({
  layoutConfig: v.strictObject({
    mode: v.picklist(LAYOUT_MODES),
    contentWidth: v.picklist(['fluid', 'fixed']),
    contentMaxWidth: v.pipe(finite, v.minValue(640), v.maxValue(2560)),
    contentPadding: v.pipe(finite, v.minValue(0), v.maxValue(48)),
    fixedHeader: flag,
    fixedFooter: flag,
  }),
  appTheme: v.picklist(['light', 'dark', 'auto']),
  themeStyle: v.optional(v.picklist(themeStyles), 'naive'),
  primaryColor: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(64),
      v.regex(/^(?:#[\da-f]+|(?:rgba?|hsla?)\([\d.,%+\s/-]+\))$/i),
      v.check((value) => {
        const { style } = document.createElement('span')

        style.color = value

        return style.color !== ''
      }),
    ),
  ),
  contentTransition: v.picklist(
    CONTENT_TRANSITION_OPTIONS.map(({ value }) => value),
  ),
  drawerPlacement: v.picklist(['left', 'right']),
  breadcrumbSwitch: flag,
  menuTagSwitch: flag,
  copyrightSwitch: flag,
  colorWeakness: flag,
  menuConfig: v.strictObject({
    menuWidth: size,
    collapsedWidth: size,
    collapsedMode: v.picklist(['width', 'transform']),
    collapsedIndent: size,
    iconSize: size,
    collapsedIconSize: size,
    accordion: flag,
    menuSiderBarLogo: flag,
    inverted: flag,
    nativeScrollbar: flag,
  }),
  watermarkSwitch: flag,
  watermarkConfig: watermark,
  dynamicDocumentTitle: flag,
  keepAliveConfig: v.strictObject({
    setupKeepAlive: flag,
    maxKeepAliveLength: v.pipe(size, v.integer()),
    keepAliveExclude: v.array(v.string()),
  }),
})

const preferenceFile = v.strictObject({
  format: v.literal('ray-template-preferences'),
  version: v.literal(1),
  preferences,
})

export function createPreferenceFile(state: SettingState) {
  return v.parse(preferenceFile, {
    format: 'ray-template-preferences',
    version: 1,
    preferences: {
      ...pick(state, Object.keys(preferences.entries)),
      primaryColor: state.primaryColorOverride.common?.primaryColor,
    },
  })
}

export function parsePreferenceFile(text: string) {
  return v.parse(preferenceFile, JSON.parse(text)).preferences
}
