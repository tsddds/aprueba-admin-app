import { Router } from 'express';
import { ok, fail } from '../lib/envelope.js';
import { wrap } from '../middleware/error.js';
import { requireRole } from '../middleware/auth.js';
import { COL, listAll, getDoc, patchDoc } from '../data/repo.js';
import { adminRoute, enumeration, invalid } from '../lib/admin-validation.js';
import { paginate } from '../lib/admin-pagination.js';
import { correctionReferences } from '../data/corrections.js';

const r = Router();
const CONFIRM_REWARD = { tier: 'bronze', amount: 250 };

r.get('/corrections', requireRole('support'), adminRoute(async (req, res) => {
  const query = req.query;
  for (const key of Object.keys(query)) if (!['state', 'limit', 'page', 'cursor', 'sort'].includes(key)) invalid(key);
  if (query.state !== undefined) enumeration(query.state, 'state', ['pending', 'confirmed', 'rejected']);
  const all = await listAll(COL.corrections);
  const rows = all.filter(row => query.state === undefined || row.state === query.state);
  const { items, pagination } = paginate(rows, query, {
    fields: ['id', 'createdAt', 'state', 'userId', 'questionId', 'reason'],
    defaultSort: 'createdAt', filterKeys: ['state'],
  });
  return ok(res, await correctionReferences(items), 200, {
    pagination, summary: { pending: all.filter(row => row.state === 'pending').length },
  });
}));

// PATCH /admin/corrections/:id — confirmar otorga 250 medallas de bronce al alumno
r.patch('/corrections/:id', requireRole('support'), wrap(async (req, res) => {
  const { resolution, questionPatch } = req.body || {};
  if (!['confirmed', 'rejected'].includes(resolution)) {
    return fail(res, 400, 'VALIDATION', "resolution debe ser 'confirmed' o 'rejected'");
  }
  const cor = await getDoc(COL.corrections, req.params.id);
  if (!cor) return fail(res, 404, 'NOT_FOUND', 'Solicitud no encontrada');

  await patchDoc(COL.corrections, req.params.id, { state: resolution, resolvedBy: req.user.id, resolvedAt: new Date().toISOString() });

  let rewardGranted = null;
  if (resolution === 'confirmed') {
    // Otorga recompensa al alumno y, opcionalmente, corrige la pregunta.
    const user = await getDoc(COL.users, cor.userId);
    if (user) {
      await patchDoc(COL.users, cor.userId, { badges: (user.badges || 0) + CONFIRM_REWARD.amount });
    }
    if (questionPatch && cor.questionId) {
      await patchDoc(COL.questions, cor.questionId, questionPatch);
    }
    rewardGranted = { userId: cor.userId, ...CONFIRM_REWARD };
  }
  return ok(res, { id: req.params.id, state: resolution, rewardGranted });
}));

export default r;
