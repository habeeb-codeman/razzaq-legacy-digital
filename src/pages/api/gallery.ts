// src/pages/api/gallery.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery");
const ALLOWED = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".bmp"];

type ApiImage = { filename: string; description?: string };
type ApiResponse = { images?: ApiImage[]; error?: string; details?: string };

/**
 * Very small CSV parser that supports quoted fields with commas.
 * Returns array of rows (each row is array of columns).
 */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = i + 1 < text.length ? text[i + 1] : null;

    if (ch === '"' ) {
      if (inQuotes && next === '"') {
        // escaped quote ("")
        field += '"';
        i++; // skip the escaped quote
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && (ch === ",")) {
      row.push(field);
      field = "";
      continue;
    }

    // newline handling (CRLF or LF)
    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      // skip if CRLF: only treat newline when encountering '\n' or separate '\r'
      // If CRLF, you'll get one empty on '\r' which we ignore
      if (ch === "\r" && next === "\n") {
        // will handle at '\n'
        continue;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += ch;
  }

  // push last field/row
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // trim whitespace on fields
  return rows.map((r) => r.map((c) => c.trim()));
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    // Check gallery dir exists
    const dirStat = await fs.stat(GALLERY_DIR).catch(() => null);
    if (!dirStat || !dirStat.isDirectory()) {
      return res.status(500).json({ error: "Gallery directory not found", details: GALLERY_DIR });
    }

    // Read directory
    const files = await fs.readdir(GALLERY_DIR);
    const imageFiles = files.filter((f) => ALLOWED.includes(path.extname(f).toLowerCase()));

    // Try to read gallery.csv to get descriptions and ordering
    const csvPath = path.join(GALLERY_DIR, "gallery.csv");
    let csvExists = true;
    try {
      await fs.access(csvPath);
    } catch {
      csvExists = false;
    }

    let images: ApiImage[] = [];

    if (csvExists) {
      // read and parse CSV
      const csvRaw = await fs.readFile(csvPath, "utf8");
      const rows = parseCSV(csvRaw);

      // Normalize rows: skip empty rows
      const cleaned = rows
        .map((r) => r.filter((c) => c !== undefined)) // ensure arrays
        .filter((r) => r.length >= 1 && r.some((c) => c && c.length > 0));

      // If first row looks like a header with 'filename' in first column, drop it
      if (cleaned.length > 0 && cleaned[0][0].toLowerCase().includes("filename")) {
        cleaned.shift();
      }

      // Build map of filename -> description in CSV order
      for (const r of cleaned) {
        const filename = r[0];
        const description = r.slice(1).join(",").trim(); // join remaining columns as description
        if (!filename) continue;
        // ensure file exists in folder and allowed ext
        if (imageFiles.includes(filename) && ALLOWED.includes(path.extname(filename).toLowerCase())) {
          images.push({ filename, description });
        } else {
          // if filename in CSV doesn't exist, still include but mark description with a warning
          images.push({ filename, description: description || "" });
        }
      }

      // Append any files that exist but weren't in CSV (preserve alphabetical)
      const csvNames = new Set(images.map((i) => i.filename));
      const leftovers = imageFiles.filter((f) => !csvNames.has(f)).sort((a, b) => a.localeCompare(b));
      for (const f of leftovers) images.push({ filename: f, description: "" });
    } else {
      // No CSV: return alphabetical list with empty descriptions
      images = imageFiles.sort((a, b) => a.localeCompare(b)).map((f) => ({ filename: f, description: "" }));
    }

    return res.status(200).json({ images });
  } catch (err: any) {
    console.error("Gallery API error:", err);
    return res.status(500).json({ error: "Could not read gallery directory", details: String(err?.message || err) });
  }
}
