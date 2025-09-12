import xml2js from 'xml2js';

export async function parseJmeterResults(data: string) {
    const result = await xml2js.parseStringPromise(data);
    const samples = result.testResults.httpSample || [];

    if (samples.length === 0) {
        console.log('There are no results.');
        process.exit(0);
    }

    return samples;
}