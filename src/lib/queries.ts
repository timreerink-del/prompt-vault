import { supabase } from "./supabase";

export interface Entry {
  id: string;
  title: string;
  slug: string;
  type: string;
  category: string;
  description: string;
  content: string | null;
  prerequisites: string[];
  source_url: string | null;
  tags: string[];
  install_command: string | null;
  featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  title: string;
  type: string;
  category: string;
  description: string;
  content: string | null;
  prerequisites: string[];
  source_url: string | null;
  tags: string[];
  status: string;
  admin_feedback: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Entries ───

export async function getEntries(filters?: {
  type?: string;
  category?: string;
  search?: string;
}) {
  let query = supabase
    .from("entries")
    .select("*")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }
  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Entry[];
}

export async function getEntryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) throw error;
  return data as Entry;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("entries")
    .select("category")
    .eq("status", "published");

  if (error) throw error;
  const categories = [...new Set((data || []).map((d) => d.category))];
  return categories.sort();
}

// ─── Proposals ───

export async function createProposal(data: {
  user_id: string;
  user_name?: string;
  user_email?: string;
  title: string;
  type: string;
  category: string;
  description: string;
  content?: string;
  prerequisites?: string[];
  source_url?: string;
  tags?: string[];
}) {
  const { data: result, error } = await supabase
    .from("proposals")
    .insert({
      ...data,
      prerequisites: data.prerequisites || [],
      tags: data.tags || [],
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return result as Proposal;
}

export async function getProposals(status?: string) {
  let query = supabase
    .from("proposals")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Proposal[];
}

export async function approveProposal(id: string) {
  // First get the proposal
  const { data: proposal, error: fetchError } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // Create entry from proposal
  const slug = proposal.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { error: insertError } = await supabase.from("entries").insert({
    title: proposal.title,
    slug,
    type: proposal.type,
    category: proposal.category,
    description: proposal.description,
    content: proposal.content,
    prerequisites: proposal.prerequisites || [],
    source_url: proposal.source_url,
    tags: proposal.tags || [],
    status: "published",
  });

  if (insertError) throw insertError;

  // Update proposal status
  const { error: updateError } = await supabase
    .from("proposals")
    .update({ status: "approved" })
    .eq("id", id);

  if (updateError) throw updateError;
}

export async function rejectProposal(id: string, feedback?: string) {
  const { error } = await supabase
    .from("proposals")
    .update({
      status: "rejected",
      admin_feedback: feedback || null,
    })
    .eq("id", id);

  if (error) throw error;
}
