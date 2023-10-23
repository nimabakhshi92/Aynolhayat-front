export const positionEndIdx = (value) => {
  if (!value) return;
  let idx;
  idx = value?.indexOf("l4");
  if (idx > -1) return idx + 2;
  idx = value?.indexOf("l3");
  if (idx > -1) return idx + 2;
  idx = value?.indexOf("l2");
  if (idx > -1) return idx + 2;
  idx = value?.indexOf("l1");
  if (idx > -1) return idx + 2;
  return 0;
};

export const extractPosition = (value) => {
  return value?.slice(0, positionEndIdx(value));
};

export const extractTreeIndex = (value) => {
  const position = extractPosition(value);
  const replacedPosition = position
    .replaceAll("l1", "tempValue")
    .replaceAll("l2", "tempValue")
    .replaceAll("l3", "tempValue")
    .replaceAll("l4", "tempValue")
    .replaceAll("l5", "tempValue");
  return replacedPosition
    .split("tempValue")
    .filter((i) => i !== "")
    .map((i) => Number(i));
};

export const extractText = (value) => {
  return value?.slice(positionEndIdx(value));
};
