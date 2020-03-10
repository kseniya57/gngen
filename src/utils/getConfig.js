import fs from "./fs";
import {FileManager} from "../managers";

export default async (fileName = 'gngen.config') => {
    try {
        const text = await fs.readFile(FileManager.makePath(`${fileName}.json`), 'utf8');
        return JSON.parse(text.replace(/\/\/.*?\n/g, ''));
    } catch (e) {
        console.error('gngen.config.json not found or it is invalid. 🙁');
        process.exit(1);
    }
};