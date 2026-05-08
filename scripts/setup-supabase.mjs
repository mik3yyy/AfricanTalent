#!/usr/bin/env node
// Run: node scripts/setup-supabase.mjs
// Clears all auth users and creates storage buckets with permissive policies.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  console.error("Copy .env.example to .env.local and fill in your credentials first.");
  process.exit(1);
}

const headers = {
  "apikey": SERVICE_ROLE_KEY,
  "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};

async function deleteAllUsers() {
  console.log("→ Listing users...");
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=1000`, { headers });
  const json = await res.json();
  const users = json.users ?? [];
  console.log(`  Found ${users.length} user(s)`);
  for (const user of users) {
    const del = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
      method: "DELETE",
      headers,
    });
    const ok = del.status === 200 || del.status === 204;
    console.log(`  ${ok ? "✓" : "✗"} Deleted ${user.email ?? user.id}`);
  }
}

async function createBucket(id, isPublic = true) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id, name: id, public: isPublic, file_size_limit: 104857600 }), // 100MB
  });
  const json = await res.json();
  if (res.ok) {
    console.log(`  ✓ Created bucket: ${id}`);
  } else if (json.error === "Duplicate" || (json.message ?? "").includes("already exists")) {
    console.log(`  ~ Bucket already exists: ${id}`);
  } else {
    console.log(`  ✗ Error creating ${id}:`, json.message ?? json.error);
  }
}

async function setupStorage() {
  console.log("→ Setting up storage buckets...");
  await createBucket("talent-portraits", true);
  await createBucket("talent-covers", true);
  await createBucket("talent-resumes", true);
}

async function setupStoragePolicies() {
  console.log("→ Setting up storage RLS policies via SQL...");
  const sql = `
    -- Ensure RLS is enabled on storage.objects (already is by default in Supabase)

    -- Drop existing policies if any (idempotent)
    DROP POLICY IF EXISTS "talent_portraits_select" ON storage.objects;
    DROP POLICY IF EXISTS "talent_portraits_insert" ON storage.objects;
    DROP POLICY IF EXISTS "talent_portraits_update" ON storage.objects;
    DROP POLICY IF EXISTS "talent_portraits_delete" ON storage.objects;
    DROP POLICY IF EXISTS "talent_covers_select" ON storage.objects;
    DROP POLICY IF EXISTS "talent_covers_insert" ON storage.objects;
    DROP POLICY IF EXISTS "talent_covers_update" ON storage.objects;
    DROP POLICY IF EXISTS "talent_covers_delete" ON storage.objects;
    DROP POLICY IF EXISTS "talent_resumes_select" ON storage.objects;
    DROP POLICY IF EXISTS "talent_resumes_insert" ON storage.objects;
    DROP POLICY IF EXISTS "talent_resumes_update" ON storage.objects;
    DROP POLICY IF EXISTS "talent_resumes_delete" ON storage.objects;

    -- Portraits: public read, authenticated write
    CREATE POLICY "talent_portraits_select" ON storage.objects FOR SELECT TO public USING (bucket_id = 'talent-portraits');
    CREATE POLICY "talent_portraits_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'talent-portraits');
    CREATE POLICY "talent_portraits_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'talent-portraits');
    CREATE POLICY "talent_portraits_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'talent-portraits');

    -- Covers: public read, authenticated write
    CREATE POLICY "talent_covers_select" ON storage.objects FOR SELECT TO public USING (bucket_id = 'talent-covers');
    CREATE POLICY "talent_covers_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'talent-covers');
    CREATE POLICY "talent_covers_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'talent-covers');
    CREATE POLICY "talent_covers_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'talent-covers');

    -- Resumes: public read, authenticated write
    CREATE POLICY "talent_resumes_select" ON storage.objects FOR SELECT TO public USING (bucket_id = 'talent-resumes');
    CREATE POLICY "talent_resumes_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'talent-resumes');
    CREATE POLICY "talent_resumes_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'talent-resumes');
    CREATE POLICY "talent_resumes_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'talent-resumes');
  `;

  // Execute via Supabase REST SQL endpoint
  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: "POST",
    headers: { ...headers, "Content-Profile": "storage" },
    body: sql,
  });

  // Fall back to psql since Supabase REST doesn't support raw SQL
  const { execSync } = await import("child_process");
  const DATABASE_URL = process.env.DATABASE_URL;
  try {
    execSync(`psql "${DATABASE_URL}" -c "${sql.replace(/"/g, '\\"').replace(/\n/g, " ")}"`, {
      stdio: "inherit",
      timeout: 30000,
    });
    console.log("  ✓ RLS policies applied");
  } catch (err) {
    // Try with heredoc approach
    try {
      const { writeFileSync, unlinkSync } = await import("fs");
      const tmpFile = "/tmp/setup-storage-policies.sql";
      writeFileSync(tmpFile, sql);
      execSync(`psql "${DATABASE_URL}" -f "${tmpFile}"`, { stdio: "inherit", timeout: 30000 });
      unlinkSync(tmpFile);
      console.log("  ✓ RLS policies applied");
    } catch (err2) {
      console.log("  ⚠ Could not apply RLS via psql. Apply manually in Supabase SQL Editor.");
      console.log("  SQL saved to /tmp/setup-storage-policies.sql");
    }
  }
}

async function main() {
  console.log("=== Supabase Setup ===\n");
  await deleteAllUsers();
  console.log();
  await setupStorage();
  console.log();
  await setupStoragePolicies();
  console.log("\n✅ Done. You can now sign in fresh.");
}

main().catch(console.error);
