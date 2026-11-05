import type { GlobalThemeOverrides, useThemeVars } from 'naive-ui'

export const rayPrimaryColor = {
  primaryColor: '#3b63d9',
  primaryFadeColor: 'rgba(59, 99, 217, 0.85)',
}

type ThemePalette = Record<'light' | 'dark', GlobalThemeOverrides>

const modernComponents = {
  Card: {
    borderRadius: '12px',
    titleFontSizeMedium: '16px',
    paddingMedium: '20px 24px',
  },
  Menu: { itemHeight: '40px', borderRadius: '8px' },
  Button: { fontWeight: '500' },
  Tag: { borderRadius: '5px' },
} satisfies GlobalThemeOverrides

export const rayThemeOverrides = {
  dark: {
    ...modernComponents,
    common: {
      borderRadius: '8px',
      fontWeightStrong: '600',
      lineHeight: '1.6',
      heightMedium: '36px',
      heightSmall: '30px',
      bodyColor: '#101722',
      cardColor: '#172131',
      modalColor: '#192638',
      popoverColor: '#192638',
      actionColor: '#1c293b',
      textColor1: '#e9eef7',
      textColor2: '#b3c0d3',
      textColor3: '#a0b0c6',
      placeholderColor: '#a0b0c6',
      borderColor: '#687b96',
      dividerColor: '#2c394d',
      hoverColor: 'rgba(179, 192, 211, 0.08)',
      primaryColor: '#aabaff',
      primaryColorHover: '#c4ceff',
      primaryColorPressed: '#96a9fa',
      primaryColorSuppl: '#aabaff',
      boxShadow1: '0 1px 2px rgb(0 0 0 / 10%), 0 8px 24px rgb(0 0 0 / 10%)',
    },
    Layout: { siderColor: '#172131', headerColor: '#172131' },
  },
  light: {
    ...modernComponents,
    common: {
      borderRadius: '8px',
      fontWeightStrong: '600',
      lineHeight: '1.6',
      heightMedium: '36px',
      heightSmall: '30px',
      bodyColor: '#f5f7fb',
      cardColor: '#ffffff',
      modalColor: '#ffffff',
      popoverColor: '#ffffff',
      actionColor: '#f7f9fc',
      textColor1: '#1d2a3e',
      textColor2: '#52647c',
      textColor3: '#617187',
      placeholderColor: '#617187',
      borderColor: '#8492a8',
      dividerColor: '#e4e9f1',
      hoverColor: 'rgba(82, 100, 124, 0.06)',
      primaryColor: rayPrimaryColor.primaryColor,
      primaryColorHover: '#4b70df',
      primaryColorPressed: '#2b50be',
      primaryColorSuppl: rayPrimaryColor.primaryColor,
      boxShadow1: '0 1px 2px rgb(25 43 74 / 3%), 0 6px 20px rgb(25 43 74 / 3%)',
    },
    Layout: { siderColor: '#ffffff', headerColor: '#ffffff' },
  },
} satisfies ThemePalette

const materialComponents = {
  Card: { borderRadius: '20px' },
  Button: {
    fontWeight: '500',
    borderRadiusSmall: '999px',
    borderRadiusMedium: '999px',
    borderRadiusLarge: '999px',
  },
  Menu: { itemHeight: '44px', borderRadius: '24px' },
  Tag: { borderRadius: '8px' },
  DataTable: { borderRadius: '16px' },
} satisfies GlobalThemeOverrides

const plainComponents = {
  Card: { borderRadius: '2px' },
  Menu: { itemHeight: '36px', borderRadius: '2px' },
  Tag: { borderRadius: '2px' },
} satisfies GlobalThemeOverrides

export const themeStyles = ['modern', 'naive', 'material', 'plain'] as const
export type ThemeStyle = (typeof themeStyles)[number]

export const DEFAULT_THEME_STYLE: ThemeStyle = 'modern'

export const normalizeThemeStyle = (value: unknown): ThemeStyle =>
  themeStyles.find((style) => style === value) ?? DEFAULT_THEME_STYLE

