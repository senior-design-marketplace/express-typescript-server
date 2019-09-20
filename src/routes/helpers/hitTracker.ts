import { SQS } from "aws-sdk";
import { SendMessageRequest, SendMessageResult } from 'aws-sdk/clients/sqs';

//increment the hits for some resource
export default class HitTracker {
    
    constructor(private readonly sqs: SQS, 
                private readonly endpoint: string) {}

    public async hit(resourceId: string): Promise<void> {
        const params: SendMessageRequest = {
            QueueUrl: this.endpoint,
            MessageBody: resourceId
        }

        try {
            await this.sqs.sendMessage(params).promise();
        } catch(e) {
            //no big deal if one drops, just log it
        }
    }
}