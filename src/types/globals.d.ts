type SuccessStoryResponse = {
    status: 'success';
    data: SuccessStoryType;
} | {
    status: 'error';
    error: string;
} | {
    status: 'info';
    message: string;
}

type ResponseStatus = {
    status: 'error';
    error: string;
} | {
    status: 'success';
    message: string;
    data?: BillingReturnType
}

type SuccessStoryType = {
    name: string;
    description: string;
    testimonial: string;
    $id: string;
    $permissions: string[];
    $createdAt: string;
    $updatedAt: string;
    $sequence: string;
    $databaseId: string;
    $collectionId: string;
}

type NewsReleaseType = {
    title: string;
    summary: string;
    content: string;
    image: string;
    date: string;
    featured: boolean;
    fileId?: string;
    $id: string;
    $permissions: string[];
    $createdAt: string;
    $updatedAt: string;
    $sequence: string;
    $databaseId: string;
    $collectionId: string;
}

type PaymentMethodType = {
    addressType: string;
    address: string;
    type: string;
    logo: string;
    $id: string;
    fileid?: string;
    $permissions: string[];
    $createdAt: string;
    $updatedAt: string;
    $sequence: string;
    $databaseId: string;
    $collectionId: string;
}

type FileType = {
  $id: string;
  bucketId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  name: string;
  signature: string;
  mimeType: 'image/png';
  sizeOriginal: number;
  chunksTotal: number;
  chunksUploaded: number;
}

type BillingReturnType = {
    documents: PaymentMethodType[];
    logos: FileType[];
}

type NewsReturnType = {
    documents: NewsReleaseType[];
    images: FileType[];
}


type DonationsType = {
    fullName: string,
    email: string,
    amount: string,
    frequency: string,
    screenShot: string,
    paymentMethod: string,
    addressType: string,
    address: string,
    billingDataID: string,
    status: string,
    $id: string,
    $sequence: string,
    $createdAt: string,
    $updatedAt: string,
    $permissions: string[],
    $databaseId: string,
    $collectionId: string
}


type DonationReturnType = {
    documents: DonationsType[],
    proofs: FileType[]
}


type CombinedContentItem = (NewsReleaseType & { type: 'news' }) | (SuccessStoryType & { type: 'success' });


type TopDonor = {
  fullName: string;
  email: string;
  total: number;
  count: number;
};
