import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['web/index.ts', 'web/manager/index.ts'],
  outdir: 'public',
  outbase: 'web',
  bundle: true,
  format: 'esm',
  target: 'es2023',
  sourcemap: true,
})
