import ProjectsController from '../../../src/routes/impl/Projects';
import { Access } from '../../../src/routes/helpers/dynamoAccessor';
import { mockReq, mockRes } from 'sinon-express-mock';
import HitTracker from '../../../src/routes/helpers/hitTracker';
import sinon, { assert } from 'sinon';

const dynamoAccessor = sinon.createStubInstance(Access.DynamoAccessor); 
const hitTracker = sinon.createStubInstance(HitTracker);
const controller = new ProjectsController(dynamoAccessor as any, hitTracker as any);

describe('The projects controller', () => {
    const expected = { Item: 'test' };

    beforeAll(() => {
        dynamoAccessor.getProjectById.returns(expected as any);
    })

    test('returns a 200 for a get request', async () => {
        const req = mockReq();
        const res = mockRes();

        await controller.getProjects(req, res);

        assert.calledOnce(res.sendStatus);
        assert.calledWith(res.sendStatus.firstCall, 200);
    })

    test('returns a 200 for a specific get request', async () => {
        const req = mockReq();
        const res = mockRes();

        await controller.getProjectById(req, res);

        assert.calledOnce(res.json)
        assert.calledWith(res.json.firstCall, expected);
    })
})