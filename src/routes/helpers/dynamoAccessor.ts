import { DocumentClient, QueryOutput } from "aws-sdk/clients/dynamodb";
import { PromiseResult } from "aws-sdk/lib/request";
import { AWSError } from "aws-sdk";

//a helper class to assist with pulling information from dynamo
//abstracts away table names and error throwing on failed
//dynamo calls for various reasons -- not found, internal error, etc.

//we'll also likely need some sort of query builder class
//to help with some of the more complex filtering going on on
//the call to get /projects
export namespace Access {

    namespace Constants {

        export const TABLE_NAME = 'marqetplace';

        export enum Column {
            PROJECT_ID = 'project_id',
            ASPECT = 'aspect'
        }

        export enum Aspect {
            HEAD = 'head',
            REQUESTED_MAJORS = 'head:requested_majors',
            TAGS = 'head:tags'
        }

        export enum Index {
            ADVISOR_ID = 'advisor_id_index',
            REQUESTED_MAJOR = 'requested_major_index',
            ASPECT = 'aspect_index'
        }
    }

    namespace Query {

        export interface Parameters {
            advisor_id?: string,
            requested_major?: string,
            tag?: string,
            accepting_applications?: true,
            order?: 'reverse',
            reverse?: true
        }

        export class Builder {

            constructor(private readonly builder: Expression.Builder) {

            }
        }

        namespace Expression {

            /**
             * Superclass for all expressions
             * @param: str  readable form of the expression
             */
            abstract class Expression {}

            /**
             * Expressions which only operator on one operand
             */
            export class UnaryExpression extends Expression {

                static readonly ALLOWED_OPERATORS = [
                    'NOT'
                ]

                constructor(private readonly _symbol: string, private readonly _arg: string | number) {
                    super();
                }

                get symbol(): string {
                    return this._symbol;
                }

                get arg(): string  | number {
                    return this._arg;
                }
            }

            /**
             * Expressions which operate on two operands
             */
            export class BinaryExpression extends Expression {

                static readonly ALLOWED_OPERATORS = [
                    '=',
                    '<>',
                    '<',
                    '<=',
                    '>',
                    '>=',
                    'AND',
                    'OR'
                ]

                constructor(private readonly _symbol: string, private readonly _arg: string | number) {
                    super();

                    if (!(_symbol in BinaryExpression.ALLOWED_OPERATORS)) {
                        throw new Error(`Symbol ${_symbol} is not listed as a binary operator`);
                    }
                }

                get symbol(): string {
                    return this._symbol;
                }

                get arg(): string  | number {
                    return this._arg;
                }
            }

            export class FunctionExpression extends Expression {

                static readonly ALLOWED_OPERATORS = [
                    'begins_with'
                ]

                private readonly _args: string[]

                constructor(private readonly _symbol, ..._args: string[]) {
                    super();

                    this._args = _args;

                    if (!(_symbol in FunctionExpression.ALLOWED_OPERATORS)) {
                        throw new Error(`Function name ${_symbol} is not listed as an allowed name`);
                    }
                }

                get symbol(): string {
                    return this._symbol;
                }

                get args(): string[] {
                    return this._args;
                }
            }

            namespace ExpressionTree {
                 
                export class Node {
                    constructor(private readonly symbol: string | number,
                                private readonly connections?: Node[]) {}
                }

                export class Tree {

                    //FIX: https://github.com/Microsoft/TypeScript/issues/30183
                    private head: Node | null = null;
    
                    public add(expression: UnaryExpression): void;
                    public add(expression: BinaryExpression): void;
                    public add(expression: FunctionExpression): void;
    
                    //apparently this is static polymorphism in TypeScript?
                    public add(expression: UnaryExpression | BinaryExpression | FunctionExpression) {
                        if(expression instanceof UnaryExpression) {
                            if (!this.head) {
                                this.head = new ExpressionTree.Node(expression.symbol);
                            } else {
                                this.head = new ExpressionTree.Node(expression.symbol, [ this.head ]);
                            }
    
                        } else if (expression instanceof BinaryExpression) {
                            if (!this.head) {
                                this.head = new ExpressionTree.Node(expression.symbol, [ new ExpressionTree.Node(expression.arg) ]);
                            } else {
                                this.head = new ExpressionTree.Node(expression.symbol, [ this.head, new ExpressionTree.Node(expression.arg) ]);
                            }
    
                        } else if (expression instanceof FunctionExpression) {
                            if (!this.head) {
                                this.head = new ExpressionTree.Node(expression.symbol, expression.args.map(arg => new ExpressionTree.Node(arg)));
                            } else {
                                this.head = new ExpressionTree.Node(expression.symbol, [ this.head ].concat(expression.args.map(arg => new ExpressionTree.Node(arg))))
                            }
                        }
                    }
    
                    public toString(): string {
                        //TODO:
                        return '';
                    }
                }
            }

            

            //just want a quick and dirty way to build simple expressions,
            //note that combinations of 'and' and 'or' are not yet supported

            //TODO: desired syntax -- query.start('eggs').equals(12);
            export class Builder {

                private tree: ExpressionTree.Tree = new ExpressionTree.Tree();

                constructor() {}
                //TODO: split this guy up, the interface segregation is off

                //begin a query expression

                // ===== comparators =====
                public equals(name: string | number, literal?: boolean): Builder {
                    if(literal) {

                    }
                    return this;
                }

                public lessThan(name: string | number, literal?: boolean): Builder {
                    return this;
                }

                public lessThanEqualTo(name: string | number, literal?: boolean): Builder {
                    return this;
                }

                public greaterThan(name: string | number, literal?: boolean): Builder {
                    return this;
                }

                public greaterThanEqualTo(name: string | number, literal?: boolean): Builder {
                    return this;
                }

                // ===== functions =====
                // TODO: add more functions:
                // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html
                public beginsWith(name: string, str: string): Builder {
                    return this;
                }

                // ===== conditions =====
                public and(name: string): Builder {
                    return this;
                }

                public or(name: string): Builder {
                    return this;
                }

                public not(name: string): Builder {
                    return this;
                }
            }
        }
    }

    export class DynamoAccessor {

        constructor(private readonly client: DocumentClient,
                    private readonly builder: Query.Builder) {}
    
        //run a query against the head for that project
        public getProjectById(id: string): Promise<PromiseResult<QueryOutput, AWSError>> {
            return this.client.query({
                TableName: Constants.TABLE_NAME,
                KeyConditionExpression: `${Constants.Column.PROJECT_ID} = :id and ${Constants.Column.ASPECT} = :aspect`,
                ExpressionAttributeValues: {
                    ':id': id,
                    ':aspect': Constants.Aspect.HEAD
                }
            }).promise();
        }
        //TODO: handle idempotency as a middleware

        //TODO: Hard mode
        public getProjects(params?: Query.Parameters) {

        }

        //start with these first
        public deleteProject(id: string) {

        }

        //do this last, it may be tough
        public updateProject(params: object) {

        }

        //start with these first
        public putProject(project: object) {

        }
    }
}