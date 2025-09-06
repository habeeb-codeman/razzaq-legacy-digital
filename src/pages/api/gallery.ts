// src/pages/api/gallery.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery");
const ALLOWED = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"];

type Data = {
  images?: string[];
  error?: string;
  details?: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const files = await fs.readdir(GALLERY_DIR);
    const images = files
      .filter((f) => ALLOWED.includes(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
    return res.status(200).json({ images });
  } catch (err: any) {
    console.error("Gallery API error:", err);
    return res
      .status(500)
      .json({ error: "Could not read gallery directory", details: err?.message || String(err) });
  }
}
