export const config = {
    appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL!),
    appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!),
}

export const adminConfig = {
    appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL!),
    appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!),
    appwriteSecretKey: String(process.env.APPWRITE_API_SECRET_KEY!)
}