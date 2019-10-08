import ProjectsController from '../../../src/routes/impl/Projects';
import { Access } from '../../../src/access/dao';
import { mockReq, mockRes } from 'sinon-express-mock';
import sinon, { assert } from 'sinon';

const repository = sinon.createStubInstance(Access.Repository); 
const controller = new ProjectsController(repository);

describe('The projects controller', () => {
    const expected = {};

    beforeAll(() => {
        repository.getProjectDetails.returns(expected as any);
    })

    test('returns a 200 for a get request', async () => {
        const req = mockReq({
            advisor_id: 'foo',
            accepting_applications: true
        });
        const res = mockRes();

        await controller.getProjects(req, res);

        assert.calledOnce(res.status);
        assert.calledWith(res.status.firstCall, 200);
    })

    test('returns a 200 for a specific get request', async () => {
        const req = mockReq();
        const res = mockRes();

        await controller.getProjectById(req, res);

        assert.calledOnce(res.json)
        assert.calledWith(res.json.firstCall, expected);
    })
})