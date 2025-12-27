import dayjs from 'dayjs'
import { useDayjs } from '../../src/hooks/web/useDayjs'

describe('useDayjs', () => {
  const {
    locale,
    getStartAndEndOfDay,
    format,
    isDayjs,
    daysDiff,
    isDateInRange,
  } = useDayjs()

  it('check whether the locale method runs properly', () => {
    const m = {
      locale,
    }
    const localSpy = vi.spyOn(m, 'locale')

    m.locale('en-US')
    m.locale('zh-CN')

    expect(localSpy).toHaveBeenCalledTimes(2)
  })

  it('gets Returns the current date, start time, and end time of the current date ', () => {
    const formatOptions = {
      format: 'YYYY/M/DD HH:mm:ss',
    }
    const formatOptions2 = {
      format: 'YYYY/M/DD',
    }
    const {
      today,
      startOfDay,
      endOfDay,
      formatToday,
      formatStartOfDay,
      formatEndOfDay,
    } = getStartAndEndOfDay(formatOptions)
    const _today = dayjs(new Date()).format(formatOptions2.format)
    const _startOfDay = dayjs(new Date().setHours(0, 0, 0, 0)).format(
      formatOptions.format,
    )
    const _endOfDay = dayjs(new Date().setHours(23, 59, 59, 999)).format(
      formatOptions.format,
    )

    expect(format(today, formatOptions2)).toBe(_today)
    expect(format(startOfDay, formatOptions)).toBe(_startOfDay)
    expect(format(endOfDay, formatOptions)).toBe(_endOfDay)
    expect(format(formatToday, formatOptions2)).toBe(_today)
    expect(formatStartOfDay).toBe(_startOfDay)
    expect(formatEndOfDay).toBe(_endOfDay)
  })

  it('check format method', () => {
    const formatOptions1 = {
      format: 'YYYY/M/DD HH:mm:ss',
    }
    const formatOptions2 = {
      format: 'YYYY/M/DD',
    }
    const formatOptions3 = {
      format: 'YYYY-MM-DD HH:mm:ss',
    }
    const formatOptions4 = {
      format: 'YYYY-MM-DD',
    }
    const date = new Date('2022-01-11 00:00:00')

    expect(format(date, formatOptions1)).toBe('2022/1/11 00:00:00')
    expect(format(date, formatOptions2)).toBe('2022/1/11')
    expect(format(date, formatOptions3)).toBe('2022-01-11 00:00:00')
    expect(format(date, formatOptions4)).toBe('2022-01-11')
  })

  it('check isDayjs object', () => {
    const { today } = getStartAndEndOfDay()

    expect(isDayjs(new Date())).toBe(false)
    expect(isDayjs(today)).toBe(true)
  })

  it('check daysDiff method', () => {
    expect(daysDiff('2022-01-11', '2022-01-12')).toBe(1)
    expect(daysDiff('2021-01-11', '2022-01-12')).toBe(366)
    expect(daysDiff('2023-01-11', '2022-01-12')).toBe(-364)
  })

  it('check isDateInRange method', () => {
    const range = {
      start: '2023-01-15',
      end: '2023-01-20',
    }

    expect(isDateInRange('2023-01-16', range)).toBe(true)
    expect(isDateInRange('2023-01-15', range)).toBe(false)
    expect(isDateInRange('2023-01-20', range)).toBe(false)
  })
})
