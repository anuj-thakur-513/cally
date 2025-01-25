import { LambdaClient, InvokeCommand, InvocationType, LogType } from "@aws-sdk/client-lambda";
import keys from "../config/keys";

const aws = keys.aws;

const client = new LambdaClient({
  region: aws.region,
});

const invokeEmailer = async (
  receiverEmail: string,
  senderEmail: string,
  senderName: string
): Promise<boolean> => {
  try {
    const input = {
      FunctionName: "cally-emailer",
      InvocationType: InvocationType.Event,
      LogType: LogType.None,
      Payload: new TextEncoder().encode(
        JSON.stringify({
          receiverEmail,
          senderEmail,
          senderName,
        })
      ),
    };
    const command = new InvokeCommand(input); // Create the command
    const response = await client.send(command); // Send the command to AWS Lambda

    return true;
  } catch (error) {
    console.error("Error invoking Lambda function:", error);
    return false;
  }
};

export default invokeEmailer;
