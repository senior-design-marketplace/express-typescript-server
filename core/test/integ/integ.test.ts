import GatewayRunner from "./local";
import TokenFactory from './tokenFactory';
import creds from './creds';
import uuid from 'uuid/v4';

// * the gateway runner is just a local copy of the gateway.
// * you can configure it to point to the staging db or a local
// * sqlite instance.  Keep in mind that running the postgres
// * instance will leave open handles and prevent Jest from
// * exiting.
const runner: GatewayRunner = new GatewayRunner();
const tokenFactory: TokenFactory = new TokenFactory();

const USER_ZERO = creds[0].username;
const USER_ONE = creds[1].username;
const USER_TWO = creds[2].username;

beforeAll(async () => {
    for (const login of creds) {
        await tokenFactory.login(login.username, login.password);
    }
});

afterAll(async () => {
    await runner.close();
});

test("Run a sample test", async () => {
	const response = await runner.runEvent({
		httpMethod: "GET",
		body: "",
		path: "/projects",
		queryStringParameters: {
			acceptingApplications: 'true'
		}
    });

	expect(response.statusCode).toBe(200);
});

test("Provide a request with bad query params", async () => {
	const response = await runner.runEvent({
		httpMethod: "GET",
		body: "",
		path: "/projects",
		queryStringParameters: {
			sortBy: "foo" // invalid sort parameter
		}
	});

	expect(response.statusCode).toBe(200);
});

test("Provide a valid query param", async () => {
	const response = await runner.runEvent({
		httpMethod: "GET",
		body: "",
		path: "/projects",
		queryStringParameters: {
            sortBy: 'popular'
		}
    });

	expect(response.statusCode).toBe(200);
});

test("Create a new project", async () => {
	const response = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: uuid(),
            title: "Create project",
            tagline: "Foo"
        }),
		path: "/projects",
		queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    expect(response.statusCode).toBe(200);
});

test("Update the title of a project", async () => {
    const id = uuid();

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            title: "Update project",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    const update = await runner.runEvent({
        httpMethod: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            body: "test"
        }),
        path: `/projects/${id}`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    expect(create.statusCode).toBe(200);
    expect(update.statusCode).toBe(200);
})

test("Get details for a project", async () => {
    const id = uuid();

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            title: "Get details",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const get = await runner.runEvent({
        httpMethod: "GET",
        headers: {
            "content-type": "application/json"
        },
        path: `/projects/${id}`,
        queryStringParameters: {}
    })

    expect(create.statusCode).toBe(200);
    expect(get.statusCode).toBe(200);
});

test("Get a specific project which does not exist", async () => {
    const id = uuid();

	const response = await runner.runEvent({
        httpMethod: "GET",
        headers: {
            "content-type": "application/json"
        },
		path: `/projects/${id}`,
		queryStringParameters: {}
    });

	expect(response.statusCode).toBe(404);
});

test('Can access media endpoints for self', async () => {
    const response = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            type: "JPEG"
        }),
        path: `/users/${USER_ZERO}/avatar`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    expect(response.statusCode).toBe(200);
});


test('Cannot access media for another user', async () => {
    const response = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            type: "JPEG"
        }),
        path: '/users/foo/avatar',
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    expect(response.statusCode).toBe(403);
});

test('Apply to a project', async () => {
    const project = uuid();
    const application = uuid();

    const params = {
        id: application,
        note: "test"
    }

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Apply to project",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    const apply = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(params),
        path: `/projects/${project}/applications`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ONE)
        }
    });

    const result = JSON.parse(apply.body);

    expect(create.statusCode).toBe(200);
    expect(apply.statusCode).toBe(200);

    expect(result.id).toBe(params.id);
    expect(result.note).toBe(params.note);
})

test('Respond to an application', async() => {
    const project = uuid();
    const application = uuid();

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Reply to application",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    const apply = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: application,
        }),
        path: `/projects/${project}/applications`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ONE)
        }
    });

    const respond = await runner.runEvent({
        httpMethod: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            response: "ACCEPTED"
        }),
        path: `/projects/${project}/applications/${application}`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const get = await runner.runEvent({
        httpMethod: "GET",
        path: `/projects/${project}`
    })

    const body = JSON.parse(get.body);

    expect(create.statusCode).toBe(200);
    expect(apply.statusCode).toBe(200);
    expect(respond.statusCode).toBe(200);
    expect(get.statusCode).toBe(200);

    expect(body.contributors.length).toBe(1);
    expect(body.contributors[0].id).toBe(USER_ONE);
})

test('Load the root of the application', async () => {
    const project = uuid();
    const application = uuid();

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Load application root",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const apply = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: application,
        }),
        path: `/projects/${project}/applications`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ONE)
        }
    });

    const response = await runner.runEvent({
        httpMethod: "GET",
        headers: {
            "content-type": "application/json"
        },
        path: `/`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    expect(create.statusCode).toBe(200);
    expect(apply.statusCode).toBe(200);
    expect(response.statusCode).toBe(200);
});

test('Invite a user to a project', async () => {
    const project = uuid();
    const invite = uuid();

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Invite a user",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const invitation = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: invite,
            targetId: USER_ONE,
            role: "CONTRIBUTOR"
        }),
        path: `/projects/${project}/invites`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    expect(create.statusCode).toBe(200);
    expect(invitation.statusCode).toBe(200);
})

test('Create a project with a user not yet in the users table', async () => {
    const project = uuid();

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Database write through",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_TWO) // not in the user seed
        }
    });

    // user should have been created
    const update = await runner.runEvent({
        httpMethod: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            bio: "Foo"
        }),
        path: `/users/${USER_TWO}`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_TWO)
        }
    });

    expect(create.statusCode).toBe(200);
    expect(update.statusCode).toBe(200);
})

