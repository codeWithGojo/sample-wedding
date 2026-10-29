// Accept the preview service's host flags while preserving normal Next.js CLI options.
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
const args=process.argv.slice(2);
const nextArgs=[];
for(let index=0;index<args.length;index++){
  if(args[index]==='--host'){nextArgs.push('--hostname',args[++index]||'0.0.0.0');}
  else if(args[index]==='--strictPort')continue;
  else nextArgs.push(args[index]);
}
// The hosted QA service can preview the exact production build when one is ready.
const builtPreview=args.includes('--strictPort')&&existsSync(new URL('../.next/BUILD_ID',import.meta.url));
if(builtPreview)process.env.NODE_ENV='production';
process.argv=[process.argv[0],'next',builtPreview?'start':'dev',...nextArgs];
createRequire(import.meta.url)('next/dist/bin/next');
