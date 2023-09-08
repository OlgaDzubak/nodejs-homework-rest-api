const express = require('express');
const request = require('supertest');
const {login} = require("./users");
const {connectToMonoDB, disconnectMonoDB }= require('../db/connection');

const app = express();
app.use(express.json());
app.post('/users/login', login);

describe("testing login controller", ()=> {
        
        beforeAll( async () => { 
            await connectToMonoDB();
            app.listen(3000); 
        });  
        
        afterAll( async () => { 
            await disconnectMonoDB();
        });      

        //-----------------------------------------------------------------
        const reqBody = {email: 'OlgaDzubak@i.ua', password: '098765'};

        test("Given user data = {email: 'OlgaDzubak@i.ua', password: '098765'}. Should return status 200, set response.body with user data (email, subscription) and provide token if user exists", async () => {
     
                const res = await request(app).post("/users/login").send(reqBody);

                const {token, user} = res.body;

                console.log("res.status=",res.status+'\n',"token=", token+'\n', "user=", user );

                expect(res.status).toBe(200);
                expect(typeof token).toBeDefined();
                expect(typeof user.email).toBe('string');
                expect(typeof user.subscription).toBe('string');
        });

});

