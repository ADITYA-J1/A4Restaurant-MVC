const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'frontend', 'public', 'images', 'menu');

function fixExtensions(directory) {
    const dirPath = path.join(basePath, directory);
    if (!fs.existsSync(dirPath)) {
        console.error(`Directory not found: ${dirPath}`);
        return;
    }

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        if (file.endsWith('.jpeg.jpeg')) {
            const oldPath = path.join(dirPath, file);
            const newPath = path.join(dirPath, file.replace('.jpeg.jpeg', '.jpeg'));
            fs.renameSync(oldPath, newPath);
            console.log(`Fixed extension: ${file} → ${file.replace('.jpeg.jpeg', '.jpeg')}`);
        }
    });
}

function main() {
    console.log('Starting extension fixes...\n');
    
    const directories = ['north-indian', 'south-indian', 'italian', 'mexican', 'continental'];
    directories.forEach(dir => {
        console.log(`\nProcessing ${dir} directory:`);
        fixExtensions(dir);
    });
    
    console.log('\nAll fixes completed!');
}

main(); 