test('Create a board entry on a project', async () => {
    const project = uuid()
    const entry = uuid();

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Board entry",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const board = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: entry,
            document: {
                type: "TEXT",
                body: "Foo"
            }
        }),
        path: `/projects/${project}/board`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    expect(create.statusCode).toBe(200);
    expect(board.statusCode).toBe(200);
})

test('Can create comments on a project', async () => {
    const project = uuid()
    const comment = uuid()

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Create comment",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const other = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: comment,
            body: "Bar"
        }),
        path: `/projects/${project}/comments`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    expect(create.statusCode).toBe(200);
    expect(other.statusCode).toBe(200);
})

test('Can reply to a comment', async () => {
    const project = uuid()
    const comment = uuid()
    const reply = uuid()

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Create comment",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const other = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: comment,
            body: "Bar"
        }),
        path: `/projects/${project}/comments`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    const another = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: reply,
            body: "Bar"
        }),
        path: `/projects/${project}/comments/${comment}`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    expect(create.statusCode).toBe(200);
    expect(other.statusCode).toBe(200);
    expect(another.statusCode).toBe(200);
})

test('Apply to a project not accepting applications', async () => {
    const project = uuid()
    const application = uuid()

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Not accepting applications",
            tagline: "Foo",
            acceptingApplications: false
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const apply = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: application,
        }),
        path: `/projects/${project}/applications`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ONE)
        }
    });

    expect(create.statusCode).toBe(200);
    expect(apply.statusCode).toBe(403);
})

test('Apply to a project the user is already a member of', async () => {
    const project = uuid()
    const application = uuid()

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Already a member",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const apply = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: application,
        }),
        path: `/projects/${project}/applications`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    expect(create.statusCode).toBe(200);
    expect(apply.statusCode).toBe(403);
})


test('Content types for media uploads are respected', async () => {
    const upload = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            type: 'JPEG'
        }),
        path: `/users/${USER_ZERO}/avatar`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    const body = JSON.parse(upload.body);

    expect(upload.statusCode).toBe(200);
    expect(body.fields['Content-Type']).toBe('image/jpeg');
})

test('Provide an invalid path parameter', async () => {
    const get = await runner.runEvent({
        httpMethod: "GET",
        path: '/projects/foo'
    })

    expect(get.statusCode).toBe(400);
})

test('Board entries for a project are sorted', async () => {
    const project = uuid()
    const first = uuid()
    const second = uuid()


    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Sorted entries",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const firstResponse = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: first,
            document: {
                type: "TEXT",
                body: "Foo"
            }
        }),
        path: `/projects/${project}/board`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    const secondResponse = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: second,
            document: {
                type: "TEXT",
                body: "Foo"
            }
        }),
        path: `/projects/${project}/board`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    const get = await runner.runEvent({
        httpMethod: "GET",
        headers: {
            "content-type": "application/json"
        },
        path: `/projects/${project}`,
        queryStringParameters: {}
    })

    const body = JSON.parse(get.body);

    assertOrder(body.boardItems
        .map(instance => new Date(instance.createdAt).valueOf()), true);

    expect(create.statusCode).toBe(200);
    expect(firstResponse.statusCode).toBe(200);
    expect(secondResponse.statusCode).toBe(200);
    expect(get.statusCode).toBe(200);
})

test('Create a board entry on a project', async () => {
    const project = uuid()
    const entry = uuid();

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Board entry",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const board = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: entry,
            document: {
                type: "TEXT",
                body: "Foo"
            }
        }),
        path: `/projects/${project}/board`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    const update = await runner.runEvent({
        httpMethod: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            document: {
                type: "TEXT",
                body: "Bar"
            }
        }),
        path: `/projects/${project}/board/${entry}`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }        
    })

    const remove = await runner.runEvent({
        httpMethod: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            document: {
                type: "TEXT",
                body: "Bar"
            }
        }),
        path: `/projects/${project}/board/${entry}`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }        
    })

    expect(create.statusCode).toBe(200);
    expect(board.statusCode).toBe(200);
    expect(update.statusCode).toBe(200);
    expect(remove.statusCode).toBe(200);
})

test('Can delete a comment on a project', async () => {
    const project = uuid()
    const comment = uuid()

    const create = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: project,
            title: "Create comment",
            tagline: "Foo"
        }),
        path: "/projects",
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    });

    const other = await runner.runEvent({
        httpMethod: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: comment,
            body: "Bar"
        }),
        path: `/projects/${project}/comments`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ONE)
        }
    })

    const remove = await runner.runEvent({
        httpMethod: "DELETE",
        path: `/projects/${project}/comments/${comment}`,
        queryStringParameters: {
            id_token: tokenFactory.getToken(USER_ZERO)
        }
    })

    expect(create.statusCode).toBe(200);
    expect(other.statusCode).toBe(200);
    expect(remove.statusCode).toBe(200);
})

test('Load the root of the application unauthenticated', async () => {
    const response = await runner.runEvent({
        httpMethod: "GET",
        path: `/`
    })

    expect(response.statusCode).toBe(200);
})

test('Get a user who does not exist', async () => {
    const response = await runner.runEvent({
        httpMethod: "GET",
        path: `/users/foo`
    })

    expect(response.statusCode).toBe(404);
})

function assertOrder(items: number[], descending?: boolean) {
    for (let i = 0; i < items.length - 1; i++) {
        const current = items[i];
        const next = items[i + 1];

        if (descending) expect(current).toBeGreaterThanOrEqual(next);
        else expect(current).toBeLessThanOrEqual(next);
    }
}