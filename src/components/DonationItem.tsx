import { getSmartDateDisplay } from '@/lib/utils'
import React from 'react'



const DonationDetails = ({ fullName, amount, paymentMethod, $createdAt, status }: DonationsType) => {
  return (
    <li className='action-item'>
        <div className='flex-1'>
            <h3 className='action-item-title'>{fullName}</h3>
            <p className='action-item-meta capitalize'>{paymentMethod} • {getSmartDateDisplay($createdAt)}</p>
        </div>

        <p className={`${status === 'failed' ? 'text-red-300' : 'action-item-amount'}`}>
            ${amount}
            <span className={`action-badge ${status === 'pending' ? 'status-pending' : status === 'failed' ? 'status failed' : 'status-confirmed'}`}>
                {status}
            </span>
        </p>
    </li>
  )
}

export default DonationDetails