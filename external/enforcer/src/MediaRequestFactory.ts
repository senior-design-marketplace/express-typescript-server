import { AllowedMedia } from "../../../lib/types/base/AllowedMedia";

export namespace MediaRequestFactory {

    export interface Params {
        bucket: string,
        key: string,
        type: AllowedMedia
    }
}

export class MediaRequestFactory {

    static TEN_MB = 10485760;
    static ONE_MINUTE = 60;

    static CONTENT_TYPES: Record<AllowedMedia, string> = {
        JPEG: 'image/jpeg',
        PNG: 'image/png',
        GIF: 'image/gif',
        MP4: 'video/mp4'
    }

    constructor(private readonly s3: AWS.S3) {}

    private async generateRequest(params: AWS.S3.PresignedPost.Params) {
        const { url, fields } = await this.s3.createPresignedPost(params);
        return { url, fields };
    }

    public async knownFileRequest(params: MediaRequestFactory.Params) {
        return this.generateRequest({
            Bucket: params.bucket,
            Expires: MediaRequestFactory.ONE_MINUTE,
            Fields: {
                key: params.key,
                acl: 'public-read',
                'Content-Type': MediaRequestFactory.CONTENT_TYPES[params.type]
            },
            Conditions: [
                ['content-length-range', 0, MediaRequestFactory.TEN_MB]
            ]
        });
    }
}