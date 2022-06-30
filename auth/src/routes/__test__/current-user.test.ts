import { app } from "../../app";

const request = require("supertest");

it("responds with details about current user", async () => {  
    const cookie = await signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set('Cookie', cookie)
    .send()    
    .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)

    expect(response.body.currentUser).toEqual(null);
})