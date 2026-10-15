import { db, COL } from './repo.js';

// Actualiza solo si el documento sigue existiendo; una baja concurrente no lo recrea.
export async function updateSponsor(id, patch) {
  const ref = db.collection(COL.sponsors).doc(id);
  return db.runTransaction(async transaction => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) return null;
    transaction.update(ref, patch);
    return { ...snapshot.data(), ...patch, id: snapshot.id };
  });
}
