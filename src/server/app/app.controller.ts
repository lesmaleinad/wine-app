import { Controller, Get, Render, Res } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Response } from 'express';
dotenv.config();

export type JsManifest = {
    [key: string]: string;
};

@Controller()
export class AppController {
    private manifestCache: JsManifest | undefined;

    @Get()
    @Render('index')
    public getMainView() {
        return { jsManifest: this.getManifest() };
    }

    private getManifest(): JsManifest {
        if (!this.manifestCache || process.env['IS_DEV']) {
            // read from file system
            const manifestFile = fs.readFileSync(
                path.join(process.cwd(), 'dist', 'statics', 'manifest.json'),
                'utf-8'
            );
            this.manifestCache = JSON.parse(manifestFile);
        }

        return this.manifestCache;
    }

    @Get('/worker-bundle.js')
    public getWorkerFile(@Res() response: Response) {
        response.sendFile(
            path.join(__dirname, '../../../dist', 'statics', 'worker-bundle.js')
        );
    }

    @Get('/worker-bundle.js.map')
    public getWorkerMapFile(@Res() response: Response) {
        response.sendFile(
            path.join(
                __dirname,
                '../../../dist',
                'statics',
                'worker-bundle.js.map'
            )
        );
    }
}
