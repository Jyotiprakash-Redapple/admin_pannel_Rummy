import React from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowTop, cilArrowBottom } from '@coreui/icons'

const getTrend = (list = []) => {
  if (list.length < 2) return 'neutral'
  const change = list[list.length - 1] - list[list.length - 2]
  return change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
}

const getColorIcon = (trend) => {
  switch (trend) {
    case 'up':
      return { icon: cilArrowTop, color: 'success' }
    case 'down':
      return { icon: cilArrowBottom, color: 'danger' }
    default:
      return { icon: null, color: 'secondary' }
  }
}

const labelMap = {
  bonusAmt: 'Bonus Amount',
  cashDepositeAmt: 'Cash Deposited',
  dealRummy: 'Deal Rummy',
  player: 'Players',
  pointRummy: 'Point Rummy',
  poolRummy: 'Pool Rummy',
  referal: 'Referrals',
  withdrawAmt: 'Withdrawals',
}

const colorMap = {
  bonusAmt: 'primary',
  cashDepositeAmt: 'info',
  dealRummy: 'danger',
  player: 'warning',
  pointRummy: 'success',
  poolRummy: 'dark',
  referal: 'secondary',
  withdrawAmt: 'danger',
}
const valueKeyMap = {
  bonusAmt: 'mon_bonus',
  cashDepositeAmt: 'mon_deposit',
  // dealRummy: 'mon_deal',
  player: 'mon_player',
  // pointRummy: 'mon_point',
  // poolRummy: 'mon_pool',
  referal: 'mon_refercount',
  withdrawAmt: 'mon_withdrawn',
}

const formatMonthLabel = (monthStr) => {
  const [year, month] = monthStr.split('-')
  const date = new Date(year, Number(month) - 1)
  return date.toLocaleString('default', { month: 'short', year: 'numeric' })
}

const processRawData = (list, key) => {
  const now = new Date()
  const nowMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  // Filter and sort last 12 months of data
  const filtered = list
    .filter((item) => item.month <= nowMonthStr)
    .sort((a, b) => new Date(a.month) - new Date(b.month))
    .slice(-12)

  const labels = filtered.map((item) => formatMonthLabel(item.month))
  const values = filtered.map((item) => Number(item[key] || 0))
 // const total = values.reduce((sum, val) => sum + val, 0)

  return { list: values, labels }
}

const WidgetsDropdown = (props) => {
  const items = Object.entries(props)
console.log(items)
  return (
    <CRow className="mb-4" xs={{ gutter: 4 }}>
      {items.map(([key, rawData]) => {
        const total = rawData.total;
        const listArray = rawData.list;
        const valueKey = valueKeyMap[key] || undefined
        if (!valueKey) return;
        if (!Array.isArray(listArray)) return null

        
   


        const { list, labels } = processRawData(listArray, valueKey)
        console.log(labels, "labels")
        const trend = getTrend(list)
        const { icon, color: trendColor } = getColorIcon(trend)
        const label = labelMap[key] || key
        const color = colorMap[key] || 'secondary'

        return (
          <CCol sm={6} xl={4} xxl={3} key={key}>
            <CWidgetStatsA
              color={color}
              value={
                <>
                  {(valueKey === 'mon_bonus' || valueKey === 'mon_withdrawn' || valueKey === 'mon_deposit') && (
  <>₹{rawData.total.toLocaleString()}</>
)}
{(valueKey === 'mon_refercount' || valueKey === 'mon_player') && (
  <>{rawData.total.toLocaleString()}</>
)}

                 
                  {/* {icon && list.length >= 2 && (
                    <span className="fs-6 fw-normal text-light">
                      ({trend === 'up' ? '+' : '-'}{Math.abs(list[list.length - 1] - list[list.length - 2])}
                      <CIcon icon={icon} className={`text-${trendColor} ms-1`} />
                      )
                    </span>
                  )} */}
                </>
              }
              title={label}
              chart={
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: labels,
                    datasets: [
                      {
                       // label: label,
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: 'rgba(255,255,255,.55)',
                        data: list,
                      },
                    ],
                  }}
                options={{
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      callbacks: {
        title: function (tooltipItems) {
          // Show custom month-year label
         
          return tooltipItems[0].label // Already your month-year label
        },
        label: function (tooltipItem) {
  const value = tooltipItem.raw
  const label = tooltipItem.label

  return `🗓 ${label} — ${Number(value).toLocaleString('en-IN')}`
}
      },
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false },
      ticks: { display: false },
    },
    y: {
      grid: { display: false },
      ticks: { display: false },
    },
  },
  elements: {
    line: { borderWidth: 2, tension: 0.4 },
    point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
  },
}}

                />
              }
            />
          </CCol>
        )
      })}
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  bonusAmt: PropTypes.array,
  cashDepositeAmt: PropTypes.array,
  dealRummy: PropTypes.array,
  player: PropTypes.array,
  pointRummy: PropTypes.array,
  poolRummy: PropTypes.array,
  referal: PropTypes.array,
  withdrawAmt: PropTypes.array,
}

export default WidgetsDropdown
