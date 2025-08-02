"use client"; // required for useState and useRef in app dir

import { getAllDonations, getAllNesRelease, getAllPaymentMethods, getAllSuccessStories, getLoggedInUser } from "@/lib/actions";
import { addBillingLogo, addNewsFeatureImage, donationWithProof } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useState } from "react";

type DataContextType = {
    billingData: PaymentMethodType[];
    setBillingData: React.Dispatch<React.SetStateAction<PaymentMethodType[]>>;
    successStories: SuccessStoryType[];
    setSuccessStories: React.Dispatch<React.SetStateAction<SuccessStoryType[]>>;
    news: NewsReleaseType[];
    setNews: React.Dispatch<React.SetStateAction<NewsReleaseType[]>>;
    donations: DonationsType[];
    setDonations: React.Dispatch<React.SetStateAction<DonationsType[]>>;
};

const DataContext = createContext<DataContextType | null>(null);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("DataContext is not available");
  return context;
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {

  const [billingData, setBillingData] = useState<PaymentMethodType[] | []>([]);
  const [successStories, setSuccessStories] = useState<SuccessStoryType[] | []>([]);
  const [news, setNews] = useState<NewsReleaseType[] | []>([]);
  const [donations, setDonations] = useState<DonationsType[] | []>([]);



  useEffect(() => {
    const fetchData = async () => {
        const data = await getAllPaymentMethods();

        const editedData = addBillingLogo(data.documents, data.logos);

        setBillingData(editedData);
    };

    fetchData();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
        const data = await getAllSuccessStories();
        setSuccessStories(data);
    };

    fetchData();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
        const data = await getAllNesRelease();

        const newsWithImageUrl = addNewsFeatureImage(data.documents, data.images);

        setNews(newsWithImageUrl);
    };

    fetchData();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
        const data = await getAllDonations();

        const donationsWithProof = donationWithProof(data.documents, data.proofs);

        setDonations(donationsWithProof);
    };

    fetchData();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
        await getLoggedInUser();
    };

    fetchData();
  }, []);



  return (
    <DataContext.Provider
      value={{
        billingData,
        setBillingData,
        successStories,
        setSuccessStories,
        news, setNews,
        donations, setDonations
      }}
    >
      {children}
    </DataContext.Provider>
  );
};