import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
    input: 'http://localhost:5019/swagger/v1/swagger.json',
    output: {
        format: 'prettier',
        lint: 'eslint',
        path: './integrations/client'
    },
    plugins: [
        {
            name: '@hey-api/client-next',
            runtimeConfigPath: '../hey-api.ts' // Relative to `integrations/client/client.gen.ts`
        }
    ]
})
