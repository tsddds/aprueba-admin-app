import { Router } from 'express';
import { ok, created, noContent, fail } from '../lib/envelope.js';
import { wrap } from '../middleware/error.js';
import { requireRole } from '../middleware/auth.js';
import { COL, listAll, addDoc, patchDoc, deleteDoc, getDoc } from '../data/repo.js';

const r = Router();
const TIERS = ['Bronze', 'Silver', 'Gold'];

r.get('/sponsors', requireRole('admin'), wrap(async (req, res) => {
  const { limit = '20', page, cursor, sort = 'name' } = req.query;
  const invalid = () => fail(res, 400, 'VALIDATION_ERROR', 'Paginación u orden inválidos');
  const positiveInteger = value => typeof value === 'string' && /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value));
  if (!positiveInteger(limit) || Number(limit) > 100) return invalid();
  if (page !== undefined && (!positiveInteger(page) || cursor !== undefined)) return invalid();
  if (typeof sort !== 'string') return invalid();
  const descending = sort.startsWith('-');
  const field = descending ? sort.slice(1) : sort;
  const fields = ['id', 'name', 'tier', 'monthlyFee', 'benefitsOffered', 'benefitsRedeemed', 'status'];
  if (!fields.includes(field)) return invalid();
  const size = Number(limit);
  let offset = (Number(page ?? 1) - 1) * size;
  if (!Number.isSafeInteger(offset)) return invalid();
  if (cursor !== undefined) {
    if (typeof cursor !== 'string' || !/^[A-Za-z0-9_-]+$/.test(cursor) || cursor.length > 512) return invalid();
    try {
      const decoded = Buffer.from(cursor, 'base64url');
      if (decoded.toString('base64url') !== cursor) return invalid();
      const position = JSON.parse(decoded.toString('utf8'));
      if (position?.version !== 1 || position.sort !== sort || !Number.isSafeInteger(position.offset) || position.offset < 0) return invalid();
      offset = position.offset;
    } catch { return invalid(); }
  }
  const rows = await listAll(COL.sponsors);
  rows.sort((a, b) => {
    const left = a[field], right = b[field];
    const order = left === right ? 0 : left == null ? -1 : right == null ? 1 : left < right ? -1 : 1;
    const tie = a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    return (descending ? -1 : 1) * (order || tie);
  });
  const result = rows.slice(offset, offset + size);
  const nextOffset = offset + result.length;
  const nextCursor = nextOffset < rows.length
    ? Buffer.from(JSON.stringify({ version: 1, offset: nextOffset, sort })).toString('base64url') : null;
  return ok(res, result, 200, { pagination: { limit: size, total: rows.length, nextCursor } });
}));

r.post('/sponsors', requireRole('finance'), wrap(async (req, res) => {
  const { name, tier, monthlyFee, benefits = [] } = req.body || {};
  if (!name) return fail(res, 400, 'VALIDATION', 'name es obligatorio');
  if (tier && !TIERS.includes(tier)) return fail(res, 400, 'VALIDATION', `tier debe ser uno de ${TIERS.join(', ')}`);
  const doc = await addDoc(COL.sponsors, {
    name, tier: tier || 'Bronze', monthlyFee: Number(monthlyFee || 0),
    benefitsOffered: benefits.length, benefitsRedeemed: 0, status: 'ok', benefits,
  });
  return created(res, doc);
}));

r.patch('/sponsors/:id', requireRole('finance'), wrap(async (req, res) => {
  const allowed = ['name', 'tier', 'monthlyFee', 'status', 'benefitsOffered'];
  const patch = {};
  for (const k of allowed) if (k in (req.body || {})) patch[k] = req.body[k];
  const doc = await patchDoc(COL.sponsors, req.params.id, patch);
  if (!doc) return fail(res, 404, 'NOT_FOUND', 'Sponsor no encontrado');
  return ok(res, doc);
}));

r.delete('/sponsors/:id', requireRole('finance'), wrap(async (req, res) => {
  const doc = await getDoc(COL.sponsors, req.params.id);
  if (!doc) return fail(res, 404, 'NOT_FOUND', 'Sponsor no encontrado');
  await deleteDoc(COL.sponsors, req.params.id);
  return noContent(res);
}));

export default r;
