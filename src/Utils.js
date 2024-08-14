function randomizeArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio entre 0 e i
    [array[i], array[j]] = [array[j], array[i]]; // Intercambia elementos
  }
  return array;
}

function removeElementAtIndex(array, index) {
  if (index > -1 && index < array.length) {
    array.splice(index, 1); // Elimina un elemento en el índice especificado
  }
  return array;
}

function removeElement(array, element) {
  const index = array.indexOf(element);
  if (index > -1) {
    // Si se encuentra el elemento en el array
    array.splice(index, 1); // Eliminar el elemento en ese índice
  }
  return array;
}

function isNumeric(str) {
  return !isNaN(str) && !isNaN(parseFloat(str));
}

module.exports = {
  randomizeArray,
  removeElementAtIndex,
  removeElement,
  isNumeric,
};
