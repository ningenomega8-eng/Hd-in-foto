import crypto from "crypto";

const ALLOWED = {
  upscale: "e_upscale",
  enhance: "e_enhance",
  restore: "e_gen_restore",
};

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({ error: "Env Cloudinary belum diisi di Vercel" });
  }

  const mode = (req.body && req.body.mode) || "upscale";
  const eager = ALLOWED[mode];
  if (!eager) return res.status(400).json({ error: "Mode tidak valid" });

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `eager=${eager}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(toSign + CLOUDINARY_API_SECRET)
    .digest("hex");

  res.status(200).json({
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    timestamp,
    eager,
    signature,
  });
}
