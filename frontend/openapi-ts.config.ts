import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
    input: 'http://localhost:8000/api/v1/openapi.json',
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
