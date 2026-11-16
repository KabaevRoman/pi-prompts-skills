import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { acquire } from '@kabaevroman/pi-code-core';
import { readFileSync } from 'node:fs';
export default function (pi: ExtensionAPI): void {
  const state = acquire(pi,'prompts'); if (!state) return;
  const {runtime:r,features} = state;

    const behavior = readFileSync(new URL('../../resources/system.md',import.meta.url),'utf8');
    pi.on('before_agent_start',(event,ctx) => {
      const o = event.systemPromptOptions;
      const tools = pi.getAllTools().filter(t => pi.getActiveTools().includes(t.name));
      const context = o.contextFiles.map(f => `<project_instructions path=${JSON.stringify(f.path)}>\n${f.content}\n</project_instructions>`).join('\n\n');
      const skills = o.skills.map(s => `- ${s.name}: ${s.description} (read ${s.filePath} when applicable)`).join('\n');
      return {systemPrompt:[behavior, r.prompts.fragment('system-prompt-system-section.md'),
        `Runtime: pi. Model: ${ctx.model?.provider ?? 'unknown'}/${ctx.model?.id ?? 'unknown'}. Working directory: ${ctx.cwd}.`,
        `Available tools (use their exact names and registered schemas):\n${tools.map(t=>`- ${t.name}: ${t.description}`).join('\n')}`,
        context,features.has('memory') ? r.memory.format(r.memory.sources.filter(s=>!s.scope && !o.contextFiles.some(f=>f.path === s.path))) : '',
        skills ? `Available skills:\n${skills}` : '', o.appendSystemPrompt,
        ...Object.entries(o.sections).map(([name,text])=>`<${name}>\n${text}\n</${name}>`),
        ...o.promptGuidelines, ...Object.values(o.toolGuidelines).flat(),
      ].filter(Boolean).join('\n\n')};
    });
    pi.registerCommand('cc-prompt',{description:'Inspect the replacement prompt and active tools',handler:async (_args,ctx)=>r.message(ctx.getSystemPrompt())});

}
