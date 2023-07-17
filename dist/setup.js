"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
/*
    
*/
const mongodb_1 = require("mongodb");
let DB_NAME;
let MONGODB_URL;
// Singleton instance of the database client
let client = null;
// let db: Db | null = null
class DB {
    // Connect to the MongoDB server and return the database client
    constructor(mongoUrl, dbName) {
        MONGODB_URL = mongoUrl;
        DB_NAME = dbName;
    }
    async connectToMongoDB() {
        if (!client) {
            client = await mongodb_1.MongoClient.connect(MONGODB_URL);
        }
        return client.db(DB_NAME);
    }
    // Get a reference to the collection
    getCollection(collectionName) {
        if (!client) {
            throw new Error('Database client not connected');
        }
        return client.db(DB_NAME).collection(collectionName);
    }
    // Find documents in the collection
    async findDocuments(collection, query) {
        const cursor = collection.find(query);
        return cursor.toArray();
    }
    // Insert a document into the collection
    async insertDocument(collection, document) {
        try {
            const result = await collection.insertOne(document);
            return result.insertedId.toString();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    // close the connection
    async close() {
        if (client) {
            await client.close();
            client = null;
        }
    }
}
exports.DB = DB;
