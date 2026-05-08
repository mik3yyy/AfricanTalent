import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import crypto from "crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

// Cloudinary signed upload — no SDK needed
function makeSignature(params: Record<string, string>): string {
  const str = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return crypto.createHash("sha1").update(str + API_SECRET).digest("hex");
}

const FOLDER_MAP: Record<string, { folder: string; resourceType: string }> = {
  "talent-portraits": { folder: "afri-talent/portraits", resourceType: "image" },
  "talent-covers":   { folder: "afri-talent/covers",    resourceType: "auto"  },
  "talent-resumes":  { folder: "afri-talent/resumes",   resourceType: "raw"   },
};

export async function POST(request: NextRequest) {
  // Verify user is authenticated via Supabase session cookie
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 });
  }

  // Parse multipart form
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const bucket = formData.get("bucket") as string | null;
  const filename = formData.get("filename") as string | null;

  if (!file || !bucket) {
    return NextResponse.json({ error: "Missing file or bucket" }, { status: 400 });
  }

  const dest = FOLDER_MAP[bucket];
  if (!dest) {
    return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
  }

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json(
      { error: "Cloudinary credentials not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env.local" },
      { status: 500 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const publicId = filename ?? file.name.replace(/\.[^.]+$/, "");

  const signParams: Record<string, string> = {
    folder: dest.folder,
    public_id: publicId,
    timestamp,
  };
  const signature = makeSignature(signParams);

  const upload = new FormData();
  upload.append("file", file);
  upload.append("api_key", API_KEY);
  upload.append("timestamp", timestamp);
  upload.append("signature", signature);
  upload.append("folder", dest.folder);
  upload.append("public_id", publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${dest.resourceType}/upload`,
    { method: "POST", body: upload }
  );

  const json = await res.json() as { secure_url?: string; error?: { message: string } };
  if (!res.ok || !json.secure_url) {
    return NextResponse.json(
      { error: json.error?.message ?? "Cloudinary upload failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: json.secure_url });
}
