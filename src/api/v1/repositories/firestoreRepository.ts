import { string } from "joi";
import { db } from "../../../../config/firebaseConfig";
import { FirestoreDataTypes } from "../types/firestore";
import { promises } from "dns";
import { database } from "firebase-admin";

interface FieldValuePair {
    fieldName: string;
    fieldValue: FirestoreDataTypes;
}

// creating new document in firestore
export const createDocument = async <T extends { id? : string }> (
    collectionName: string,
    data: T
): Promise<string> => {

    try {
        const docId = data.id || `evt_${Math.random().toString(36).slice(2, 11)}`;

        const docRef = db.collection(collectionName).doc(docId);

            await docRef.set({
                ...data,
                id: docId
            });

            return docId;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to create document in ${collectionName}: ${errorMessage}`
        );
    }
};
    

// to get all events
export const getAllDocuments = async <T>(
    collectionName: string
): Promise<T[]> => {
    try{
        const snapshot = await db.collection(collectionName).get();

        return snapshot.docs.map(doc =>({
            id: doc.id,
            ... (doc.data() as T),    
            }
        ));

    }catch (error:unknown) {
        const errorMessage = 
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to retrieve all documents in ${collectionName}: ${errorMessage}`
        );
    }
};

// to find a document by Id
export const getDocById = async <T>(
    collectionName: string,
    id: string,
): Promise<T | null> => {
    try{
        let docRef: FirebaseFirestore.DocumentReference;

        docRef = await db.collection(collectionName).doc(id);
    
        const snapshot = await docRef.get();

        if(!snapshot){
            return null;
        }

        return {
            id: snapshot.id,
            ... (snapshot.data() as T),
        }
    }catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to find the document in ${collectionName}: ${errorMessage}`
        );
    }
};

// update an existing document
export const updateDocument = async <T>(
    collectionName: string,
    id: string,
    data: Partial<T>
): Promise<void> => {
    try {
        await db.collection(collectionName).doc(id).update(data);   
    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message : "Unknown error"
        throw new Error(
            `Failed to update document in ${collectionName}: ${errorMessage}`
        );
    }
};

// deleting an existing document
export const deleteDocument = async <T>(
    collectionName: string,
    id: string,
): Promise<void> => {
    try {
        await db.collection(collectionName).doc(id).delete();
    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to delete document in ${collectionName}: ${errorMessage}`
        );
    }
};
