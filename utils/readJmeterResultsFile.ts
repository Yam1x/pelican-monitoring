import fs from 'fs';

export function readJmeterResultFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.error(`File was not found: ${filePath}`);
        process.exit(1);
    }

    const data: string = fs.readFileSync(filePath, 'utf8');

    if (data.trim() === '') {
        console.error(`File is empty: ${filePath}`);
        process.exit(1);
    }

    return data;
}