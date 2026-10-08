import { prisma } from "@/lib/db";
import { extractLocation } from "@/lib/ai/classifier";
import type { LocationType } from "@prisma/client";

export type VerifiedLocation = {
  id: string;
  type: LocationType;
  name: string;
  path: string[];
};

export function extractLocationCandidates(message: string): string[] {
  const candidates = new Set<string>();
  const add = (value: string | null | undefined) => {
    const candidate = value?.trim().replace(/^[\s,.;:]+|[\s,.;:]+$/g, "");
    if (candidate && candidate.length >= 2 && candidate.length <= 100) candidates.add(candidate);
  };

  add(extractLocation(message));
  for (const match of message.matchAll(/\b[A-Z][\p{L}\p{M}'-]*(?:\s+[A-Z][\p{L}\p{M}'-]*){0,5}/gu)) {
    const words = match[0].split(/\s+/);
    for (let start = 0; start < words.length; start += 1) {
      for (let length = 1; length <= 3 && start + length <= words.length; length += 1) {
        add(words.slice(start, start + length).join(" "));
      }
    }
  }
  for (const match of message.matchAll(/([\p{L}\p{M}]+(?:\s+[\p{L}\p{M}]+){0,2})\s+(?:ke|ki|ka|के|की|का|में|मे|जिले|शहर|गाँव|गांव|मोहल्ले|तालुका|तहसील)(?=$|\s|[.,!?])/giu)) add(match[1]);
  for (const match of message.matchAll(/(?:in|near|at|district|city|village|gaon|tehsil|taluka|mandal|ward|mohalla|area|में|जिला|शहर|गाँव|गांव|मोहल्ला|तालुका|तहसील)\s+([\p{L}\p{M}]+(?:\s+[\p{L}\p{M}]+){0,2})/giu)) add(match[1]);

  return [...candidates].sort((a, b) => b.length - a.length);
}

export async function findVerifiedLocation(message: string): Promise<VerifiedLocation | null> {
  const candidates = extractLocationCandidates(message);
  if (!candidates.length) return null;
  const searchable = candidates.map((candidate) => candidate.toLocaleLowerCase());
  const matches = await prisma.location.findMany({
    where: {
      isActive: true,
      type: { in: ["STATE", "DISTRICT", "SUB_DISTRICT", "VILLAGE", "CITY", "TOWN", "MUNICIPAL_BODY", "WARD"] },
      OR: [
        { name: { in: candidates, mode: "insensitive" } },
        { aliases: { hasSome: [...new Set([...candidates, ...searchable])] } },
      ],
    },
    select: { id: true, type: true, name: true, parentId: true, aliases: true },
    take: 100,
  });

  for (const candidate of candidates) {
    const normalized = candidate.toLocaleLowerCase();
    const named = matches.filter((item) =>
      item.name.toLocaleLowerCase() === normalized ||
      item.aliases.some((alias) => alias.toLocaleLowerCase() === normalized),
    );
    if (named.length !== 1) continue;

    const location = named[0];
    const path = [location.name];
    let parentId = location.parentId;
    for (let depth = 0; parentId && depth < 8; depth += 1) {
      const parent = await prisma.location.findUnique({
        where: { id: parentId },
        select: { id: true, name: true, parentId: true },
      });
      if (!parent) break;
      path.unshift(parent.name);
      parentId = parent.parentId;
    }
    return { id: location.id, type: location.type, name: location.name, path };
  }
  return null;
}
