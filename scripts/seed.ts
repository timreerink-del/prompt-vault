/**
 * Seed script — reads existing seed data and inserts into Supabase entries table.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";

// Load env
import { config } from "dotenv";
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Map old category names to new type field
function mapType(category: string): string {
  switch (category) {
    case "skill":
      return "skill";
    case "prompt":
      return "prompt";
    case "workflow":
    case "agent":
      return "agent_workflow";
    default:
      return "resource";
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface SeedItem {
  title: string;
  category: string;
  description: string;
  content: string;
  output?: string;
  tags: string[];
  installCommand?: string;
  sourceUrl?: string;
  author?: string;
  starred?: boolean;
}

async function seed() {
  console.log("Loading seed data...");

  // Dynamic imports for the seed data files
  // We'll read them and transform
  const { SEED_DATA } = await import("../src/data/seed");
  const { AGENT_DATA } = await import("../src/data/seed-agents");
  const { UX_COLLECTION } = await import("../src/data/seed-ux-collection");
  const { AGENT_EXPERIENCE_DATA } = await import("../src/data/seed-agent-experience");
  const { SCOUT_W17_DATA } = await import("../src/data/seed-scout-w17");

  const allItems: SeedItem[] = [
    ...SEED_DATA,
    ...AGENT_DATA,
    ...UX_COLLECTION,
    ...AGENT_EXPERIENCE_DATA,
    ...SCOUT_W17_DATA,
  ];

  console.log(`Found ${allItems.length} items to seed`);

  // Check for existing entries
  const { data: existing } = await supabase
    .from("entries")
    .select("slug");

  const existingSlugs = new Set((existing || []).map((e) => e.slug));

  const entries = allItems
    .map((item) => {
      const slug = generateSlug(item.title);
      if (existingSlugs.has(slug)) {
        console.log(`  Skipping (exists): ${item.title}`);
        return null;
      }

      // Combine content and output into content field
      let fullContent = item.content || "";
      if (item.output) {
        fullContent += `\n\n---\n\n**Expected Output:**\n${item.output}`;
      }

      return {
        title: item.title,
        slug,
        type: mapType(item.category),
        category: item.category,
        description: item.description,
        content: fullContent,
        prerequisites: [] as string[],
        source_url: item.sourceUrl || null,
        tags: item.tags || [],
        install_command: item.installCommand || null,
        featured: item.starred || false,
        status: "published",
      };
    })
    .filter(Boolean);

  if (entries.length === 0) {
    console.log("No new entries to seed.");
    return;
  }

  console.log(`Inserting ${entries.length} new entries...`);

  // Insert in batches of 20
  for (let i = 0; i < entries.length; i += 20) {
    const batch = entries.slice(i, i + 20);
    const { error } = await supabase.from("entries").insert(batch);
    if (error) {
      console.error(`Error inserting batch ${i / 20 + 1}:`, error.message);
    } else {
      console.log(`  Batch ${i / 20 + 1}: ${batch.length} entries inserted`);
    }
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
