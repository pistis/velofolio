import { css } from '@emotion/react'
import { useEffect, useMemo, useRef } from 'react'
import { useReportValue } from '../../atoms/reportState'
import ReportSection from './ReportSection'
import { ECBasicOption } from 'echarts/types/dist/shared'
import { convertToPercentage } from '../../lib/utils/calculateIndicators'
import chartColors from '../../lib/chartColors'
import echarts from '../../lib/echarts'

export type AnnualReturnsSectionProps = {}

function AnnualReturnsSection({}: AnnualReturnsSectionProps) {
  const report = useReportValue()

  // x-axis
  const categoryData = useMemo(() => {
    if (report.length === 0 || report[0].monthlyRate.length === 0) return null
    return report[0].yearlyRate.map((yr) => yr.x)
  }, [report])

  // y-axis
  const seriesData = useMemo(() => {
    if (report.length === 0) return null
    return report.map((result) => ({
      name: result.name,
      type: 'bar',
      data: result.yearlyRate.map((yr) => yr.y),
    }))
  }, [report])

  const chartOptions = useMemo(() => {
    if (!categoryData || !seriesData) return null
    const options: ECBasicOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params
            .map(
              (param: any) => `
          <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center;">
                  <div style="border-radius: 6px; width: 12px; height: 12px; margin-right: 8px; background-color: ${
                    param.color
                  }"></div>
                  <b style="margin-right: 48px;">${param.seriesName}</b>
              </div>
              ${convertToPercentage(param.data)}
          </div>
      `
            )
            .join('')
          return `<div>${params[0].axisValueLabel}</div>`.concat(data)
        },
      },
      xAxis: {
        type: 'category',
        data: categoryData,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => {
            return convertToPercentage(value, 2)
          },
        },
      },
      series: seriesData,
      dataZoom:
        categoryData.length > 20
          ? [
              {
                type: 'inside',
              },
              {},
            ]
          : undefined,
      color: chartColors,
      grid: {
        left: 64,
        top: 32,
        right: 32,
        bottom: 32,
      },
    }

    return options
  }, [categoryData, seriesData])

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = divRef.current
    if (!element || !chartOptions) return

    const chart = echarts.init(element)
    chart.setOption(chartOptions)

    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [chartOptions])

  return (
    <ReportSection title="Annual Returns Rate">
      <div ref={divRef} css={chartStyle}></div>
    </ReportSection>
  )
}

const chartStyle = css`
  height: 20rem;
  width: 100%;
`

export default AnnualReturnsSection
