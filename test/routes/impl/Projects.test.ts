import ProjectsController from '../../../src/routes/impl/Projects';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { mockReq, mockRes } from 'sinon-express-mock';
import HitTracker from '../../../src/routes/helpers/hitTracker';
import sinon, { assert } from 'sinon';

const documentClient = sinon.createStubInstance(DocumentClient); 
const hitTracker = sinon.createStubInstance(HitTracker);
const controller = new ProjectsController(documentClient as any, hitTracker as any);

describe('The projects controller', () => {
    beforeAll(() => {
        documentClient.get.returns({ promise: () => { return Promise.resolve({ Item: 'test' })}} as any);
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
        assert.calledWith(res.json.firstCall, 'test');
    })
})