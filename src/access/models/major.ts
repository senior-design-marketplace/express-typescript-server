import { Model } from 'objection';
import { join } from 'path';

export default class Major extends Model {

    static tableName = 'majorsValues';

    readonly id!: string;

    static relationMappings = {
        requestedOn: {
            relation: Model.ManyToManyRelation,
            modelClass: join(__dirname, 'project'),
            join: {
                from: 'majorsValues.value',
                through: {
                    //majors is the join table
                    from: 'majors.major',
                    to: 'majors.projectId'
                },
                to: 'projects.id'
            }
        }
    }
}