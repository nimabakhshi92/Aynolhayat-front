import { toJalaali } from "jalaali-js";

export const sortFunction = (a, b) => {
  if ((typeof a === "number") & (typeof b === "number")) {
    return a - b;
  } else {
    if (a < b) return -1;
    else if (a > b) return 1;
    else return 0;
  }
};

export const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getSingleNarrationSentStatus = ({
  narrationId,
  allSentStatus,
}) => {
  const narration = allSentStatus?.find(
    (narrationStatus) => narrationStatus?.narration?.id === narrationId
  );
  if (narration) return narration?.status;
};

export const getSharedNarrationIdFromNarrationId = ({
  narrationId,
  allSentStatus,
}) => {
  const narration = allSentStatus?.find(
    (narrationStatus) => narrationStatus?.narration?.id === narrationId
  );
  if (narration) return narration?.id;
};

export const convertGregorianToJalali = (gregorianDate) => {
  if (!gregorianDate) return;
  const date = new Date(gregorianDate);
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  const { jy, jm, jd } = toJalaali(gy, gm, gd);
  return `${jy}-${jm}-${jd}`;
};

export const getCurrentJalaliDate = () => {
  const updated = new Date();
  const jalali = convertGregorianToJalali(updated);
  return jalali;
};

export function adjustTextSpacing(input) {
  let adjustedText = input.replace(/(\S)([,:.،؛?؟])(\S)/g, "$1$2 $3");
  adjustedText = adjustedText.replaceAll("《", "«");
  adjustedText = adjustedText.replaceAll("》", "»");

  const openingBrackets = "[\\(\\uFD3E«<\\[{《]";
  const closingBrackets = "[\\)\\uFD3F»>\\]}》]";

  adjustedText = adjustedText.replace(
    new RegExp(`\\s*(${openingBrackets})\\s*`, "g"),
    " $1"
  );

  adjustedText = adjustedText.replace(
    new RegExp(`\\s*(${closingBrackets})\\s*`, "g"),
    "$1 "
  );

  adjustedText = adjustedText.replace(/\s*([,:.،؛])\s*/g, "$1 ");

  adjustedText = adjustedText.replace(/\s{2,}/g, " ");

  return adjustedText.trim();
}
