import assert from "node:assert/strict";

import { formatLargeNumber, formatWithCommas, removeCommas } from "../../lib/number-formatting";

type FormatCase = {
  input: number | string | null | undefined;
  expected: string;
};

const formatCases: FormatCase[] = [
  { input: 0, expected: "₹0" },
  { input: 500, expected: "₹500" },
  { input: 1000, expected: "₹1,000" },
  { input: 10000, expected: "₹10,000" },
  { input: 100000, expected: "₹1,00,000" },
  { input: 1000000, expected: "₹10,00,000" },
  { input: 1234567890, expected: "₹1,23,45,67,890" },
  { input: -5000, expected: "-₹5,000" },
  { input: "987654", expected: "₹9,87,654" },
  { input: null, expected: "₹0" },
  { input: undefined, expected: "₹0" },
  { input: "not-a-number", expected: "₹0" },
];

const commaCases: { input: string; expected: string }[] = [
  { input: "0", expected: "0" },
  { input: "500", expected: "500" },
  { input: "1000", expected: "1,000" },
  { input: "10000", expected: "10,000" },
  { input: "100000", expected: "1,00,000" },
  { input: "1000000", expected: "10,00,000" },
  { input: "10000000", expected: "1,00,00,000" },
  { input: "1234567.50", expected: "12,34,567.50" },
];

export function runFormattingTests(): void {
  for (const testCase of formatCases) {
    const value = formatLargeNumber(testCase.input);
    assert.equal(
      value,
      testCase.expected,
      `formatLargeNumber(${String(testCase.input)}) should be ${testCase.expected}`,
    );
  }

  for (const testCase of commaCases) {
    const value = formatWithCommas(testCase.input);
    assert.equal(
      value,
      testCase.expected,
      `formatWithCommas(${testCase.input}) should be ${testCase.expected}`,
    );
    assert.equal(
      removeCommas(value),
      testCase.input.includes(".") ? testCase.input : testCase.input,
      `removeCommas should recover original digits`,
    );
  }
}

if (process.argv[1] && (process.argv[1].endsWith('formatting-tests.ts') || process.argv[1].endsWith('formatting-tests.js'))) {
  runFormattingTests();
  console.log("Formatting tests passed successfully.");
}
