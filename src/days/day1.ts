import { EOL } from 'os';
import { Day, getInputSplitByLine, sumNumbers } from '../common';
import { string } from 'yargs';

const day: Day = {
  part1: async (dayNumber, example) => {
    const lines = await getInputSplitByLine(dayNumber, example);
    const numberLines = lines.map((line) => Array.from(line.matchAll(/\d/g)));
    const firstLastNumbers = numberLines.map(([[first], ...rest]) => {
      if (rest.length === 0) {
        return [first, first];
      }
      const [[last]] = rest.reverse();
      return [first, last];
    });
    const calibrations = firstLastNumbers.map(([first, last]) => first + last).map(Number);
    return sumNumbers(calibrations);
  },
  part2: async (dayNumber, example) => {
    const lines = await getInputSplitByLine(dayNumber, example);
    const numbers = lines.map(lineToNumbers);
    const sums = numbers.map(joinFirstLast);
    return sumNumbers(sums);
  },
};

export default day;

const numberMap = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
} as const;

type NumberWord = keyof typeof numberMap;
type NumberValue = (typeof numberMap)[NumberWord];

const numbers = Object.values(numberMap);
const numberWords = Object.keys(numberMap) as NumberWord[];

const isNumber = (number: string): number is NumberValue => {
  return numbers.includes(number as NumberValue);
};

const isNumberWord = (numberWord: string): numberWord is NumberWord => {
  return numberWords.includes(numberWord as NumberWord);
};

const lineToNumbers = (line: string): [number, ...number[]] => {
  const numbers: number[] = [];
  for (let first = 0; first < line.length; first++) {
    const potentialNumber = line[first];
    if (isNumber(potentialNumber)) {
      numbers.push(Number(potentialNumber));
      continue;
    }
    for (let last = first; last < line.length; last++) {
      const potentialNumberWord = line.substring(first, last + 1);
      if (isNumberWord(potentialNumberWord)) {
        numbers.push(Number(numberMap[potentialNumberWord]));
        first = last;
        continue;
      }
    }
  }
  if (numbers.length < 1) {
    throw new Error(`Did not find any numbers in ${String(line)}`);
  }
  const [first, ...rest] = numbers;
  return [first, ...rest];
};

const joinFirstLast = (numbers: [number, ...number[]]): number => {
  if (numbers.length === 0) {
    throw new Error('Empty array.');
  }
  return Number(String(numbers[0]) + String(numbers[numbers.length - 1]));
};
