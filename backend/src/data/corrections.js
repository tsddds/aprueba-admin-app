import { db, COL } from './repo.js';
import { idValid, pick } from '../lib/admin-validation.js';
import { QUESTION_FIELDS } from '../lib/question-validation.js';

// Solo se leen referencias de la página actual. No se entrega el perfil completo
// del alumno ni se concede a soporte acceso al resto del banco de preguntas.
export async function correctionReferences(rows) {
  const userIds = [...new Set(rows.map(row => row.userId).filter(idValid))];
  const questionIds = [...new Set(rows.map(row => row.questionId).filter(idValid))];
  const [users, questions] = await Promise.all([
    userIds.length ? db.getAll(...userIds.map(id => db.collection(COL.users).doc(id))) : [],
    questionIds.length ? db.getAll(...questionIds.map(id => db.collection(COL.questions).doc(id))) : [],
  ]);
  const userMap = new Map(users.filter(doc => doc.exists).map(doc => [doc.id, { id: doc.id, ...pick(doc.data(), ['name']) }]));
  const questionMap = new Map(questions.filter(doc => doc.exists).map(doc => [doc.id, { id: doc.id, ...pick(doc.data(), [...QUESTION_FIELDS, 'status']) }]));
  return rows.map(row => ({ ...row, user: userMap.get(row.userId) ?? null, question: questionMap.get(row.questionId) ?? null }));
}
