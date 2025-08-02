import { parseISO, isSameMonth, subMonths, differenceInHours, formatDistanceToNowStrict, format } from "date-fns";

export const addBillingLogo = (
    documents: PaymentMethodType[], 
    logos: FileType[]
) => {

    return documents.map(method => {
        const matchingFile = logos.find(file => file.name === method.logo);

        const imageUrl = matchingFile
            ? `${process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL}/storage/buckets/${matchingFile.bucketId}/files/${matchingFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`
            : method.logo; // fallback if no match

        return {
            ...method,
            logo: imageUrl,
            fileid: matchingFile?.$id
        };
    });
}


export const addNewsFeatureImage = (
    documents: NewsReleaseType[],
    images: FileType[]
) => {
    return documents.map(news => {
        const newsImage = images.find(file => file.name === news.image);

        const imageUrl = newsImage 
            ? `${process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL}/storage/buckets/${newsImage.bucketId}/files/${newsImage.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`
            : news.image;

        return {
            ...news,
            image: imageUrl,
            fileId: newsImage?.$id
        }
    });
}


export const donationWithProof = (
    documents: DonationsType[],
    proofs: FileType[]
) => {
    return documents.map(donation => {
        const proof = proofs.find(file => file.name === donation.screenShot);

        const imageUrl = proof 
            ? `${process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL}/storage/buckets/${proof.bucketId}/files/${proof.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`
            : donation.screenShot;

        return {
            ...donation,
            screenShot: imageUrl
        }
    });
}


export const formatAmount = (amount: string) => {
  if (!amount || isNaN(Number(amount))) return '0.00';

  const num = parseFloat(amount);

  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 100_000) {
    return (num / 1_000).toFixed(0) + 'K';
  } else {
    // Format numbers like 9,450.75
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};


export const calculateGrowth = (
    successStories: SuccessStoryType[] | NewsReleaseType[] | DonationsType[]
) => {
  const now = new Date();
  const lastMonth = subMonths(now, 1);

  const currentMonthCount = successStories.filter(story =>
    isSameMonth(parseISO(story.$createdAt), now)
  ).length;

  const previousMonthCount = successStories.filter(story =>
    isSameMonth(parseISO(story.$createdAt), lastMonth)
  ).length;

  const growth = previousMonthCount === 0
    ? 100
    : ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;

  return Math.round(growth);
};


export const thisMonthDonations = (donations: DonationsType[]) => {
  const now = new Date();
  const lastMonth = subMonths(now, 1);

  // Count donations created this month
  const currentMonthCount = donations.filter(donation =>
    isSameMonth(parseISO(donation.$createdAt), now)
  );

  // Total amount donated this month
  const currentMonthTotal = currentMonthCount.reduce(
    (sum, donation) => sum + Number(donation.amount),
    0
  );

  return currentMonthTotal
};



export const getSmartDateDisplay = (dateString: string) => {
  const date = parseISO(dateString);
  const now = new Date();

  const hoursDiff = differenceInHours(now, date);

  if (hoursDiff < 24) {
    // Show "2 hours ago", "5 hours ago"
    return formatDistanceToNowStrict(date, { addSuffix: true });
  } else if (hoursDiff < 72) {
    // Show "2 days ago"
    return formatDistanceToNowStrict(date, { addSuffix: true });
  } else {
    // If it's older than 3 days, show only the date
    return format(date, 'yyyy-MM-dd');
  }
};


 
export const getFirstDonation = (donations: DonationsType[]) => {
    const firstDonation = donations
        .slice() // Make a shallow copy so we don't mutate the original array
        .sort((a, b) => new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime())[0];

    return firstDonation;
}



export const getTopDonors = (donations: DonationsType[]): TopDonor[] => {
  const donorMap: Record<string, TopDonor> = {};


  donations.forEach((donation) => {
    if (donation.status === 'completed') {
      const amount = parseFloat(donation.amount || '0');
      const key = donation.email;

      if (!donorMap[key]) {
        donorMap[key] = {
          fullName: donation.fullName,
          email: donation.email,
          total: amount,
          count: 1
        };
      } else {
        donorMap[key].total += amount;
        donorMap[key].count += 1;
      }
    }
  });

  return Object.values(donorMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3); // top 3
};
