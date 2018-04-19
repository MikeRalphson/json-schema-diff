import {FileSystem} from '../../../../lib/json-schema-diff/file-reader/file-system';

interface MockFileSystemHelpers {
    givenReadFileReturnsContent(stringContent: string): void;
    givenReadFileReturnsJsonContent(jsonContent: object): void;
    givenReadFileReturnsError(error: Error): void;
}

export type MockFileSystem = jasmine.SpyObj<FileSystem> & MockFileSystemHelpers;

export const createMockFileSystem = (): MockFileSystem => {
    const mockFileSystem: MockFileSystem = jasmine.createSpyObj('mockFileSystem', ['readFile']);

    mockFileSystem.givenReadFileReturnsContent = (stringContent) => {
        mockFileSystem.readFile.and.returnValue(Promise.resolve(stringContent));
    };

    mockFileSystem.givenReadFileReturnsJsonContent = (jsonContent) => {
        const contentAsJsonString = JSON.stringify(jsonContent);
        mockFileSystem.givenReadFileReturnsContent(contentAsJsonString);
    };

    mockFileSystem.givenReadFileReturnsError = (error) => {
        mockFileSystem.readFile.and.returnValue(Promise.reject(error));
    };

    mockFileSystem.givenReadFileReturnsJsonContent({});

    return mockFileSystem;
};
