import AJV from 'ajv';

const project = require('../../src/schemas/project');
const comment = require('../../src/schemas/comment');
const descriptionAttributes = require('../../src/schemas/descriptionAttributes');
const sponsor = require('../../src/schemas/sponsor');
const user = require('../../src/schemas/user');

const ajv = new AJV();

    ajv.addSchema(project, 'project')
    ajv.addSchema([
        comment,
        descriptionAttributes,
        sponsor,
        user
    ])

test('A project without a name is not valid', () => {
    const instance = {}
    expect(ajv.validate('project', instance)).toBe(false);
});

test('A project with a name is valid', () => {
    const instance = { name: 'test' }
    expect(ajv.validate('project', instance)).toBe(true);
});