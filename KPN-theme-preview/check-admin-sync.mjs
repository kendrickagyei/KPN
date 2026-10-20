// Verifies that the admin UID allowlist in firebase-config.js matches the
// isAdmin() allowlist in firestore.rules. Run after any admin change:
//   node check-admin-sync.mjs
// Exits 0 when both lists match, 1 on drift, 2 when parsing fails.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const configSrc = readFileSync(join(here, "firebase-config.js"), "utf8");
const rulesSrc = readFileSync(join(here, "firestore.rules"), "utf8");

const configMatch = configSrc.match(/adminUids\s*=\s*\[([\s\S]*?)\]/);
const isAdminMatch = rulesSrc.match(
  /function\s+isAdmin\s*\(\)\s*\{[\s\S]*?in\s*\[([\s\S]*?)\]/
);

const extractUids = (block) =>
  [...(block ?? "").matchAll(/"([^"]+)"/g)].map((match) => match[1]);

const configUids = extractUids(configMatch?.[1]);
const rulesUids = extractUids(isAdminMatch?.[1]);

if (configUids.length === 0 || rulesUids.length === 0) {
  console.error(
    "Could not parse admin UIDs from firebase-config.js and/or firestore.rules."
  );
  process.exit(2);
}

const missingInRules = configUids.filter((uid) => !rulesUids.includes(uid));
const missingInConfig = rulesUids.filter((uid) => !configUids.includes(uid));

if (missingInRules.length > 0 || missingInConfig.length > 0) {
  console.error("Admin allowlist drift detected:");
  for (const uid of missingInRules) {
    console.error(
      `  - ${uid} is in firebase-config.js but missing from firestore.rules isAdmin()`
    );
  }
  for (const uid of missingInConfig) {
    console.error(
      `  - ${uid} is in firestore.rules isAdmin() but missing from firebase-config.js`
    );
  }
  console.error(
    "Update both files together, then republish the rules in the Firebase console."
  );
  process.exit(1);
}

console.log(
  `OK: ${configUids.length} admin UID(s) match in firebase-config.js and firestore.rules.`
);
