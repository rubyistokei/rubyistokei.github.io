import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

export type Photo = {
  id: string;
  image: string;
  rubyists: string[] | undefined;
  taken_by: string | undefined;
  taken_at: string | undefined;
  description: string | undefined;
};

export async function GET(request: Request) {
  let photos: Photo[] = [];
  const dataDir = "./data";
  const files = await fs.readdir(dataDir);
  for (const file of files) {
    const id = path.basename(file, ".yaml");
    const yaml = await fs.readFile(`${dataDir}/${file}`, "utf-8");
    const photo = { ...YAML.parse(yaml), id };
    photos.push(photo);
  }

  return new Response(JSON.stringify({ photos }), { status: 200 });
}
