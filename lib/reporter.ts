import {DiffResultDifference} from './differ';
import {WrappedLog} from './wrapped-log';

export class Reporter {
    public constructor(private readonly wrappedLog: WrappedLog) {}

    public reportError(error: Error): void {
        this.wrappedLog.error(error);
    }

    public reportNoDifferencesFound(): void {
        this.wrappedLog.info('No differences found');
    }

    public reportSuccessWithDifferences(differences: DiffResultDifference[]): void {
        const output = `Differences found between the two schemas:\n${JSON.stringify(differences, null, 4)}`;
        this.wrappedLog.info(output);
    }

    public reportFailureWithDifferences(differences: DiffResultDifference[]): void {
        const output = `Breaking changes found between the two schemas:\n${JSON.stringify(differences, null, 4)}`;
        this.wrappedLog.error(output);
    }
}
