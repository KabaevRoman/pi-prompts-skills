import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { acquire } from '@pi-ko/core';
import { fileURLToPath } from 'node:url';
export default function (pi: ExtensionAPI): void {
  const state = acquire(pi,'resources'); if (!state) return;
  const {runtime:r,features} = state;

    pi.on('resources_discover',()=>({skillPaths:[fileURLToPath(new URL('../../resources/skills',import.meta.url))],promptPaths:[fileURLToPath(new URL('../../resources/prompts',import.meta.url))]}));

}
