import * as Knex from "knex";
import * as constants from "../constants.json";

// * you should not use an onDelete('CASCADE') when you want to perform
// * a soft or logical delete.  onUpdate('CASCADE') should be used on
// * keys which might change -- such as a username.
export async function up(knex: Knex): Promise<any> {
    return knex.schema
        .createTable("users", table => {
            table.string("id", constants.SMALL).primary();

            table.string("firstName", constants.SMALL).notNullable();
            table.string("lastName", constants.SMALL).notNullable();
            table.string("email", constants.SMALL).notNullable();

            // just leave it as a string for now
            table.string("roles", constants.MEDIUM).notNullable().defaultTo("");

            table.dateTime("joinedAt")
                .notNullable()
                .defaultTo(knex.fn.now());

            //not-required
            table.string("bio", constants.MEDIUM);
            table.string("thumbnailLink", constants.MEDIUM);
        })
		.createTable("projects", table => {
            
			table.uuid("id").primary();

			//required
			table.string("title", constants.SMALL).notNullable();

            table.string("tagline", constants.MEDIUM).notNullable();
            
			table
				.boolean("acceptingApplications")
				.notNullable()
				.defaultTo(true);

			table
				.dateTime("createdAt")
				.notNullable()
				.defaultTo(knex.fn.now());

            //not-required
            table.string("coverLink", constants.MEDIUM);

            table.string("thumbnailLink", constants.MEDIUM);
            
            table.string("body", constants.LARGE);
		})
		.createTable("boardItems", table => {
            table.uuid("id").primary();

			//required
			table.json("document").notNullable();

			table
				.dateTime("createdAt")
				.notNullable()
				.defaultTo(knex.fn.now());

			table
				.dateTime("updatedAt")
				.notNullable()
				.defaultTo(knex.fn.now());

			//references
			table
				.uuid("projectId")
				.notNullable()
				.references("id")
				.inTable("projects")
                .onDelete("CASCADE");

			table
				.string("userId", constants.SMALL)
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
		})
		.createTable("majorsValues", table => {
			table.string("value", constants.SMALL).primary();
		})
		.createTable("majors", table => {
			table
				.uuid("projectId")
				.references("id")
				.inTable("projects")
				.onDelete("CASCADE");

			table
				.string("major", constants.SMALL)
				.references("value")
				.inTable("majorsValues")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");

			//composite primary key
			table.primary(["projectId", "major"]);
		})
		.createTable("tagsValues", table => {
			table.string("value", constants.SMALL).primary();
		})
		.createTable("tags", table => {
			table
				.uuid("projectId")
				.references("id")
				.inTable("projects")
				.onDelete("CASCADE");

			table
				.string("tag", constants.SMALL)
				.references("value")
				.inTable("tagsValues")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");

			//composite primary key
			table.primary(["projectId", "tag"]);
		})
		.createTable("stars", table => {
			table
				.uuid("projectId")
				.references("id")
				.inTable("projects")
				.onDelete("CASCADE");

			table
				.string("userId", constants.SMALL)
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");

			//composite primary key
			table.primary(["projectId", "userId"]);
        })
        .createTable("rolesValues", table => {
            table.string("value", constants.SMALL).primary();
        })
        .createTable("members", table => {
            table
				.uuid("projectId")
				.references("id")
				.inTable("projects")
				.onDelete("CASCADE");
            
            // provides a hook to query on all members,
            // and enforces that a user can have only
            // one membership type
			table
				.string("userId", constants.SMALL)
				.references("id")
				.inTable("users")
                .onDelete("CASCADE");

            // exclusive arc table pattern, requires
            // raw constraint enforcement
            table.string("contributorId", constants.SMALL)
                .references("id")
                .inTable("users")

            table.string("administratorId", constants.SMALL)
                .references("id")
                .inTable("users")

            table.boolean("isAdvisor")
                .notNullable()
                .defaultTo(false);

			table.primary(["projectId", "userId"]);
        })
        .raw(`
            ALTER TABLE "members"
            ADD CONSTRAINT "exactlyOneMemberType" check(
                (
                    ("contributorId" is not null)::integer +
                    ("administratorId" is not null)::integer
                ) = 1
            )
        `)

		.createTable("statuses", table => {
			table.string("value", constants.SMALL).primary();
		})
		.createTable("applications", table => {
            table.uuid("id").primary();
            
            table
                .dateTime("createdAt")
                .notNullable()
                .defaultTo(knex.fn.now());

			table
				.dateTime("updatedAt")
				.notNullable()
                .defaultTo(knex.fn.now());
                
            table.string("note", constants.MEDIUM);

			//references
			table
				.uuid("projectId")
				.notNullable()
				.references("id")
				.inTable("projects")
				.onDelete("CASCADE");

			table
				.string("userId", constants.SMALL)
				.notNullable()
				.references("id")
				.inTable("users")
                .onDelete("CASCADE");
                
            table
                .string("responderId", constants.SMALL)
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");

			table
				.string("status", constants.SMALL)
				.notNullable()
				.references("value")
				.inTable("statuses")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
        })
        .createTable("notifications", table => {
            table.uuid("id").primary();

            table.json("document").notNullable();

            table
                .boolean("read")
                .notNullable()
                .defaultTo(false)

            table
                .dateTime("createdAt")
                .notNullable()
                .defaultTo(knex.fn.now());

            //references
            table
				.string("userId", constants.SMALL)
				.notNullable()
				.references("id")
				.inTable("users")
                .onDelete("CASCADE");
        })
        .createTable("invites", table => {
            table.uuid("id").primary();

            table.string("note", constants.MEDIUM);

            table
                .dateTime("createdAt")
                .notNullable()
                .defaultTo(knex.fn.now());

            table
				.dateTime("updatedAt")
				.notNullable()
				.defaultTo(knex.fn.now());

            //references
            table
                .string("initiateId", constants.SMALL)
                .notNullable()
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");

            table
                .string("targetId", constants.SMALL)
                .notNullable()
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");

            table
                .uuid("projectId")
                .notNullable()
                .references("id")
                .inTable("projects")
                .onDelete("CASCADE");

            table
                .string("role", constants.SMALL)
                .notNullable()
                .references("value")
                .inTable("rolesValues")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");

            table
                .boolean("isAdvisor")
                .notNullable()
                .defaultTo(false);

            table
				.string("status", constants.SMALL)
				.notNullable()
				.references("value")
				.inTable("statuses")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
        })
        .createTable("comments", table => {
            table.uuid("id").primary();

            table.string("body", constants.MEDIUM);

            table
                .dateTime("createdAt")
                .notNullable()
                .defaultTo(knex.fn.now());

            // references
            table
				.uuid("projectId")
				.notNullable()
				.references("id")
				.inTable("projects")
                .onDelete("CASCADE");

			table
                .string("userId", constants.SMALL)
                .notNullable()
				.references("id")
				.inTable("users")
                .onDelete("CASCADE");
                
            table
                .uuid("parentId")
                .references("id")
                .inTable("comments")
                .onDelete("CASCADE");
        })
        .createTable("historyEvents", table => {
            table.uuid("id").primary();

            table.string("type", constants.SMALL);

            table.json("before");
            table.json("after");

            table.dateTime("createdAt")
                .notNullable()
                .defaultTo(knex.fn.now());

            table.uuid("projectId")
                .notNullable()
                .references("id")
                .inTable("projects")
                .onDelete("CASCADE");

            table.string("initiateId")
                .notNullable()
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");
        })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema
        .dropTableIfExists("historyEvents")
        .dropTableIfExists("comments")
        .dropTableIfExists("invites")
        .dropTableIfExists("notifications")
		.dropTableIfExists("applications")
        .dropTableIfExists("statuses")
        .dropTableIfExists("members")
        .dropTableIfExists("rolesValues")
		.dropTableIfExists("stars")
		.dropTableIfExists("tags")
		.dropTableIfExists("tagsValues")
		.dropTableIfExists("majors")
		.dropTableIfExists("majorsValues")
		.dropTableIfExists("boardItems")
        .dropTableIfExists("projects")
		.dropTableIfExists("users");
}
