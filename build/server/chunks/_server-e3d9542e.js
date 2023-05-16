import { j as json } from './index-36410280.js';

async function GET({ request, params }) {
  console.log(params);
  return json({}, { status: 200 });
}
async function POST({ request, fetch, params }) {
  console.log("Version");
  return {
    status: 200,
    body: {}
  };
}

export { GET, POST };
//# sourceMappingURL=_server-e3d9542e.js.map
