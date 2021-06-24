const { ECRClient, ListImagesCommand } = require("@aws-sdk/client-ecr");
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");
const core = require('@actions/core');

const app = async () => {
  try {
    // Configure the client
    const region = core.getInput('region');

    const client = new ECRClient({ region });

    const stsClient = new STSClient({ region });
    const callerIdCommand = new GetCallerIdentityCommand();
    const callerIdResponse = await stsClient.send(callerIdCommand);

    // Set ListImagesCommandInput
    const registry = core.getInput('registry');

    // 038098751075.dkr.ecr.us-east-1.amazonaws.com/microservice-bedrock-camunda

    const name = registry.split('/')[1];

    const resourceArn = `arn:aws:ecr:${region}:${callerIdResponse.Account}:repository/${name}`;

    console.log({ resourceArn })

    const tag = core.getInput('registry');

    const params = {
      repositoryName: name,
      filter: tag
    };

    console.log({ params })

    const command = new ListImagesCommand(params);

    const data = await client.send(command);

    console.log(data)

  } catch (error) {
    core.setFailed(error.message);
  }
}

app()