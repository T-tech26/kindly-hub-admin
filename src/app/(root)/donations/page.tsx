'use client'

import DonationStatCard from '@/components/DonationStatCard'
import DonorInfo from '@/components/DonorInfo'
import Header from '@/components/Header'
import Pagination from '@/components/Pagination'
import TopDonor from '@/components/TopDonor'
import { useDataContext } from '@/context/DataContext'
import { calculateGrowth, formatAmount, getTopDonors, thisMonthDonations } from '@/lib/utils'
import React, { useEffect, useState } from 'react'


const page = () => {

  const { donations } = useDataContext();

  const [confirmedDonations, setConfirmedDonations] = useState<DonationsType[]>([]);
  const [totalDonationsAmount, setTotalDonationsAmount] = useState<number>(0);
  const [averageAmount, setAverageAmount] = useState<number>(0);
  const [filter, setFilter] = useState('all');
  const [pendingDonations, setPendingDonations] = useState<DonationsType[]>([]);
  const [failedDonations, setFailedDonations] = useState<DonationsType[]>([]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(10);
  const [activePagination, setActivePagination] = useState(1);
  const [pages, setPages] = useState({
    page1: 1,
    page2: 2,
    page3: 3
  });
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);



  useEffect(() => {
      const confirmed = donations.filter(donation => donation.status === 'completed');
      setConfirmedDonations(confirmed);
  
      const totalAmount = confirmed.reduce((sum, donation) => sum + Number(donation.amount), 0);
      setTotalDonationsAmount(totalAmount);

      const averageAmount = totalAmount / confirmed.length;
      setAverageAmount(averageAmount);

      const pending = donations.filter(donation => donation.status === 'pending');
      setPendingDonations(pending);

      const failed = donations.filter(donation => donation.status === 'failed');
      setFailedDonations(failed);

      const top = getTopDonors(confirmed);
      setTopDonors(top);
  }, [donations]);



  return (
    <section className="flex-1 overflow-y-scroll">
      <Header title="Donations" />
      
      <div className='p-8'>
        <div className="grid grid-cols-(--dashboard-grid) gap-6 mb-8">
          <DonationStatCard
            title='Total Donations'
            value={`$${formatAmount(String(totalDonationsAmount))}`}
            change={calculateGrowth(confirmedDonations)}
          />
          <DonationStatCard
            title='This Month'
            value={`$${thisMonthDonations(confirmedDonations)}`}
            change={calculateGrowth(confirmedDonations)}
          />
          <DonationStatCard
            title='Total Donors'
            value={`${formatAmount(String(confirmedDonations.length))}`}
            change={calculateGrowth(confirmedDonations)}
          />
          <DonationStatCard
            title='Average Donations'
            value={`$${formatAmount(String(averageAmount))}`}
            change={calculateGrowth(confirmedDonations)}
          />
        </div>

        <div className="content-grid">
          <div className="donations-table">
            <div className="table-header">
                <h3>Donation History</h3>
                <input type="text" className="search-box" placeholder="Search donations..." />
            </div>

            <div className="filter-tabs">
                <button 
                  className={`filter-tab ${filter === 'all' ? 'active' : ' '}`}
                  onClick={() => setFilter('all')}
                >All</button>
                <button 
                  className={`filter-tab ${filter === 'complete' ? 'active' : ' '}`}
                  onClick={() => setFilter('complete')}
                >Completed</button>
                <button 
                  className={`filter-tab ${filter === 'pending' ? 'active' : ' '}`}
                  onClick={() => setFilter('pending')}
                >Pending</button>
                <button 
                  className={`filter-tab ${filter === 'failed' ? 'active' : ' '}`}
                  onClick={() => setFilter('failed')}
                >Failed</button>
            </div>

            <table className="table">
              <thead>
                  <tr>
                      <th>Donor</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                {filter === 'all' && (
                  <>
                    {donations.slice(startIndex, endIndex).map((donor, index) => (
                      <DonorInfo
                        key={index}
                        {...donor}
                      />
                    ))}
                  </>
                )}

                {filter === 'complete' && (
                  <>
                    {confirmedDonations.slice(startIndex, endIndex).map((donor, index) => (
                      <DonorInfo
                        key={index}
                        {...donor}
                      />
                    ))}
                  </>
                )}

                {filter === 'pending' && (
                  <>
                    {pendingDonations.slice(startIndex, endIndex).map((donor, index) => (
                      <DonorInfo
                        key={index}
                        {...donor}
                      />
                    ))}
                  </>
                )}

                {filter === 'failed' && (
                  <>
                    {failedDonations.slice(startIndex, endIndex).map((donor, index) => (
                      <DonorInfo
                        key={index}
                        {...donor}
                      />
                    ))}
                  </>
                )}
              </tbody>
            </table>

            <div className="pagination">
              {filter === 'all' && (
                <Pagination
                  donationLenght={donations.length}
                  activePagination={activePagination}
                  setActivePagination={setActivePagination}
                  pages={pages}
                  setPages={setPages}
                  startIndex={startIndex}
                  setStartIndex={setStartIndex}
                  endIndex={endIndex}
                  setEndIndex={setEndIndex}
                />
              )}


              {filter === 'complete' && (
                <Pagination
                  donationLenght={confirmedDonations.length}
                  activePagination={activePagination}
                  setActivePagination={setActivePagination}
                  pages={pages}
                  setPages={setPages}
                  startIndex={startIndex}
                  setStartIndex={setStartIndex}
                  endIndex={endIndex}
                  setEndIndex={setEndIndex}
                />
              )}


              {filter === 'pending' && (
                <Pagination
                  donationLenght={pendingDonations.length}
                  activePagination={activePagination}
                  setActivePagination={setActivePagination}
                  pages={pages}
                  setPages={setPages}
                  startIndex={startIndex}
                  setStartIndex={setStartIndex}
                  endIndex={endIndex}
                  setEndIndex={setEndIndex}
                />
              )}


              {filter === 'failed' && (
                <Pagination
                  donationLenght={failedDonations.length}
                  activePagination={activePagination}
                  setActivePagination={setActivePagination}
                  pages={pages}
                  setPages={setPages}
                  startIndex={startIndex}
                  setStartIndex={setStartIndex}
                  endIndex={endIndex}
                  setEndIndex={setEndIndex}
                />
              )}

            </div>
          </div>

          <div className="sidebar-content">
            <h3>Payment Methods</h3>
            <div className="payment-methods">
                <div className="payment-method">PayPal</div>
                <div className="payment-method">Skrill</div>
                <div className="payment-method">Crypto</div>
            </div>

            <h3>Top Donors This Month</h3>
            <div>
                {topDonors.map((donor, index) => (
                  <TopDonor
                    key={index}
                    {...donor}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default page