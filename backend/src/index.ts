import 'dotenv/config'
import { app } from './server.js'

async function main() {
    try {
        await app.listen({ port: 3000 });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

main()