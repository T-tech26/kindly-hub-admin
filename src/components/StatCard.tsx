import React from 'react'

type StatCardProps = {
  title: string
  value: string
  change: number
}

const StatCard = ({ title, value, change }: StatCardProps) => {
  return (
    <div className="stat-card">
        <div className="stat-header">
            <h2 className="stat-title">{title}</h2>
            
            <div className="stat-icon donations-icon">{title === 'Total Donations' ? '💰' : title === 'Pending Donations' ? '⏳' : title === 'Total Stories' ? '📖' : '📰'}</div>
        </div>

        <div>
            <p className="stat-value">{value}</p>
            <p className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>{change > 0 ? `+${change}% from last month` : `${change}% from last month`}</p>
        </div>
    </div>
  )
}

export default StatCard