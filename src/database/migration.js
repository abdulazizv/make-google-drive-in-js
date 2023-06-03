const fs = require('fs');
const path = require('path');
const { fetch } = require('./connection');

async function runMigrations() {
    const migrationFolder = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationFolder);
    files.sort();

    for (const file of files) {
        const filePath = path.join(migrationFolder, file);
        const migrationSQL = fs.readFileSync(filePath, 'utf8');
        const queries = migrationSQL.split(';').filter((query) => query.trim() !== '');

        for (const query of queries) {
            try {
                await fetch(query);
                console.log(`Migration ${file} executed successfully.`);
            } catch (error) {
                console.error(`Error executing migration ${file}:`, error);
            }
        }
    }

    console.log('All migrations executed.');
}

runMigrations();
