import { Model } from 'objection';
import { join } from 'path';

export default class Request extends Model {

    static tableName = 'requests';

    readonly id!: string;

    static relationMappings = {
        advisor: {
            relation: Model.BelongsToOneRelation,
            modelClass: join(__dirname, 'user'),
            join: {
                from: 'requests.advisorId',
                to: 'users.id'
            }
        },
        requestedBy: {
            relation: Model.BelongsToOneRelation,
            modelClass: join(__dirname, 'user'),
            join: {
                from: 'requests.requestedById',
                to: 'users.id'
            }
        },
        status: {
            relation: Model.BelongsToOneRelation,
            modelClass: join(__dirname, 'status'),
            join: {
                from: 'requests.statusId',
                to: 'statuses.id'
            }
        }
    }
}