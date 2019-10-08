import { Access } from '../../src/access/dao';
import { QueryParams } from '../../src/schemas/build/queryParams';

const repository = new Access.Repository();

describe('The access layer', () => {
    test('dynamically forms a query off of query parameters', async () => {
        const params: QueryParams = {
            advisor_id: 'b086c492-434e-419b-80f8-1a8b1539a976',
            accepting_applications: true,
            tag: 'Artificial Intelligence'
        }

        const response = await repository.getProjectStubs(params);
        console.log(response);
    })
})