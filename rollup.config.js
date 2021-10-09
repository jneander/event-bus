import typescript from '@rollup/plugin-typescript'

/** @type {import('rollup').RollupOptions} */
export default {
  external: ['qs', 'url-pattern'],
  input: 'src/index.ts',

  output: [
    {
      dir: 'dist/cjs',
      esModule: false,
      format: 'cjs',
      preserveModules: true,
      sourcemap: true,
    },

    {
      dir: 'dist/esm',
      esModule: true,
      format: 'esm',
      preserveModules: true,
      sourcemap: true,
    },
  ],

  plugins: [typescript({declaration: false, declarationDir: null, sourceMap: true})],
}
