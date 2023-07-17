/*
    This module provides a MongoDB integration for connecting to a MongoDB server,
    performing database operations, and managing collections.
*/
import { MongoClient, Db, Collection } from 'mongodb'

let DB_NAME: string
let MONGODB_URL: string

// Singleton instance of the database client
let client: MongoClient | null = null

export class DB {
    
    constructor(mongoUrl: string, dbName: string) {
        MONGODB_URL = mongoUrl
        DB_NAME = dbName
    }
    
    // Connect to the MongoDB server and return the database client
    async connectToMongoDB(): Promise<Db> {
        if (!client) {
            client = await MongoClient.connect(MONGODB_URL)
        } 
        return client.db(DB_NAME) 
    }

    // Get a reference to the collection
    getCollection(collectionName: string): Collection {
        if (!client) {
            throw new Error('Database client not connected');
        }
        return client.db(DB_NAME).collection(collectionName);
    }
  
    // Find documents in the collection
    async findDocuments(collection: Collection, query: any): Promise<any[]> {
        const cursor = collection.find(query);
        return cursor.toArray();
    }

    // Insert a document into the collection
    async insertDocument(collection: Collection, document: any): Promise<string> {
        try {
            const result = await collection.insertOne(document)
            return result.insertedId.toString()
        } catch (error: any) {
            throw new Error(error)
        }
    }

    // close the connection
    async close(): Promise<void> {
        if(client) {
            await client.close()
            client = null
        }
    }
}