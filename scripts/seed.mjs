import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to strip TypeScript and eval the data
function loadSeedData(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove import statements
  content = content.replace(/^import\s+.*;\s*$/gm, '');

  // Remove interface definitions (multiline)
  content = content.replace(/interface\s+\w+\s*\{[\s\S]*?\n\}/g, '');

  // Replace "export const NAME: TYPE[] = [" with "const NAME = ["
  content = content.replace(/export\s+const\s+(\w+)\s*:\s*\w+\[\]\s*=/g, 'const $1 =');

  // Find the variable name
  const match = content.match(/const\s+(\w+)\s*=\s*\[/);
  if (!match) {
    throw new Error(`Could not find array variable in ${filePath}`);
  }
  const varName = match[1];

  try {
    const fn = new Function(`${content}; return ${varName};`);
    return fn();
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    throw error;
  }
}

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to map category to type
function mapCategoryToType(category) {
  const mapping = {
    'skill': 'skill',
    'prompt': 'prompt',
    'workflow': 'agent_workflow',
    'agent': 'agent_workflow',
  };
  return mapping[category] || 'resource';
}

// Helper function to transform item to Supabase schema
function transformItem(item) {
  const combinedContent = item.output
    ? `${item.content}\n\n---\n\n**Output:** ${item.output}`
    : item.content;

  return {
    title: item.title,
    slug: generateSlug(item.title),
    type: mapCategoryToType(item.category),
    category: item.category,
    description: item.description,
    content: combinedContent,
    prerequisites: [],
    source_url: item.sourceUrl || null,
    tags: item.tags || [],
    install_command: item.installCommand || null,
    featured: item.starred === true,
    status: 'published',
  };
}

// Main seed function
async function seed() {
  try {
    console.log('Loading seed data files...');

    const seedPath = path.join(__dirname, '../src/data/seed.ts');
    const agentPath = path.join(__dirname, '../src/data/seed-agents.ts');
    const uxPath = path.join(__dirname, '../src/data/seed-ux-collection.ts');
    const scoutPath = path.join(__dirname, '../src/data/seed-scout-w15.ts');
    const agentExperiencePath = path.join(__dirname, '../src/data/seed-agent-experience.ts');

    const seedData = loadSeedData(seedPath);
    const agentData = loadSeedData(agentPath);
    const uxData = loadSeedData(uxPath);
    const scoutData = loadSeedData(scoutPath);
    const agentExperienceData = loadSeedData(agentExperiencePath);

    console.log(`Loaded ${seedData.length} items from seed.ts`);
    console.log(`Loaded ${agentData.length} items from seed-agents.ts`);
    console.log(`Loaded ${uxData.length} items from seed-ux-collection.ts`);
    console.log(`Loaded ${scoutData.length} items from seed-scout-w15.ts`);
    console.log(`Loaded ${agentExperienceData.length} items from seed-agent-experience.ts`);

    const allItems = [...seedData, ...agentData, ...uxData, ...scoutData, ...agentExperienceData];
    console.log(`Total items to insert: ${allItems.length}`);

    // Transform all items
    const transformedItems = allItems.map(transformItem);

    console.log('Inserting entries into Supabase...');

    // Insert in batches to avoid payload size issues
    const batchSize = 10;
    for (let i = 0; i < transformedItems.length; i += batchSize) {
      const batch = transformedItems.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('entries')
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        throw error;
      }

      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} items)`);
    }

    console.log(`Successfully seeded ${transformedItems.length} entries`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
