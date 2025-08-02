import { getSmartDateDisplay } from '@/lib/utils'
import Link from 'next/link';
import React from 'react'

const DonorInfo = ({ $id, fullName, email, amount, $createdAt, status }: DonationsType) => {

    const formatName = fullName.split(' ').map(part => part.charAt(0).toUpperCase()).join('');
    
  return (
    <tr>
        <td>
            <div className="donor-info">
                <div className="avatar">{formatName}</div>
                <div>
                    <div className='text-nowrap'>{fullName}</div>
                    <div className="donor-email">{email}</div>
                </div>
            </div>
        </td>
        <td className="amount">${amount}</td>
        <td className='text-nowrap'>{getSmartDateDisplay($createdAt)}</td>
        <td><span className={`status ${status}`}>{status}</span></td>
        <td>
            <Link href={`/donations/${$id}`} className="btn btn-secondary">View</Link>
        </td>
    </tr>
  )
}

export default DonorInfo