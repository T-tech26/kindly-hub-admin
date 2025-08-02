'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "./appwrite/config"
import { FormData } from "@/components/StorieForm";
import { ContentFormData } from "@/components/ContentForm";
import { PaymentMethodFormData } from "@/components/PaymentMethodForm";
import { DonationEmail, DonationEmailReject } from "./email/template";
import * as handlebars from 'handlebars';
import { Resend } from "resend";
import { cookies } from "next/headers";


const resend = new Resend(process.env.RESEND_API_KEY!);


export const createSuccessStory = async (data: FormData): Promise<SuccessStoryResponse> => {
    try {
        const { database } = await createAdminClient();

        const createdDocument = await database.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_SUCCESS_STORY_COLLECTION_ID!,
            ID.unique(),
            data
        );

        if(!createdDocument) {
            return {
                status: 'error',
                error: "Failed to upload success story"
            }
        }

        return {
            status: 'info',
            message: 'Success story uploaded successfully'
        };
    } catch (error) {
        console.error("Error creating success story:", error);
        return {
            status: 'error',
            error: "An unexpected error occurred while uploading the success story"
        }
    }
}


export const getAllSuccessStories = async (): Promise<SuccessStoryType[]> => {
    try {
        const { database } = await createAdminClient();

        const successStories = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_SUCCESS_STORY_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const stories = successStories.documents as SuccessStoryType[];

        return stories;
    } catch (error) {
        console.error('Error fetching success stories:', error);
        return [];
    }
}


export const createNewRelease = async (data: ContentFormData): Promise<ResponseStatus> => {
    try {
        const { database, storage } = await createAdminClient();

        const logoName = ID.unique();

        const { image, ...rest } = data;        

        const createDocument = await database.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_NEWS_COLLECTION_ID!,
            ID.unique(),
            {
                ...rest,
                image: `${logoName}_${image?.name.replace(' ', '_')}`
            }
        )

        if(!createDocument) {
            return {
                status: 'error',
                error: 'Failed uploading news release'
            }
        }

        const editedImage = image && new File([image], `${logoName}_${image?.name.replace(' ', '_')}`, { type: image?.type});

        const createImage = await storage.createFile(
            process.env.APPWRITE_IMAGE_BUCKET_ID!,
            ID.unique(),
            editedImage!
        )

        if(!createImage) {
            return {
                status: 'error',
                error: 'Failed uploading image'
            }
        }

        return {
            status: 'success',
            message: 'News release uploaded successfully'
        }
    } catch (error) {
        console.error('Error creating new release content:', error);
        return {
            status: 'error',
            error: 'An unexpected error occurred while uploading news release'
        }
    }
}


export const getAllNesRelease = async (): Promise<NewsReturnType> => {
    try {
        const { database, storage } = await createAdminClient();

        const news = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_NEWS_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const images = await storage.listFiles(
            process.env.APPWRITE_IMAGE_BUCKET_ID!,
        );

        const newsType = news.documents as NewsReleaseType[];
        const imageType = images.files as FileType[];

        return {
            documents: newsType,
            images: imageType
        }

    } catch (error) {
        console.error('Error fetching all news releases:', error);
        return {
            documents: [],
            images: []
        }
    }
}


export const createPaymentMethod = async (data: PaymentMethodFormData): Promise<ResponseStatus> => {
    try {
        const { database, storage } = await createAdminClient();

        const logoName = ID.unique();

        const { logo, ...rest } = data;

        const createDocument = await database.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_PAYMENT_METHOD_COLLECTION_ID!,
            ID.unique(),
            {
                ...rest,
                logo: `${logoName}_${logo?.name.replace(' ', '_')}`
            }
        )

        if(!createDocument) {
            return {
                status: 'error',
                error: 'Failed uploading payment method'
            }
        }
        const editedLogo = logo && new File([logo], `${logoName}_${logo?.name.replace(' ', '_')}`, { type: logo?.type });

        const createLogo = await storage.createFile(
            process.env.APPWRITE_IMAGE_BUCKET_ID!,
            ID.unique(),
            editedLogo!
        )

        if(!createLogo) {
            return {
                status: 'error',
                error: 'Failed uploading logo'
            }
        }

        const paymentMethod = createDocument as PaymentMethodType;
        const paymentMethodLogo = createLogo as FileType;

        return {
            status: 'success',
            message: 'Payment method uploaded successfully',
            data: { documents: [paymentMethod], logos: [paymentMethodLogo]}
        }
    } catch (error) {
        console.error('Error creating payment method:', error);

        return {
            status: 'error',
            error: 'An unexpected error occurred while uploading payment method'
        }
    }
}


export const getAllPaymentMethods = async (): Promise<BillingReturnType> => {
    try {
        const { database, storage } = await createAdminClient();

        const billingMethods = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_PAYMENT_METHOD_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const billingMethodLogos = await storage.listFiles(
            process.env.APPWRITE_IMAGE_BUCKET_ID!,
            [Query.orderDesc('$createdAt')]
        )

        const methods = billingMethods.documents as PaymentMethodType[];
        const methodLogos = billingMethodLogos.files as FileType[];

        return {
            documents: methods, 
            logos: methodLogos
        }
    } catch (error) {
        console.error('Error fetching billing methods:', error);

        return {
            documents: [],
            logos: []
        };
    }
}


