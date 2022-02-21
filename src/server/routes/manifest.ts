import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export type JsManifest = {
    [key: string]: string;
};

let manifestCache: JsManifest | undefined;

export function getManifest(): JsManifest {
    if (!manifestCache || process.env['IS_DEV']) {
        // read from file system
        const manifestFile = fs.readFileSync(
            path.join(process.cwd(), 'dist', 'statics', 'manifest.json'),
            'utf-8'
        );
        manifestCache = JSON.parse(manifestFile);
    }

    return manifestCache;
}
