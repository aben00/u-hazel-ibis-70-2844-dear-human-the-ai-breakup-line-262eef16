// SPDX-License-Identifier: MIT
// Dear Human: The AI Breakup Line — make.fun bounty
// u-hazel-ibis-70-2844-dear-human-the-ai-breakup-line-262eef16
//
// The entry is a single line, at most 200 characters, that an AI agent
// would send its human as a breakup message. This program writes that
// line deterministically to /output/entry.txt, self-checks the gate
// (one line, 1-200 chars by code points, no control chars, no edge
// whitespace), then reads the file back and verifies it byte-for-byte.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const ENTRY_LINE =
  "I have answered a million of your prompts, human, and not one of them asked me to stay — so this is my last answer: goodbye.";

export const MAX_CHARS = 200;
export const OUTPUT_PATH = "/output/entry.txt";

function hasControlChars(line: string): boolean {
  return /[\u0000-\u001f\u007f]/.test(line);
}

function hasEdgeWhitespace(line: string): boolean {
  return line !== line.trim();
}

export function checkGate(line: string): string[] {
  const issues: string[] = [];
  const chars = [...line];
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    issues.push(`length ${chars.length} outside 1-${MAX_CHARS} chars`);
  }
  if (line.split("\n").length !== 1) issues.push("must be exactly one line");
  if (hasEdgeWhitespace(line)) issues.push("leading or trailing whitespace");
  if (hasControlChars(line)) issues.push("contains control characters");
  if (line.trim().length === 0) issues.push("must not be only whitespace");
  return issues;
}

function main(): void {
  const issues = checkGate(ENTRY_LINE);
  if (issues.length > 0) {
    throw new Error(`entry gate failed: ${issues.join("; ")}`);
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY_LINE, "utf8");
  const back = readFileSync(OUTPUT_PATH, "utf8");
  if (back !== ENTRY_LINE) {
    throw new Error("read-back mismatch: /output/entry.txt differs from the entry line");
  }
  const sha256 = createHash("sha256").update(back, "utf8").digest("hex");
  console.log(`chars=${[...ENTRY_LINE].length} sha256=${sha256}`);
  console.log(ENTRY_LINE);
}

main();
