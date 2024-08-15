/**
 * Randomizes the order of elements in an array using the Fisher-Yates shuffle algorithm.
 *
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} - The shuffled array.
 */
function randomizeArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements at indices i and j
  }
  return array;
}

/**
 * Removes an element from an array at a specified index.
 *
 * @param {Array} array - The array from which to remove the element.
 * @param {number} index - The index of the element to remove.
 * @returns {Array} - The array with the element removed.
 */
function removeElementAtIndex(array, index) {
  if (index > -1 && index < array.length) {
    array.splice(index, 1); // Remove one element at the specified index
  }
  return array;
}

/**
 * Removes a specific element from an array.
 *
 * @param {Array} array - The array from which to remove the element.
 * @param {*} element - The element to remove from the array.
 * @returns {Array} - The array with the element removed.
 */
function removeElement(array, element) {
  const index = array.indexOf(element);
  if (index > -1) {
    // If the element is found in the array
    array.splice(index, 1); // Remove the element at the found index
  }
  return array;
}

/**
 * Checks if a string represents a numeric value.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} - True if the string is numeric, false otherwise.
 */
function isNumeric(str) {
  return !isNaN(str) && !isNaN(parseFloat(str)); // Checks if the string is a valid number
}

/**
 * Pauses execution for a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to sleep.
 */
function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // Busy-wait loop to create a delay
  }
}

module.exports = {
  randomizeArray,
  removeElementAtIndex,
  removeElement,
  isNumeric,
  sleep,
};
