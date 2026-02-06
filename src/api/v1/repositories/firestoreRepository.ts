import { db } from "../../../../config/firebaseConfig";
import { FirestoreDataTypes } from "../types/firestore";

interface FieldValuePair {
    fieldName: string;
    fieldValue: FirestoreDataTypes;
}

// creating new document in firestore
export const createDocument = async <T>(
    collectionName: string,
    data: Partial<T>
): Promise<string> => {
    try {
        let docRef: FirebaseFirestore.DocumentReference;

        docRef = await db.collection(collectionName).add(data);
        
        return docRef.id;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to create document in ${collectionName}: ${errorMessage}`
        );
    }
};