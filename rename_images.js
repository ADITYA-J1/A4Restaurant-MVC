const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'frontend', 'public', 'images', 'menu');

// Function to rename files in a directory
function renameFilesInDirectory(directory) {
    const dirPath = path.join(basePath, directory);
    if (!fs.existsSync(dirPath)) {
        console.error(`Directory not found: ${dirPath}`);
        return;
    }

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        if (file.endsWith('.jpg')) {
            const oldPath = path.join(dirPath, file);
            const newPath = path.join(dirPath, file.replace('.jpg', '.jpeg'));
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed: ${file} → ${file.replace('.jpg', '.jpeg')}`);
        }
    });
}

// Function to fix case sensitivity
function fixCaseSensitivity() {
    const italianPath = path.join(basePath, 'italian');
    if (fs.existsSync(italianPath)) {
        const files = fs.readdirSync(italianPath);
        files.forEach(file => {
            if (file === 'Tiramisu.jpeg') {
                const oldPath = path.join(italianPath, file);
                const newPath = path.join(italianPath, 'tiramisu.jpeg');
                fs.renameSync(oldPath, newPath);
                console.log(`Fixed case: ${file} → tiramisu.jpeg`);
            }
        });
    }
}

// Function to move misplaced files
function moveMisplacedFiles() {
    const northIndianPath = path.join(basePath, 'north-indian');
    const continentalPath = path.join(basePath, 'continental');
    
    const filesToMove = ['salmon.jpeg', 'caesar-salad.jpeg', 'burger.jpeg'];
    
    filesToMove.forEach(file => {
        const sourcePath = path.join(northIndianPath, file);
        const destPath = path.join(continentalPath, file);
        
        if (fs.existsSync(sourcePath)) {
            fs.renameSync(sourcePath, destPath);
            console.log(`Moved: ${file} from north-indian to continental`);
        }
    });
}

// Main function
function main() {
    console.log('Starting file operations...\n');
    
    // Rename files in all directories
    const directories = ['north-indian', 'south-indian', 'italian', 'mexican', 'continental'];
    directories.forEach(dir => {
        console.log(`\nProcessing ${dir} directory:`);
        renameFilesInDirectory(dir);
    });
    
    // Fix case sensitivity
    console.log('\nFixing case sensitivity:');
    fixCaseSensitivity();
    
    // Move misplaced files
    console.log('\nMoving misplaced files:');
    moveMisplacedFiles();
    
    console.log('\nAll operations completed!');
}

main(); 