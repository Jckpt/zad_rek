import { Item } from "./types";

export function getHighestValueDrop(data: Item[]) {
  let highestValueDrop = 0;
  let highestValueDropIndex = 0;
  let lastPrice: number;
  data.forEach((currentItem, i) => {
    if (i === 0) {
      lastPrice = currentItem.price;
      return;
    }

    if (highestValueDrop < lastPrice - currentItem.price) {
      highestValueDrop = lastPrice - currentItem.price;
      highestValueDropIndex = i;
    }

    lastPrice = currentItem.price;
  });

  return {
    priceDrop: highestValueDrop.toFixed(2),
    index: highestValueDropIndex,
  };
}

export function getValueDropPeriods(data: Item[]) {
  let valueDropPeriods = 0;
  let lastPrice: number;
  let didValueDrop = false;

  data.forEach((currentItem, i) => {
    if (i === 0) {
      lastPrice = currentItem.price;
      return;
    }

    if (
      didValueDrop &&
      (lastPrice <= currentItem.price || i === data.length - 1)
    ) {
      didValueDrop = false;
      lastPrice = currentItem.price;
      valueDropPeriods++;
      return;
    }

    if (lastPrice > currentItem.price) {
      didValueDrop = true;
    }

    lastPrice = currentItem.price;
  });
  return valueDropPeriods;
}

export function getHighestValueDropSum(data: Item[]) {
  let lastPrice: number;
  let didValueDrop = false;
  let valueDropSum = 0;
  let highestValueDropSum = 0;
  let highestValueDropSumDaysCount = 0;
  let daysCount = 0;
  let highestValueDropSumStart = "";

  data.forEach((currentItem, i) => {
    if (i === 0) {
      lastPrice = currentItem.price;
      daysCount++;
      return;
    }

    if (
      didValueDrop &&
      (lastPrice <= currentItem.price || i === data.length - 1)
    ) {
      if (highestValueDropSum < valueDropSum) {
        highestValueDropSum = valueDropSum;
        highestValueDropSumDaysCount = daysCount;
        highestValueDropSumStart = data[i - daysCount].date;
      }

      daysCount = 0;
      valueDropSum = 0;
      didValueDrop = false;
      lastPrice = currentItem.price;

      return;
    }

    if (lastPrice > currentItem.price) {
      valueDropSum += lastPrice - currentItem.price;
      daysCount += 1;
      didValueDrop = true;
    }

    lastPrice = currentItem.price;
  });
  return {
    highestValueDropSum,
    daysCount: highestValueDropSumDaysCount,
    valueDropStart: highestValueDropSumStart,
  };
}

export function getHighestConsecutiveValue(data: Item[]) {
  let lastPrice: number;
  let didValueStay = false;
  let highestDaysCount = 0;
  let daysCount = 0;
  let highestConsecutiveValue = 0;
  let highestConsecutiveValueStart = "";

  data.forEach((currentItem, i) => {
    if (i === 0) {
      lastPrice = currentItem.price;
      daysCount++;
      return;
    }

    if (
      didValueStay &&
      (lastPrice !== currentItem.price || i === data.length - 1)
    ) {
      if (highestDaysCount < daysCount) {
        highestDaysCount = daysCount;
        highestConsecutiveValue = lastPrice;
        highestConsecutiveValueStart = data[i - daysCount].date;
      }

      daysCount = 1;
      didValueStay = false;
      lastPrice = currentItem.price;

      return;
    }

    if (lastPrice === currentItem.price) {
      daysCount += 1;
      didValueStay = true;
    }

    lastPrice = currentItem.price;
  });
  return {
    highestConsecutiveValue,
    daysCount: highestDaysCount,
    consecutiveValueStart: highestConsecutiveValueStart,
  };
}
