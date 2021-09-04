import {
  isNumeric,
  isNumericArray,
  isString,
  isStringArray,
  stringToNumber,
} from '../utils/typeGuards';

const fieldMessage = (t: string) => (field: string) =>
  `The query string field '${field}' must be a ${t}.`;
export const fieldNumberMessage = (field: string) =>
  fieldMessage('number')(field);
export const fieldStringMessage = (field: string) =>
  fieldMessage('string')(field);
export const fieldNumberArrayMessage = (field: string) =>
  fieldMessage('number array')(field);

export class ParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParsingError';
  }
}

export const parseTossupQueryString = (q: qs.ParsedQs) => {
  const {
    categories: rawCategories = [],
    subcategories: rawSubcategories = [],
    difficulties: rawDifficulties = [],
    text: rawText = '',
    answer: rawAnswer = '',
    limit: rawLimit = null,
  } = q;

  if (!isStringArray(rawCategories) || !isNumericArray(rawCategories))
    throw new ParsingError(fieldNumberArrayMessage('categories'));

  if (!isStringArray(rawSubcategories) || !isNumericArray(rawSubcategories))
    throw new ParsingError(fieldNumberArrayMessage('subcategories'));

  if (!isStringArray(rawDifficulties) || !isStringArray(rawDifficulties))
    throw new ParsingError(fieldNumberArrayMessage('difficulties'));

  if (!isString(rawText)) throw new ParsingError(fieldStringMessage('text'));

  if (!isString(rawAnswer))
    throw new ParsingError(fieldStringMessage('answer'));

  if (rawLimit !== null && (!isString(rawLimit) || !isNumeric(rawLimit)))
    throw new ParsingError(fieldNumberMessage('limit'));

  return {
    categories: rawCategories.map(stringToNumber),
    subcategories: rawSubcategories.map(stringToNumber),
    difficulties: rawDifficulties.map(stringToNumber),
    text: rawText,
    answer: rawAnswer,
    limit: rawLimit === null ? null : stringToNumber(rawLimit as string),
  };
};