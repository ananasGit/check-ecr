const { ECRClient, ListTagsForResourceCommand } = require("@aws-sdk/client-ecr");
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

    // Set ListTagsForResourceCommandInput
    const resourceArn = core.getInput('registry');
    console.log({ resourceArn: resourceArn.split('').join('-') })
    const params = {
      /** input parameters */
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