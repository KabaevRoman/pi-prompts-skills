import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import prompts from './prompts.ts';
import skills from './resources.ts';
export default function(pi: ExtensionAPI): void { prompts(pi); skills(pi); }
