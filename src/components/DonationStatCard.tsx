import React from 'react'

type DonationStatCardProp = {
    title: string
    value: string
    change: number
}

const DonationStatCard = ({ title, value, change }: DonationStatCardProp) => {
  return (
    <div className="stat-card">
        <div className="stat-header">
            <h2 className="stat-title">{title}</h2>
        </div>

        <div>
            <p className="stat-value">{value}</p>
            <p className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>{change > 0 ? `+${change}% from last month` : `${change}% from last month`}</p>
        </div>
    </div>
  )
}

export default DonationStatCard