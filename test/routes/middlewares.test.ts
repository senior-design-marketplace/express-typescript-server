import assert from "assert";
import sinon, { SinonStub } from "sinon";
import { mockReq, mockRes } from "sinon-express-mock";
import { HandleErrors, Verified } from "../../src/controllers/middlewares";
import { AuthenticationError, BadRequestError, InternalError } from "../../src/error/error";

describe("The request validation middleware", () => {
	test("throws an error for unknown schemas", () => {
		expect(Verified("foo")).toThrow();
	});

	test("passes a BadRequestError for invalid requests", () => {
		//fragile test, be careful modifying built schemas
		const validator = Verified("ProjectImmutable");

		const params = {
			body: {} // invalid for schema
		};

		const req: any = mockReq(params);
		const res: any = mockRes();
		const next: SinonStub = sinon.stub();

		validator(req, res, next);

		assert(next.calledOnceWith(sinon.match.instanceOf(BadRequestError)));
	});
});

describe("The error handling middleware", () => {
	test("passes on errors that are not checked for", () => {
		const handler = HandleErrors([InternalError]);

		const req: any = mockReq();
		const res: any = mockRes();
		const next: SinonStub = sinon.stub();

		handler(new AuthenticationError("test"), req, res, next);

		assert(next.calledOnceWith(sinon.match.instanceOf(Error)));
	});

	test("handles errors which are checked for", () => {
		const handler = HandleErrors([InternalError]);

		const req: any = mockReq();
		const res: any = mockRes();
		const next: SinonStub = sinon.stub();

		const error = new InternalError("test");
		handler(error, req, res, next);

		assert(res.status.calledOnceWith(error.code));
		assert(
			res.json.calledOnceWith({
				type: error.name,
				message: error.message
			})
		);
	});
});
