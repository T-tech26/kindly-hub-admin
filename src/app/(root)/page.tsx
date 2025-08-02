'use client'

import ContentItem from "@/components/ContentItem";
import DonationItem from "@/components/DonationItem";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import { useDataContext } from "@/context/DataContext";
import { calculateGrowth, formatAmount } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {

  const { successStories, news, donations } = useDataContext();

  const [pendingDonations, setPendingDonations] = useState<DonationsType[]>([]);
  const [pendingDonationsAmount, setPendingDonationsAmount] = useState<number>(0);
  const [confirmedDonations, setConfirmedDonations] = useState<DonationsType[]>([]);
  const [totalDonationsAmount, setTotalDonationsAmount] = useState<number>(0);
  const [newsAndStory, setNewsStory] = useState<CombinedContentItem[]>([]);

  useEffect(() => {
    const pending = donations.filter(donation => donation.status === 'pending');
    setPendingDonations(pending);

    const pendingDonationTotalAmount = pending.reduce((sum, donation) => sum + Number(donation.amount), 0);
    setPendingDonationsAmount(pendingDonationTotalAmount);

    const confirmed = donations.filter(donation => donation.status === 'completed');
    setConfirmedDonations(confirmed);

    const totalAmount = confirmed.reduce((sum, donation) => sum + Number(donation.amount), 0);
    setTotalDonationsAmount(totalAmount);
  }, [donations]);


  useEffect(() => {
     const combinedItems: CombinedContentItem[] = [
      ...news.map(item => ({ ...item, type: 'news' as const })),
      ...successStories.map(item => ({ ...item, type: 'success' as const }))
    ];

    const sortedItems = combinedItems.sort(
      (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
    );

    setNewsStory(sortedItems.slice(0, 10));
  }, [successStories, news]);


  return (
    <section className="flex-1 overflow-scroll">
      <Header title="Dashboard" />
      
      <div className="p-8">
        <div className="grid grid-cols-(--dashboard-grid) gap-6 mb-8">
          <StatCard
            title="Total Donations"
            value={`$${formatAmount(String(totalDonationsAmount))}`}
            change={calculateGrowth(confirmedDonations)}
          />
          <StatCard
            title="Pending Donations"
            value={`$${formatAmount(String(pendingDonationsAmount))}`}
            change={calculateGrowth(pendingDonations)}
          />
          <StatCard
            title="Total Stories"
            value={formatAmount(String(successStories.length))}
            change={calculateGrowth(successStories)}
          />
          <StatCard
            title="Total News"
            value={formatAmount(String(news.length))}
            change={calculateGrowth(news)}
          />
        </div>

        <div className="quick-actions">
          
          <div className="action-card">

            <div className="action-header">
              <h2 className="action-title">Donations</h2>
              <Link href='/donations' className="action-btn warning">View All</Link>
            </div>

            <ul className="list-none">
              {donations.slice(0, 10).map((item, index) => (
                <DonationItem 
                  key={index} 
                  {...item} 
                />
              ))}
            </ul>
          </div>

          <div className="action-card">

            <div className="action-header">
              <h2 className="action-title">Content Management</h2>
              <Link href='/content_management' className="action-btn success">View All</Link>
            </div>

            <ul className="list-none">
              {newsAndStory.map((item, index) => (
                <ContentItem
                  key={index}
                  {...item}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
