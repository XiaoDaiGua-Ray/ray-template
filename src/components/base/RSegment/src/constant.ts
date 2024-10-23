export const OMIT_TABS_PROPS_KEYS = [
  'addTabClass',
  'addTabStyle',
  'paneClass',
  'paneStyle',
  'paneWrapperStyle',
  'tabClass',
  'tabStyle',
  'type',
  'label',
  'addable',
  'closable',
  'onAdd',
  'onClose',
  'placement',
  'animated',
  'justifyContent',
  'builtinThemeOverrides',
  'displayDirective',
] as const

export const themeOverrides = {
  tabPaddingSmallSegment: '4px 7px',
  tabPaddingMediumSegment: '6px 11px',
  tabPaddingLargeSegment: '8px 11px',
}
