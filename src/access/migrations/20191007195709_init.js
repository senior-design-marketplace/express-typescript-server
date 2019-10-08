//TODO: import all of our column names into here from constants
const constants = require('../constants.json');

exports.up = async function(knex) {
    return knex.schema
        .createTable('projects', table => {
            table.uuid('id').primary();

            //required
            table.string('title', constants.SMALL).notNullable();
            table.string('tagline', constants.MEDIUM).notNullable();
            table.boolean('accepting_applications').notNullable().defaultTo(false);
            table.dateTime('created_at').notNullable().defaultTo(knex.fn.now())

            //not-required
            table.string('thumbnail_link', constants.MEDIUM);
        })
        .createTable('boardItems', table => {
            table.uuid('id').primary();

            //required
            table.json('document').notNullable();
            table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());

            //references
            table.uuid('projectId').notNullable().references('id').inTable('projects');
        })
        .createTable('majorsValues', table => {
            table.string('value', constants.SMALL).primary();
        })
        .createTable('majors', table => {
            table.uuid('projectId').references('id').inTable('projects');
            table.string('major', constants.SMALL).references('value').inTable('majorsValues');

            //composite primary key
            table.primary(['projectId', 'major']);
        })
        .createTable('tagsValues', table => {
            table.string('value', constants.SMALL).primary();
        })
        .createTable('tags', table => {
            table.uuid('projectId').references('id').inTable('projects');
            table.string('tag', constants.SMALL).references('value').inTable('tagsValues');

            //composite primary key
            table.primary(['projectId', 'tag']);
        })
        .createTable('users', table => {
            table.uuid('id').primary();

            //required
            table.string('firstName', constants.SMALL).notNullable();
            table.string('lastName', constants.SMALL).notNullable();
            table.string('email', constants.SMALL).notNullable();

            //not-required
            table.string('bio', constants.MEDIUM);
            table.string('thumbnailLink', constants.MEDIUM);
        })
        .createTable('stars', table => {
            table.uuid('projectId').references('id').inTable('projects');
            table.uuid('userId').references('id').inTable('users');

            //composite primary key
            table.primary(['projectId', 'userId']);
        })
        .createTable('contributors', table => {
            table.uuid('projectId').references('id').inTable('projects');
            table.uuid('userId').references('id').inTable('users');

            table.primary(['projectId', 'userId']);
        })
        .createTable('administrators', table => {
            table.uuid('projectId').references('id').inTable('projects');
            table.uuid('userId').references('id').inTable('users');

            table.primary(['projectId', 'userId']);
        })
        .createTable('advisors', table => {
            table.uuid('projectId').references('id').inTable('projects');
            table.uuid('userId').references('id').inTable('users');

            table.primary(['projectId', 'userId']);
        })
        .createTable('statuses', table => {
            table.string('value', constants.SMALL).primary();
        })
        .createTable('requests', table => {
            table.uuid('id').primary();

            table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());

            //references
            table.uuid('advisorId').notNullable().references('id').inTable('users');
            table.uuid('requestedById').notNullable().references('id').inTable('users');
            table.string('status', constants.SMALL).notNullable().references('value').inTable('statuses');
        })
        .createTable('applications', table => {
            table.uuid('id').primary();

            table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());

            table.uuid('projectId').notNullable().references('id').inTable('projects');
            table.uuid('userId').notNullable().references('id').inTable('users');
            table.string('status', constants.SMALL).notNullable().references('value').inTable('statuses');
        });
}

//drop in the reverse order that they were created, otherwise
//table dependencies will crash the script
exports.down = async function(knex) {
    return knex.schema
        .dropTableIfExists('applications')
        .dropTableIfExists('requests')
        .dropTableIfExists('statuses')
        .dropTableIfExists('advisors')
        .dropTableIfExists('administrators')
        .dropTableIfExists('contributors')
        .dropTableIfExists('stars')
        .dropTableIfExists('users')
        .dropTableIfExists('tags')
        .dropTableIfExists('tagsValues')
        .dropTableIfExists('majors')
        .dropTableIfExists('majorsValues')
        .dropTableIfExists('boardItems')
        .dropTableIfExists('projects');
}