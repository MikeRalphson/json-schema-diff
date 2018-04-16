import {Differ, DiffResult} from '../../../../lib/differ';

interface MockDifferHelpers {
    givenDiffReturnsResult(result: DiffResult): void;
    givenDiffReturnsNoDifferencesFoundResult(): void;
    givenDiffReturnsError(error: Error): void;
}

export type MockDiffer = jasmine.SpyObj<Differ> & MockDifferHelpers;

export const createMockDiffer = (): MockDiffer => {
    const mockDiffer: MockDiffer = jasmine.createSpyObj('differ', ['diff']);

    mockDiffer.givenDiffReturnsResult = (result) => {
        mockDiffer.diff.and.returnValue(Promise.resolve(result));
    };

    mockDiffer.givenDiffReturnsError = (error) => {
        mockDiffer.diff.and.returnValue(Promise.reject(error));
    };

    mockDiffer.givenDiffReturnsNoDifferencesFoundResult = () => {
        mockDiffer.givenDiffReturnsResult({
            addedByDestinationSpec: false,
            differences: [],
            removedByDestinationSpec: false
        });
    };

    mockDiffer.givenDiffReturnsNoDifferencesFoundResult();

    return mockDiffer;
};
