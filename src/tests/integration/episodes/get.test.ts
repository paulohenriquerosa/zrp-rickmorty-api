import request from "supertest";
import { app } from "../../../app";

describe("GET /episodes", () => {
  it("should be able to list episodes", async () => {
    const response = await request(app).get("/episodes");

    expect(response.status).toBe(200);

    const data = response.body;

    expect(data).toHaveProperty("info");
    expect(data).toHaveProperty("results");

    expect(data.results.length).toBeGreaterThan(0);
  });

  it("should be able to paginate and list all episodes", async () => {
    const response1 = await request(app).get("/episodes");

    expect(response1.status).toBe(200);

    const data1 = response1.body;

    expect(data1.info.next).toEqual(expect.any(String));
    expect(data1.info.prev).toBeNull();

    const response2 = await request(app).get("/episodes?page=2");

    expect(response2.status).toBe(200);

    const data2 = response2.body;

    expect(data2.info.next).toEqual(expect.any(String));
    expect(data2.info.prev).toEqual(expect.any(String));
  });
});
