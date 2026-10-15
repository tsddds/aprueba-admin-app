import { Router } from 'express';
import { ok, created, fail } from '../lib/envelope.js';
import { wrap } from '../middleware/error.js';
import { requireRole } from '../middleware/auth.js';
import { COL, listAll, addDoc, patchDoc, getDoc } from '../data/repo.js';
import { adminRoute, text, enumeration, invalid } from '../lib/admin-validation.js';
import { paginate } from '../lib/admin-pagination.js';
import { validateQuestion, QUESTION_TESTS, QUESTION_DIFFICULTIES, QUESTION_STATUSES } from '../lib/question-validation.js';

const r = Router();

r.get('/questions', requireRole('admin'), adminRoute(async (req, res) => {
  const filterKeys = ['testId', 'axis', 'difficulty', 'status'];
  const query = { ...req.query };
  const tests = QUESTION_TESTS;
  for (const key of Object.keys(query)) {
    if (![...filterKeys, 'limit', 'page', 'cursor', 'sort'].includes(key)) invalid(key);
  }
  if (query.testId !== undefined) enumeration(query.testId, 'testId', tests);
  if (query.axis !== undefined) query.axis = text(query.axis, 'axis');
  if (query.difficulty !== undefined) enumeration(query.difficulty, 'difficulty', QUESTION_DIFFICULTIES);
  if (query.status !== undefined) enumeration(query.status, 'status', QUESTION_STATUSES);
  const all = await listAll(COL.questions);
  const rows = all.filter(question => filterKeys.every(key => query[key] === undefined || question[key] === query[key]));
  const summary = {
    published: rows.filter(q => q.status === 'published').length,
    draft: rows.filter(q => q.status === 'draft').length,
    tests: new Set(rows.map(q => q.testId).filter(Boolean)).size,
  };
  const { items, pagination } = paginate(rows, query, {
    fields: ['id', 'testId', 'axis', 'difficulty', 'status', 'statement'], filterKeys,
  });
  return ok(res, items, 200, {
    pagination, summary,
    filters: { testIds: tests, axes: [...new Set(all.map(q => q.axis).filter(value => typeof value === 'string' && value.trim()))].sort() },
  });
}));

r.post('/questions', requireRole('admin'), adminRoute(async (req, res) => {
  const question = validateQuestion(req.body);
  const doc = await addDoc(COL.questions, { ...question, status: 'draft' });
  return created(res, { id: doc.id, status: doc.status });
}));

r.put('/questions/:id', requireRole('admin'), wrap(async (req, res) => {
  const allowed = ['testId', 'axis', 'difficulty', 'statement', 'options', 'correctAnswer', 'explanation', 'requiredSkill', 'status'];
  const patch = {};
  for (const k of allowed) if (k in (req.body || {})) patch[k] = req.body[k];
  const doc = await patchDoc(COL.questions, req.params.id, patch);
  if (!doc) return fail(res, 404, 'NOT_FOUND', 'Pregunta no encontrada');
  return ok(res, doc);
}));

// POST /admin/questions/import — formato de origen (archivos JSON por materia)
r.post('/questions/import', requireRole('admin'), wrap(async (req, res) => {
  const { testId, items } = req.body || {};
  if (!Array.isArray(items)) return fail(res, 400, 'VALIDATION', 'items debe ser un array');
  let imported = 0; const errors = [];
  for (const [i, it] of items.entries()) {
    try {
      await addDoc(COL.questions, {
        testId: testId || null, axis: it.eje || it.axis || null, difficulty: it.dificultad || 'd1',
        statement: it.pregunta, options: it.alternativas, correctAnswer: it.respuesta_correcta,
        explanation: it.explicacion_respuesta || '', requiredSkill: it.habilidad_requerida || '', status: 'published',
      });
      imported++;
    } catch (e) { errors.push({ index: i, message: e.message }); }
  }
  return created(res, { imported, skipped: items.length - imported - errors.length, errors });
}));

export default r;
