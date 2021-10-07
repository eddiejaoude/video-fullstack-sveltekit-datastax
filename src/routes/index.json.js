import { createClient } from "@astrajs/collections";

const db = async () => {
  const astraClient = await createClient({
    astraDatabaseId: process.env["ASTRA_DB_ID"],
    astraDatabaseRegion: process.env["ASTRA_DB_REGION"],
    applicationToken: process.env["ASTRA_DB_APPLICATION_TOKEN"],
  });
  const collection = astraClient
    .namespace("sveltelive")
    .collection("developers");

  return collection;
};

export async function get(req, res) {
  const client = await db();
  const keyword = req.query.get("keyword");

  let developers = [];
  if (keyword) {
    developers = await client.find({ name: { $eq: keyword } });
  } else {
    developers = await client.find({});
  }

  return {
    status: 200,
    body: Object.keys(developers).map((key) => {
      return {
        id: key,
        ...developers[key],
      };
    }),
  };
}

export async function post(req, res) {
  const client = await db();
  const data = req.body;

  const response = await client.create(data);

  return {
    status: 201,
    body: { id: response.documentId, ...data },
  };
}

export async function del(req, res) {
  const client = await db();
  const id = req.query.get("id");

  await client.delete(id);

  return {
    status: 204,
  };
}
