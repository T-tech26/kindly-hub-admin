"use server"

import { cookies } from "next/headers";
import { config, adminConfig } from "../../config/config";
import { Client, Account, Databases, Users, Storage } from "node-appwrite"


export async function createSessionClient() {
    const appWriteClient = new Client();

    appWriteClient.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
      
    const session = (await cookies()).get("appwrite-session");
    if (!session || !session.value) {
      throw new Error("No session");
    }
  
    appWriteClient.setSession(session.value);
  
    return {
      get account() {
        return new Account(appWriteClient);
      },
    };
}


export async function createAdminClient() {
    const client = new Client();

    client.setEndpoint(adminConfig.appwriteUrl).setProject(adminConfig.appwriteProjectId).setKey(adminConfig.appwriteSecretKey);
  
    return {
      get account() {
        return new Account(client);
      },

      get database() {
        return new Databases(client);
      },

      get users() {
        return new Users(client);
      },

      get storage() {
        return new Storage(client);
      }
    };
}