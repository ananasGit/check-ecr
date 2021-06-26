const { ECRClient, BatchGetImageCommand } = require("@aws-sdk/client-ecr");
const core = require("@actions/core");

const app = async () => {
  try {
    // Configure the client
    const region = core.getInput("region");

    const client = new ECRClient({ region });

    // Set ListImagesCommandInput
    const registry = core.getInput("registry");

    // Get id from registry URL
    const repositoryName = registry.split("/")[1];
    const imageTag = core.getInput("registry");

    const params = {
      repositoryName,
      imageIds: [{ imageTag }],
    };

    const command = new BatchGetImageCommand(params);

    const data = await client.send(command);

    // Set the output if the image has been found
    if (data?.images?.length >= 1) {
      core.setOutput("found", "true");
    } else {
      core.setOutput("found", "false");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};

app();
