import React from 'react'

type TopDonorProps = {
    fullName: string;
    email: string;
    total: number;
    count: number;
}

const TopDonor = ({ fullName, total, count }: TopDonorProps) => {

    const formatName = fullName.split(' ').map(part => part.charAt(0).toUpperCase()).join('');

  return (
    <div className="trend-item">
        <div className="donor-info">
            <div className="avatar">{formatName}</div>
            <div>
                <div className="text-sm font-medium">{fullName}</div>
                <div className="text-xs text-[#7f8c8d]">{count} donations</div>
            </div>
        </div>
        <div className="amount">${total}</div>
    </div>
  )
}

export default TopDonor