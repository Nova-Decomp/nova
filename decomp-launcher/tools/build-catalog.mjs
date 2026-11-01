import { readFile, writeFile, mkdir } from 'node:fs/promises';

const token = process.env.GITHUB_TOKEN;
const headers = {
    Accept: 'application/vnd.github.v3+json',
    "User-Agent": "decomp-launcher-catalog",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

const QUERIES = {
    "topic:decompilation",
    "topic:recompilation",
    "topic:static-recompilation"
};
const PAGES_PER_QUERY = 3;

const PLATFORM_HINTS = {
    windows: /(win|windows|\.exe|x64|msvc)/i,
    linux: /(linux|\.so|x64|gcc)/i,
    macos: /(mac|darwin|\.dylib|x64|arm64)/i,
};

