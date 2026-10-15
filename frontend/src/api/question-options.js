// Se permiten huecos finales del formulario, pero nunca se desplazan letras.
export function questionOptions(values, correctAnswer) {
  const options = values.map(value => value.trim());
  while (options.length && options.at(-1) === '') options.pop();
  if (options.length < 2 || options.length > 5 || options.some(value => !value)) {
    throw new Error('q_err_options');
  }
  if (!'ABCDE'.slice(0, options.length).split('').includes(correctAnswer)) {
    throw new Error('q_err_correct');
  }
  return options;
}
