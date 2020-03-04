import { uuidv4 } from 'uuid/v4';

export namespace MediaRequestFactory {
    export interface KnownDirectoryParams {
        bucket: string,
        directory: string // the path at which a new uuid will be generated
    }
    
    export interface KnownFileParams {
        bucket: string,
        key: string // the full key to reach the s3 object, including any uuid needed
    }
}

export class MediaRequestFactory {

    static TEN_MB = 10485760;
    static ONE_MINUTE = 60;

    constructor(private readonly s3: AWS.S3) {}

    private generateRequest(params: AWS.S3.PresignedPost.Params) {
        const { url, fields } = this.s3.createPresignedPost(params);
        return { url, fields };
    }

    public knownDirectoryRequest(params: MediaRequestFactory.KnownDirectoryParams) {
        return this.generateRequest({
            Bucket: params.bucket,
            Expires: MediaRequestFactory.ONE_MINUTE,
            Fields: {
                key: `${params.directory}/${new uuidv4()}`
            },
            Conditions: [
                ['content-length-range', 0, MediaRequestFactory.TEN_MB]
            ]
        });
    }

    public knownFileRequest(params: MediaRequestFactory.KnownFileParams) {
        return this.generateRequest({
            Bucket: params.bucket,
            Expires: MediaRequestFactory.ONE_MINUTE,
            Fields: {
                key: params.key
            },
            Conditions: [
                ['content-length-range', 0, MediaRequestFactory.TEN_MB]
            ]
        });
    }
}