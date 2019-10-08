import { Access } from '../../src/access/dao';
import { FilterParams, SortParams } from '../../src/schemas/build/queryParams';
import * as config from '../../knexfile';

//setup to test locally
const repository = new Access.Repository(config.test);

describe('The access layer', () => {
    test('dynamically forms a query off of query parameters', async () => {
        const params: FilterParams = {
            advisor_id: 'b086c492-434e-419b-80f8-1a8b1539a976',
            accepting_applications: true,
            tag: 'Artificial Intelligence'
        }

        const sorts: SortParams = {
            sort_by: 'new',
            order: 'reverse'
        }

        const response = await repository.getProjectStubs(params, sorts);
        console.log(response);
    })
})