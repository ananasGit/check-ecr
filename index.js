const { ECRClient, ListTagsForResourceCommand } = require("@aws-sdk/client-ecr");
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");
const core = require('@actions/core');

const app = async () => {
  try {
    //   // `who-to-greet` input defined in action metadata file
    //   const nameToGreet = core.getInput('who-to-greet');
    //   console.log(`Hello ${nameToGreet}!`);
    //   const time = (new Date()).toTimeString();
    //   core.setOutput("time", time);
    //   // Get the JSON webhook payload for the event that triggered the workflow
    //   const payload = JSON.stringify(github.context.payload, undefined, 2)
    //   console.log(`The event payload: ${payload}`);

    // Configure the client
    const region = core.getInput('region');

    const client = new ECRClient({ region });

    const stsClient = new STSClient({ region });
    const callerIdCommand = new GetCallerIdentityCommand();
    const callerIdResponse = await stsClient.send(callerIdCommand);

    // Set ListTagsForResourceCommandInput
    const registry = core.getInput('registry');

    // 038098751075.dkr.ecr.us-east-1.amazonaws.com/microservice-bedrock-camunda

    const name = registry.split('/')[1];

    const resourceArn = `arn:aws:ecr:${region}:${callerIdResponse.Account}:repository/${name}`;

    console.log({ resourceArn })

    const params = {
      resourceArn
    };
    const command = new ListTagsForResourceCommand(params);

    const data = await client.send(command);

    console.log(data)

  } catch (error) {
    core.setFailed(error.message);
  }
}

app()