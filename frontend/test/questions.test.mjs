import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadAllQuestions } from '../src/api/questions.js';

test('El catálogo de recorrecciones encuentra preguntas posteriores a la primera página', async () => {
  const calls = [];
  const rows = await loadAllQuestions(async path => {
    calls.push(path);
    return calls.length === 1
      ? { data: Array.from({ length: 100 }, (_, i) => ({ id: `q${i}` })), meta: { pagination: { nextCursor: 'next' } } }
      : { data: [{ id: 'question-for-correction' }], meta: { pagination: { nextCursor: null } } };
  });
  assert.equal(rows.length, 101);
  assert.equal(rows.at(-1).id, 'question-for-correction');
  assert.deepEqual(calls, ['/questions?limit=100', '/questions?limit=100&cursor=next']);
});

test('Un fallo posterior no entrega un catálogo incompleto de preguntas', async () => {
  let calls = 0;
  await assert.rejects(loadAllQuestions(async () => {
    if (++calls === 1) return { data: [{ id: 'q1' }], meta: { pagination: { nextCursor: 'next' } } };
    throw new Error('Sin conexión');
  }), /Sin conexión/);
});

test('Un catálogo vacío termina y un cursor repetido se rechaza', async () => {
  assert.deepEqual(await loadAllQuestions(async () => ({ data: [], meta: { pagination: { nextCursor: null } } })), []);
  await assert.rejects(loadAllQuestions(async () => ({ data: [], meta: { pagination: { nextCursor: 'same' } } })), /No se pudo completar/);
});
