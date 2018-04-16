import {Differ} from './differ';
import {FileReader} from './file-reader';
import {FileSystem} from './file-reader/file-system';
import {JsonSchemaDiff} from './json-schema-diff';
import {Reporter} from './reporter';
import {WrappedLog} from './wrapped-log';

export class JsonSchemaDiffFactory {
    public static create(): JsonSchemaDiff {
        const fileSystem = new FileSystem();
        const fileReader = new FileReader(fileSystem);
        const differ = new Differ();
        const wrappedLog = new WrappedLog();
        const reporter = new Reporter(wrappedLog);
        return new JsonSchemaDiff(fileReader, differ, reporter);
    }
}
