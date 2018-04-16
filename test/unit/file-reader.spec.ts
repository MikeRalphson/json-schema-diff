import {FileReader} from '../../lib/file-reader';
import {expectToFail} from '../support/expect-to-fail';
import {createMockFileSystem, MockFileSystem} from './support/mocks/mock-file-system';

describe('file-reader', () => {
    let mockFileSystem: MockFileSystem;

    beforeEach(() => {
        mockFileSystem = createMockFileSystem();
    });

    const invokeRead = (path: string = 'default-file.json'): Promise<any> => {
        return new FileReader(mockFileSystem).read(path);
    };

    it('should read the file from the file system', async () => {
        const expectedFilePath = 'file.json';

        await invokeRead(expectedFilePath);

        expect(mockFileSystem.readFile).toHaveBeenCalledWith(expectedFilePath);
    });

    it('should return the file contents as an object', async () => {
        mockFileSystem.givenReadFileReturnsJsonContent({test: 'file'});

        const result = await invokeRead();

        expect(result).toEqual({test: 'file'});
    });

    it('should return the error when reading from the file system fails', async () => {
        mockFileSystem.givenReadFileReturnsError(new Error('an error'));

        const error = await expectToFail(invokeRead('file.json'));

        expect(error).toEqual(new Error('Error loading "file.json": an error'));
    });

    it('should return the error when the file is not in json format', async () => {
        mockFileSystem.givenReadFileReturnsContent('not json');

        const error = await expectToFail(invokeRead('file.json'));

        expect(error).toEqual(new Error('Error loading "file.json": Unexpected token o in JSON at position 1'));
    });
});
