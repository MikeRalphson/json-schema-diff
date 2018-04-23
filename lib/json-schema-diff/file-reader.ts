import {VError} from 'verror';
import {FileSystem} from './file-reader/file-system';

export class FileReader {
    public constructor(private readonly fileSystem: FileSystem) {}

    public async read(filePath: string): Promise<any> {
        try {
            const file = await this.fileSystem.readFile(filePath);
            return JSON.parse(file);
        } catch (error) {
            throw new VError(error, '%s', `Error loading "${filePath}"`);
        }
    }
}
