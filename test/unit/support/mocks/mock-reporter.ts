import {Reporter} from '../../../../lib/reporter';

export type MockReporter = jasmine.SpyObj<Reporter>;

export const createMockReporter = (): MockReporter => {
    const mockReporter: MockReporter = jasmine.createSpyObj('reporter', [
        'reportError', 'reportNoDifferencesFound', 'reportSuccessWithDifferences', 'reportFailureWithDifferences'
    ]);

    return mockReporter;
};
