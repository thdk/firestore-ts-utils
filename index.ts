import { DocumentData, QueryDocumentSnapshot, DocumentSnapshot, CollectionReference, UpdateData } from "@firebase/firestore-types";

export function typeSnapshot<T extends DocumentData>(snapshot: QueryDocumentSnapshot): T;
export function typeSnapshot<T extends DocumentData>(snapshot: DocumentSnapshot): T | undefined;
export function typeSnapshot<T extends DocumentData>(snapshot: DocumentSnapshot | QueryDocumentSnapshot): T | undefined {
    const docData = snapshot.data();
    if (docData === undefined) return undefined;
    else return Object.assign<Pick<T, "id">, Exclude<T, "id">>({ id: snapshot.id }, docData as Exclude<T, "id">);
}

export const updateAsync = <T extends UpdateData>(collectionRef: CollectionReference, data: Partial<T> & Pick<T, "id">) => {
    return collectionRef
        .doc(data.id)
        .update(data);
}

export const addAsync = <T>(collectionRef: CollectionReference, data: Partial<T>, id?: string) => {
    const docRef = id ? collectionRef.doc(id) : collectionRef.doc();
    return docRef.set(data).then(() => docRef.id);
}

export const getAsync = <T>(collectionRef: CollectionReference, id: string) => {
    return new Promise<T>((resolve, reject) => {
        collectionRef.doc(id).get()
            .then((d: any) => d
                ? resolve(typeSnapshot<T>(d))
                : reject()
            );
    });
}