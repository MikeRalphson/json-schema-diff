import * as assert from 'assert';
import {FileReader} from '../../../../lib/file-reader';

interface MockFileReaderHelpers {
    givenReadReturnsFiles(files: {[fileName: string]: Promise<any>}): void;
    givenReadReturns(reponse: Promise<any>): void;
}

export type MockFileReader = jasmine.SpyObj<FileReader> & MockFileReaderHelpers;

export const createMockFileReader = (): MockFileReader => {
    const mockFileReader: MockFileReader = jasmine.createSpyObj('fileReader', ['read']);

    mockFileReader.givenReadReturnsFiles = (files) => {
        mockFileReader.read.and.callFake((filePath: string): Promise<any> => {
            const file = files[filePath];
            assert.ok(file !== undefined, `Unexpected call to fileReader.read with "${filePath}"`);
            return file;
        });
    };

    mockFileReader.givenReadReturns = (response) => {
        mockFileReader.read.and.returnValue(response);
    };

    return mockFileReader;
};
