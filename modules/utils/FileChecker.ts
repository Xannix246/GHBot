import fs from 'fs';


//directory example: test/
//file example: file.ts

const FileChecker = (directory: string, file: string) => {
    let check: boolean = false;

    if (fs.existsSync(`./${directory}${file}`)) {
        check = true;
    }

    return check;
}

export default FileChecker;