'use client'

import React, { use, useEffect, useState } from 'react'
import { useDataContext } from '@/context/DataContext';
import Link from 'next/link';
import { donationWithProof, formatAmount, getFirstDonation, getSmartDateDisplay } from '@/lib/utils';
import Image from 'next/image';
import { donationAction, donationFailed, donationThankYou, getAllDonations } from '@/lib/actions';
import { toast } from 'sonner';



const page = ({ params }: { params: Promise<{ donationID: string }> }) => {

  const { donationID } = use(params);

  const { donations, billingData, setDonations } = useDataContext();

  const [donation, setDonation] = useState<DonationsType | null>(null);
  const [paymentDetail, setPaymentDetail] = useState<PaymentMethodType | null>(null);
  const [totalDonation, setTotalDonation] = useState<number>(0);
  const [numberOfDonations, setNumberOfDonations] = useState<DonationsType[]>([]);
  const [averageDonation, setAverageDonation] = useState<number>(0);
  const [firstDonation, setFirstDonation] = useState<DonationsType | null>(null);


  
  useEffect(() => {
    const getDoantion = donations.find(donation => donation.$id === donationID);
    const details = billingData.find(detail => detail.$id === getDoantion?.billingDataID); 

    const userDonations = donations.filter(donor => donor.email === getDoantion?.email && donor.status === 'completed'); 
    const total = userDonations.reduce((sum, donation) => sum + Number(donation.amount), 0);
    const average = total / userDonations.length;

    setDonation(getDoantion!);
    setPaymentDetail(details!);
    setNumberOfDonations(userDonations);
    setTotalDonation(Number(formatAmount(String(total))));
    setAverageDonation(average);
    setFirstDonation(getFirstDonation(userDonations));
  }, [donations])



  const handleAction = async (action: string, id: string) => {
      const data = await donationAction(action, id);

      if(data.status === 'success') {
        toast.success(data.message);

        const getDonor = await getAllDonations();
        
        const donationsWithProof = donationWithProof(getDonor.documents, getDonor.proofs);

        setDonations(donationsWithProof);
      }

      if(data.status === 'error') toast.error(data.error);
  }


  const handleEmail = async (action: string) => {
    if(action === 'thank you') {
      const data = await donationThankYou(donation?.fullName!, donation?.email!, donation?.amount!);
  
      if(data.status === 'success') toast.success(data.message);
  
      if(data.status === 'error') toast.error(data.error);
    }
    
    if(action === 'reject') {
      const data = await donationFailed(donation?.fullName!, donation?.email!, donation?.amount!);
  
      if(data.status === 'success') toast.success(data.message);
  
      if(data.status === 'error') toast.error(data.error);
    }
  }



  return (
    <section className="flex-1 overflow-y-scroll">
      <div className="header">
          <div className="header-left">
              <Link href='/donations' className="back-btn">
                  ← Back to Donations
              </Link>
              <h1>Donation Details</h1>
          </div>
          <div className="header-actions">
              <button className="btn btn-primary" onClick={() => handleEmail('thank you')}>Send Thank You</button>
              <button className="btn btn-danger" onClick={() => handleEmail('reject')}>Send Reject Email</button>
          </div>
      </div>

      <main className='p-8'>
        <div className="content-grid">
          <div className="donation-card">
              <div className="card-header">
                  <h3>Donation Information</h3>
                  <span className={`capitalize status ${donation?.status}`}>{donation?.status}</span>
              </div>
              <div className="card-body">
                  <div className="donation-amount">
                      <div className="amount-display">${formatAmount(donation?.amount!)}</div>
                      <div className="amount-label">Donation Amount</div>
                  </div>

                  <div className="donor-profile">
                      <div className="avatar avatar-d">SJ</div>
                      <div className="donor-info1">
                          <h4>{donation?.fullName}</h4>
                          <p>{donation?.email}</p>
                      </div>
                  </div>

                  <div className="details-grid">
                      <div className="detail-item">
                          <div className="detail-label">Transaction ID</div>
                          <div className="detail-value">{donation?.$id}</div>
                      </div>
                    
                      <div className="detail-item">
                          <div className="detail-label">Date & Time</div>
                          <div className="detail-value">{donation?.$createdAt && getSmartDateDisplay(donation?.$createdAt)}</div>
                      </div>

                      <div className="detail-item">
                          <div className="detail-label">Payment Method</div>
                          <div className="detail-value">
                              <span className="payment-method-badge capitalize">
                                  {donation?.paymentMethod}
                              </span>
                          </div>
                      </div>
                    
                      <div className="detail-item">
                          <div className="detail-label">Donation Type</div>
                          <div className="detail-value capitalize">{donation?.frequency}</div>
                      </div>
                  </div>

                  <div className="payment-info">
                      <h4 className="mb-2.5 text-[#2c3e50]">Payment Details</h4>
                      <div className="details-grid">
                          <div className="detail-item">
                              <div className="detail-label">Gateway</div>
                              <div className="detail-value uppercase">{paymentDetail?.type}</div>
                          </div>
                          <div className="detail-item">
                              <div className="detail-label">Address Type</div>
                              <div className="detail-value">
                                {
                                  paymentDetail?.addressType! === 'p-email' ? 'Paypal Email' 
                                    : paymentDetail?.addressType! === 'p-username' ? 'Paypal username'
                                      : paymentDetail?.addressType! === 'p-phone' ? 'Paypal phone number'
                                        : paymentDetail?.addressType! === 's-email' ? 'Skrill Email'
                                          : paymentDetail?.addressType! === 's-username' ? 'Skrill ID'
                                            : paymentDetail?.addressType! === 's-phone' ? 'Skrill phone number'
                                              : paymentDetail?.addressType! === 'tron' ? 'TRC20'
                                                : paymentDetail?.addressType! === 'bsc' ? 'BEP20'
                                                  : paymentDetail?.addressType! === 'ton' ? 'TON'
                                                    : ''
                                }
                              </div>
                          </div>
                          <div className="detail-item">
                              <div className="detail-label">Payment Address</div>
                              <div className="detail-value">{paymentDetail?.address}</div>
                          </div>
                      </div>
                  </div>

                  <div className='flex items-center justify-between detail-item'>
                    <button className='btn btn-primary' onClick={() => handleAction('approve', donation?.$id!)}>Approve</button>
                    <button className='btn btn-reject' onClick={() => handleAction('reject', donation?.$id!)}>Reject</button>
                  </div>

                  <div>
                    <div className="detail-label">Proof of payment</div>
                    {donation?.screenShot && (
                      <Image
                        src={donation?.screenShot}
                        width={1000}
                        height={1000}
                        alt='proof'
                        className='rounded-lg'
                      />
                    )}
                  </div>
              </div>
          </div>
          
          <div className="action-card">
              <h3 className='mb-[15px]'>Donor History</h3>
              <div className="mb-[15px]">
                  <div className="detail-label">Total Donations</div>
                  <div className="detail-value">${totalDonation} ({numberOfDonations.length} donations)</div>
              </div>
              <div className="mb-[15px]">
                  <div className="detail-label">First Donation</div>
                  <div className="detail-value">
                    {firstDonation?.$createdAt && getSmartDateDisplay(firstDonation?.$createdAt)}
                  </div>
              </div>
              <div className="mb-[15px]">
                  <div className="detail-label">Average Donation</div>
                  <div className="detail-value">${formatAmount(String(averageDonation))}</div>
              </div>
          </div>
        </div>
      </main>
    </section>
  )
}

export default page