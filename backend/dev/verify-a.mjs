import { spawnSync } from 'node:child_process';
import { mkdir,writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root=fileURLToPath(new URL('../../',import.meta.url));
const context=spawnSync('docker',['context','inspect','--format','{{.Endpoints.docker.Host}}'],{cwd:root,encoding:'utf8'});
if(context.status!==0||! /^(npipe:|unix:)/.test(context.stdout.trim()))throw new Error('La verificación requiere Docker local, no un contexto remoto');
const output=join(root,'docs/evidencias/equipo-a');await mkdir(output,{recursive:true});
const tests=[['unit',['npm','test'],false],['a-sprint1',['node','dev/run-tests.mjs','a-sprint1'],false],['a-sprint2',['node','dev/run-tests.mjs','a-sprint2'],false],['a-ops',['node','dev/run-tests.mjs','a-ops'],true],['smoke-base',['node','dev/run-tests.mjs','smoke'],false],['smoke-ops',['node','dev/run-tests.mjs','smoke'],true],['contract',['node','dev/run-tests.mjs','contract'],false]];
const results=[];
for(const [name,cmd,ops] of tests){
  const args=['compose','-f','compose.yaml',...(ops?['-f','compose.ops.yaml']:[]),'--profile','test','run','--rm','test',...cmd];
  const startedAt=new Date().toISOString();
  const result=spawnSync('docker',args,{cwd:root,encoding:'utf8',timeout:180000,maxBuffer:8000000});
  const text=(result.stdout||'')+'\n'+(result.stderr||'');
  await writeFile(join(output,name+'.txt'),text);
  const counts=Object.fromEntries(['tests','pass','fail','skipped'].map(k=>[k,Number(text.match(new RegExp('# '+k+' (\\d+)'))?.[1]??NaN)]));
  results.push({name,command:'docker '+args.join(' '),startedAt,endedAt:new Date().toISOString(),exitCode:result.status,...counts});
  console.log(name,JSON.stringify(results.at(-1)));
}
await writeFile(join(output,'resultados.json'),JSON.stringify({environment:'Docker local; demo-aprueba-tests',results},null,2)+'\n');
if(results.some(r=>r.name!=='contract'&&(r.exitCode!==0||r.fail!==0)))process.exitCode=1;
// La suite contractual completa conserva los defectos de B/C visibles, aunque A pase.
