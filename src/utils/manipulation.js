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

export const extractTreeWords = (value, data, section, subSection1) => {
  if (!value || !data || !section) return [];
  let treeWords = [];
  try {
    const subSection2 = section !== "surah" ? "subjects" : "verses";
    const subTitle = section !== "surah" ? "title" : "verse_no";
    const treeIndex = extractTreeIndex(value);
    const [lvl1, lvl2, lvl3, lvl4, lvl5] = treeIndex;

    if (lvl1 >= 0) treeWords.push(data[lvl1][subSection1]);
    if (lvl2 >= 0) treeWords.push(data[lvl1][subSection2][lvl2][subTitle]);
    if (lvl3 >= 0)
      treeWords.push(data[lvl1][subSection2][lvl2].sub_subjects[lvl3].title);
    if (lvl4 >= 0)
      treeWords.push(
        data[lvl1][subSection2][lvl2].sub_subjects[lvl3].subjects_3[lvl4].title
      );
  } catch {}
  return treeWords;
};
export const extractText = (value) => {
  return value?.slice(positionEndIdx(value));
};

export const makeTreeOptions = (treeWords, section) => {
  const treeOption = {};
  const treeKeyNarration = [
    "alphabet",
    "subject",
    "sub_subject",
    "subject_3",
    "subject_4",
  ];
  const treeKeySurah = [
    "surah_name",
    "verse_no",
    "sub_subject",
    "subject_3",
    "subject_4",
  ];
  const treeKey = section !== "surah" ? treeKeyNarration : treeKeySurah;
  treeWords.forEach((word, index) => {
    if (word) treeOption[treeKey[index]] = word;
  });
  return treeOption;
};
