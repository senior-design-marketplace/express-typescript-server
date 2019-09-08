import { RequiresAuth, Verified, HandleErrors } from '../../src/routes/middlewares';
import { mockReq, mockRes } from 'sinon-express-mock';
import { Request, Response } from 'express';
import sinon, { SinonStub } from 'sinon';
import assert from 'assert';
import { BadRequestError, InternalError, AuthenticationError } from '../../src/error/error';

describe('The authentication middleware', () => {
    test('passes valid credentials to the cognitoIdentityId header', () => {
        //stubs
        global.decodeURIComponent = sinon.stub().withArgs('test').returns('test');
        JSON.parse = sinon.stub().withArgs('test').returns({
            requestContext: {
                identity: {
                    cognitoIdentityId: 'test'
                }
            }
        });
        
        const params: Request = {
            headers: {
                'x-apigateway-event': 'test'
            }
        } as any

        const req: Request = mockReq(params);
        const res: Response = mockRes();
        const next: SinonStub = sinon.stub();

        RequiresAuth(req, res, next);

        expect(req.headers.cognitoIdentityId).toBe('test');
    })

    test('returns a 403 for lacking credentials', () => {
        //stubs
        global.decodeURIComponent = sinon.stub().withArgs('test').returns('test');
        JSON.parse = sinon.stub().withArgs('test').returns({
            requestContext: {
                identity: {
                    cognitoIdentityId: null
                }
            }
        })

        const params: Request = {
            headers: {
                'x-apigateway-event': 'test'
            }
        } as any

        const req: any = mockReq(params);
        const res: any = mockRes();
        const next: SinonStub = sinon.stub();

        RequiresAuth(req, res, next);

        assert(next.calledOnceWith(sinon.match.instanceOf(AuthenticationError)));
    })

    test('returns a 403 for invalid events', () => {
        const params: Request = {
            headers: {
                'x-api-gateway-event': 'foo'
            }
        } as any

        const req: any = mockReq(params);
        const res: any = mockRes();
        const next: SinonStub = sinon.stub();

        RequiresAuth(req, res, next);

        assert(next.calledOnceWith(sinon.match.instanceOf(AuthenticationError)));
    })
})

describe('The request validation middleware', () => {
    test('throws an error for unknown schemas', () => {
        expect(Verified('foo')).toThrow();
    })

    test('passes a BadRequestError for invalid requests', () => {
        //fragile test, be careful modifying built schemas
        const validator = Verified('project');

        const params: Request = {
            body: {} //invalid for schema
        } as any

        const req: any = mockReq(params);
        const res: any = mockRes();
        const next: SinonStub = sinon.stub();

        validator(req, res, next);

        assert(next.calledOnceWith(sinon.match.instanceOf(BadRequestError)));  
    })
})

describe('The error handling middleware', () => {
    
    test('passes on errors that are not checked for', () => {
        const handler = HandleErrors([InternalError]);

        const req: any = mockReq();
        const res: any = mockRes();
        const next: SinonStub = sinon.stub();

        handler(new AuthenticationError('test'), req, res, next);

        assert(next.calledOnceWith(sinon.match.instanceOf(Error)));
    })

    test('handles errors which are checked for', () => {
        const handler = HandleErrors([InternalError]);

        const req: any = mockReq();
        const res: any = mockRes();
        const next: SinonStub = sinon.stub();

        const error = new InternalError('test');
        handler(error, req, res, next);

        assert(res.status.calledOnceWith(error.code));
        assert(res.json.calledOnceWith({
            type: error.name,
            message: error.message
        }))
    })
})