export const themeStyleOverrides: Record<ThemeStyle, ThemePalette> = {
  naive: { light: {}, dark: {} },
  modern: rayThemeOverrides,
  material: {
    light: {
      ...materialComponents,
      common: {
        primaryColor: '#655292',
        primaryColorHover: '#755fa4',
        primaryColorPressed: '#514178',
        primaryColorSuppl: '#655292',
        borderRadius: '12px',
        heightMedium: '40px',
        bodyColor: '#f5f1fa',
        cardColor: '#fffaff',
        actionColor: '#efe8f7',
        popoverColor: '#fffaff',
        modalColor: '#fffaff',
        textColor1: '#201a29',
        textColor2: '#433a50',
        textColor3: '#61566c',
        borderColor: '#8c8199',
        dividerColor: '#e1d8ea',
        boxShadow1: '0 2px 6px rgb(46 31 65 / 14%)',
      },
      Layout: { siderColor: '#fffaff', headerColor: '#fffaff' },
    },
    dark: {
      ...materialComponents,
      common: {
        primaryColor: '#d6bbff',
        primaryColorHover: '#e4d1ff',
        primaryColorPressed: '#bf9ff1',
        primaryColorSuppl: '#d6bbff',
        borderRadius: '12px',
        heightMedium: '40px',
        bodyColor: '#16121c',
        cardColor: '#241e2c',
        actionColor: '#302838',
        popoverColor: '#2b2433',
        modalColor: '#2b2433',
        textColor1: '#f1e7fa',
        textColor2: '#ded0e8',
        textColor3: '#b9a9c4',
        borderColor: '#867791',
        dividerColor: '#473c52',
      },
      Layout: { siderColor: '#241e2c', headerColor: '#241e2c' },
    },
  },
  plain: {
    light: {
      ...plainComponents,
      common: {
        primaryColor: '#454545',
        primaryColorHover: '#555555',
        primaryColorPressed: '#292929',
        primaryColorSuppl: '#454545',
        borderRadius: '2px',
        bodyColor: '#f5f5f5',
        actionColor: '#eeeeee',
        boxShadow1: 'none',
        boxShadow2: 'none',
        boxShadow3: 'none',
      },
    },
    dark: {
      ...plainComponents,
      common: {
        primaryColor: '#d5d5d5',
        primaryColorHover: '#ededed',
        primaryColorPressed: '#bdbdbd',
        primaryColorSuppl: '#d5d5d5',
        borderRadius: '2px',
        bodyColor: '#161616',
        cardColor: '#202020',
        popoverColor: '#252525',
        modalColor: '#252525',
        actionColor: '#2b2b2b',
        boxShadow1: 'none',
        boxShadow2: 'none',
        boxShadow3: 'none',
      },
      Layout: { siderColor: '#202020', headerColor: '#202020' },
    },
  },
}

export const createRayThemeStyle = (
  vars: ReturnType<typeof useThemeVars>['value'],
  overrides: GlobalThemeOverrides,
): Record<string, string> => ({
  '--r-token-primary': vars.primaryColor,
  '--r-token-primary-hover': vars.primaryColorHover,
  '--r-token-canvas': vars.bodyColor,
  '--r-token-surface': vars.cardColor,
  '--r-token-surface-muted': vars.actionColor,
  '--r-token-surface-hover': `color-mix(in srgb, ${vars.textColor1} 9%, ${vars.cardColor})`,
  '--r-token-divider': vars.dividerColor,
  '--r-token-border': vars.borderColor,
  '--r-token-text': vars.textColor1,
  '--r-token-text-secondary': vars.textColor2,
  '--r-token-text-muted': vars.textColor3,
  '--r-token-shadow': vars.boxShadow1,
  '--r-token-radius':
    typeof overrides.Card?.borderRadius === 'string'
      ? overrides.Card.borderRadius
      : vars.borderRadius,
  '--r-token-control-radius': vars.borderRadius,
})
