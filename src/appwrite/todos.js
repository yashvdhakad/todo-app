import conf from "@/config/config";
import { Client, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint(conf.appwriteURL)
  .setProject(conf.appwriteProjectId);

const databases = new Databases(client);

export { client, databases, ID };
