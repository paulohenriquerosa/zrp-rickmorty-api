import request from "supertest";
import { app } from "../../../../../app";

describe("GET /episodes/:id/characters", () => {
  it("should be able to list characters", async () => {
    const response1 = await request(app).get("/episodes/1");

    expect(response1.status).toBe(200);

    const response2 = await request(app).get("/episodes/1/characters");

    expect(response2.status).toBe(200);

    expect(response2.body.characters.length).toEqual(response1.body.characters.length);
  });

  it("should return characters ordered alphabetically by name", async () => {
    const response = await request(app).get("/episodes/1/characters");

    expect(response.status).toBe(200);

    const data = response.body;

    const names = data.characters.map((c: any) => c.name);

    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));

    expect(names).toEqual(sortedNames);
  });
});