export const deletePaymentMethod = async (data: PaymentMethodType): Promise<ResponseStatus> => {
    try {
        const { database, storage } = await createAdminClient();

        database.deleteDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_PAYMENT_METHOD_COLLECTION_ID!,
            data.$id
        );

        await storage.deleteFile(
            process.env.APPWRITE_IMAGE_BUCKET_ID!,
            data.fileid!
        );

        return {
            status: 'success',
            message: 'Billing method deleted successfully'
        }
    } catch (error) {
        console.error('Error deleting payment methods:', error);

        return {
            status: 'error',
            error: 'An unexpected error occured while deleting billing method'
        }
    }
}


export const getAllDonations = async (): Promise<DonationReturnType> => {
    try {
        const { database, storage } = await createAdminClient();

        const donations = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_DONATIONS_COLLECTION_ID!,
        );


        const donationProofs = await storage.listFiles(
            process.env.APPWRITE_IMAGE_BUCKET_ID!,
        );


        return {
            documents: donations.documents as DonationsType[],
            proofs: donationProofs.files as FileType[]
        };
        
    } catch (error) {
        console.error('Error fetching donations:', error);

        return {
            documents: [],
            proofs: []
        };
    }
}


export const donationAction = async (action: string, id: string): Promise<ResponseStatus> => {
    try {
        const { database } = await createAdminClient();

        await database.updateDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_DONATIONS_COLLECTION_ID!,
            id,
            {
                'status': `${action === 'approve' ? 'completed' : 'failed'}`
            }
        )

        return {
            status: 'success',
            message: `Donaton ${action === 'approve' ? 'approved' : 'rejected'} successfully.`
        }
    } catch (error) {
        console.error("Error approving/rejecting donations:", error);

        return {
            status: 'error',
            error: `Error ${action === 'approve' ? 'approving' : 'rejecting'} donation.`
        }
    }
}


export const donationThankYou = async (name: string, email: string, amount: string): Promise<ResponseStatus> => {
    const thanks = handlebars.compile(DonationEmail);
    try {
        const emailBody = thanks({
            donor_name: name,
            donation_amount: `$${amount}`,
            organization_name: 'Kindly Hub',
            organization_email: `kindlyhub4@gmail.com`,
            organization_website: `kindlyhub.org`
        });

        const { error } = await resend.emails.send({
            from: 'Kindly Hub <team@email.kindlyhub.org>',
            to: email,
            subject: 'Thank You for Your Donation!',
            html: emailBody
        });


        if (error) {
            console.log(error);
            return {
                status: 'error',
                error: 'An unexpected error occured while sending thank you email.'
            }
        }
        
        return {
            status: 'success',
            message: 'Thank you email sent successfully.'
        }
    } catch (error) {
        console.error('Error sending thank you email', error);
        
        return {
            status: 'error',
            error: 'An unexpected error occured while sending thank you email.'
        }
    }
}


export const donationFailed = async (name: string, email: string, amount: string): Promise<ResponseStatus> => {
    const thanks = handlebars.compile(DonationEmailReject);
    try {
        const emailBody = thanks({
            donor_name: name,
            donation_amount: `$${amount}`,
            organization_name: 'Kindly Hub',
            organization_email: `kindlyhub4@gmail.com`,
            organization_website: `kindlyhub.org`
        });

        const { error } = await resend.emails.send({
            from: 'Kindly Hub <team@email.kindlyhub.org>',
            to: email,
            subject: 'Thank You for Your Donation!',
            html: emailBody
        });


        if (error) {
            console.log(error);
            return {
                status: 'error',
                error: 'An unexpected error occured while sending reject donation email.'
            }
        }
        
        return {
            status: 'success',
            message: 'Donation reject email sent successfully.'
        }
    } catch (error) {
        console.error('Error sending thank you email', error);
        
        return {
            status: 'error',
            error: 'An unexpected error occured while sending reject donation email.'
        }
    }
}


export const signin = async (email: string, password: string): Promise<ResponseStatus> => {
    try {
        const { account } = await createAdminClient();
        
        const session = await account.createEmailPasswordSession(email, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return {
            status: 'success',
            message: 'Login successfull.'
        }
    } catch (error: unknown) {
       console.error('Error signing in', error);

       
       if (typeof error === 'object' && error !== null && 'type' in error && error.type === 'user_invalid_credentials') {
            return {
               status: 'error',
               error: 'Email or password incorrect.' 
            }
       }

       return {
            status: 'error',
            error: 'An unexpected error occured while trying to log in.' 
        }
    }
};


export const getLoggedInUser = async () => {
    try {
        const { account } = await createSessionClient();
        await account.get(); 

    } catch (error) {
        console.error("Error getting logged in user", error);

        (await cookies()).delete('appwrite-session');
    }
};


export const logOut = async () => {
    try {
        const { account } = await createSessionClient();
        
        (await cookies()).delete('appwrite-session');

        await account.deleteSession('current');

        return 'success';
        
    } catch (error) {
        console.error("Error logging out user", error);

        return 'error'
    }
};