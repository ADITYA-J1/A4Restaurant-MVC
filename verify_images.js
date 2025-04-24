const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Empty password as per your MySQL setup
    database: 'a4restaurant'
};

// Expected menu items structure
const expectedMenuItems = {
    'north-indian': ['butter-chicken.jpeg', 'dal-makhani.jpeg', 'paneer-tikka.jpeg'],
    'south-indian': ['masala-dosa.jpeg', 'idli-sambar.jpeg', 'biryani.jpeg'],
    'italian': ['margherita.jpeg', 'carbonara.jpeg', 'tiramisu.jpeg'],
    'mexican': ['tacos.jpeg', 'quesadilla.jpeg', 'guacamole.jpeg'],
    'continental': ['burger.jpeg', 'caesar-salad.jpeg', 'salmon.jpeg']
};

async function verifyFiles() {
    console.log('Verifying image files...');
    const basePath = path.join(__dirname, 'frontend', 'public', 'images', 'menu');
    let allFilesCorrect = true;

    for (const [category, files] of Object.entries(expectedMenuItems)) {
        const categoryPath = path.join(basePath, category);
        console.log(`\nChecking ${category} directory:`);

        // Check if directory exists
        if (!fs.existsSync(categoryPath)) {
            console.error(`❌ Directory not found: ${categoryPath}`);
            allFilesCorrect = false;
            continue;
        }

        // Check each file
        for (const file of files) {
            const filePath = path.join(categoryPath, file);
            if (fs.existsSync(filePath)) {
                console.log(`✅ Found: ${file}`);
            } else {
                console.error(`❌ Missing: ${file}`);
                allFilesCorrect = false;
            }
        }
    }

    return allFilesCorrect;
}

async function verifyDatabase() {
    console.log('\nVerifying database paths...');
    const connection = await mysql.createConnection(dbConfig);
    let allPathsCorrect = true;

    try {
        const [rows] = await connection.execute(
            'SELECT name, category, image_url FROM menu_items'
        );

        for (const row of rows) {
            const expectedPath = `/images/menu/${row.category.toLowerCase().replace('_', '-')}/${row.image_url.split('/').pop()}`;
            
            if (row.image_url === expectedPath) {
                console.log(`✅ Path correct for ${row.name}: ${row.image_url}`);
            } else {
                console.error(`❌ Path mismatch for ${row.name}:`);
                console.error(`  Expected: ${expectedPath}`);
                console.error(`  Found:    ${row.image_url}`);
                allPathsCorrect = false;
            }
        }
    } catch (error) {
        console.error('Database error:', error);
        allPathsCorrect = false;
    } finally {
        await connection.end();
    }

    return allPathsCorrect;
}

async function main() {
    console.log('Starting verification...\n');
    
    const filesCorrect = await verifyFiles();
    const dbCorrect = await verifyDatabase();

    console.log('\nVerification Summary:');
    console.log(`Files: ${filesCorrect ? '✅ All correct' : '❌ Issues found'}`);
    console.log(`Database: ${dbCorrect ? '✅ All correct' : '❌ Issues found'}`);

    if (filesCorrect && dbCorrect) {
        console.log('\n✅ All verifications passed successfully!');
    } else {
        console.log('\n❌ Some verifications failed. Please check the errors above.');
    }
}

main().catch(console.error); 