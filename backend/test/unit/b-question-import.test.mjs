import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importQuestionBatch, questionImportKey } from '../../src/lib/question-import.js';

const row = {
  pregunta: 'Pregunta ficticia', alternativas: ['A', 'B'], respuesta_correcta: 'A',
  explicacion_respuesta: 'Texto de prueba', habilidad_requerida: 'Prueba', eje: 'Álgebra', dificultad: 'd1',
};

test('E22: fallo de escritura no se cuenta como importado y permite continuar sin filtrar secretos', async () => {
  let attempts = 0;
  const result = await importQuestionBatch({ testId: 'm1', items: [row, row] }, {
    readExisting: async () => [],
    write: async () => {
      if (++attempts === 1) throw new Error('Proveedor: contraseña-secreta-no-mostrar');
      return { id: 'qst_ok', imported: true };
    },
  });
  assert.equal(attempts, 2);
  assert.equal(result.imported, 1); assert.equal(result.skipped, 0);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].index, 0);
  assert.equal(result.errors[0].code, 'IMPORT_WRITE_ERROR');
  assert.doesNotMatch(JSON.stringify(result), /contraseña-secreta/);
});

test('E22: identidad normaliza espacios y Unicode, conserva mayúsculas y separa pruebas', () => {
  const key = questionImportKey({ testId: 'm1', statement: 'Álgebra x' });
  assert.equal(questionImportKey({ testId: 'm1', statement: '  A\u0301lgebra\n x  ' }), key);
  assert.notEqual(questionImportKey({ testId: 'm1', statement: 'Álgebra X' }), key);
  assert.notEqual(questionImportKey({ testId: 'm2', statement: 'Álgebra x' }), key);
});
