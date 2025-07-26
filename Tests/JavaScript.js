function generateRandomArray(length, minValue, maxValue) {
  const randomArray = [];
  for (let i = 0; i < length; i++) {
    const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    randomArray.push(randomValue);
  }
  return randomArray;
}

function bubbleSort(array) {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }
}

function binarySearch(array, target) {
  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (array[mid] === target) {
      return mid;
    } else if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

function main() {
  const arraySize = 500;
  const minValue = 1;
  const maxValue = 1000;

  const randomArray = generateRandomArray(arraySize, minValue, maxValue);
  console.log("Generated Random Array:", randomArray);

  bubbleSort(randomArray);
  console.log("Array After Bubble Sort:", randomArray);

  const targetValue = randomArray[Math.floor(Math.random() * arraySize)];
  console.log("Target Value for Binary Search:", targetValue);

  const targetIndex = binarySearch(randomArray, targetValue);
  if (targetIndex !== -1) {
    console.log(`Target Value found at index ${targetIndex}.`);
  } else {
    console.log("Target Value not found in the array.");
  }
}

main();
