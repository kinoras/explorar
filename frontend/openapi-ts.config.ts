import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
    input: 'http://localhost:8000/api/v1/openapi.json',
    output: {
        postProcess: ['prettier'],
        path: './integrations/client'
    },
    plugins: [
        {
            name: '@hey-api/client-next',
            runtimeConfigPath: './integrations/hey-api' // Relative to the frontend directory
        }
    ]
})
