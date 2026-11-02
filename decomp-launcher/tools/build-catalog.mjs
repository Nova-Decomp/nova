import { readFile, writeFile, mkdir } from "node:fs/promises";

const TOKEN = process.env.GITHUB_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "decomp-launcher-catalog",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

// Tune these. Topic names are what repo owners chose, so check GitHub's topic pages for more.
const QUERIES = [
  "topic:decompilation",
  "topic:recompilation",
  "topic:static-recompilation",
];
const PAGES_PER_QUERY = 3; // 100 repos per page

const PLATFORM_HINTS = {
  windows: /(win|windows|\.exe|x64|msvc)/i,
  linux: /(linux|appimage)/i,
  macos: /(mac|osx|darwin|\.dmg)/i,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (res.status === 404) return null;
  if (res.status === 401) {
    throw new Error("GitHub rejected the token (401). Check GITHUB_TOKEN: it may be mistyped, expired or revoked.");
  }
  if (res.status === 403 || res.status === 429) {
    throw new Error("GitHub rate limit reached. Wait a few minutes, or use a valid GITHUB_TOKEN.");
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return res.json();
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return fallback;
  }
}

console.log("build-catalog v2 (with repos map)");

const seeds = await readJson("tools/seeds.json", []); // ["owner/repo", ...] you add by hand
const overrides = await readJson("tools/overrides.json", {}); // hand-written details per repo

// 1. collect candidate repos
const repos = new Map();
for (const q of QUERIES) {
  for (let page = 1; page <= PAGES_PER_QUERY; page++) {
    const query = encodeURIComponent(`${q} archived:false fork:false`);
    const data = await gh(`/search/repositories?q=${query}&sort=stars&per_page=100&page=${page}`);
    for (const r of data?.items ?? []) repos.set(r.full_name.toLowerCase(), r);
    await sleep(2500); // search API allows ~30 requests/minute
  }
}
for (const name of seeds) {
  if (repos.has(name.toLowerCase())) continue;
  const r = await gh(`/repos/${name}`);
  if (r) repos.set(r.full_name.toLowerCase(), r);
}
console.log(`Found ${repos.size} candidate repositories`);

// 2. keep only repos with a downloadable build
const entries = [];
for (const r of repos.values()) {
  const releases = await gh(`/repos/${r.full_name}/releases?per_page=5`);
  const rel = releases?.find((x) => !x.draft);
  if (!rel || rel.assets.length === 0) continue;

  const names = rel.assets.map((a) => a.name);
  const platforms = Object.entries(PLATFORM_HINTS)
    .filter(([, rx]) => names.some((n) => rx.test(n)))
    .map(([p]) => p);
  if (platforms.length === 0) continue;

  const o = overrides[r.full_name] ?? {};
  entries.push({
    id: r.full_name.toLowerCase().replace("/", "--"),
    name: o.name ?? r.name,
    repo: r.full_name,
    description: o.description ?? r.description ?? "",
    stars: r.stargazers_count,
    latestTag: rel.tag_name,
    prerelease: rel.prerelease,
    publishedAt: rel.published_at,
    platforms,
    gamePlatform: o.gamePlatform,
    setup: o.setup,
    reviewed: Boolean(overrides[r.full_name]),
  });
  await sleep(150);
}

entries.sort((a, b) => Number(b.reviewed) - Number(a.reviewed) || b.stars - a.stars);

await mkdir("public", { recursive: true });
await writeFile(
  "public/catalog.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), entries }, null, 2),
);
console.log(`Wrote ${entries.length} playable-looking entries to public/catalog.json`);
