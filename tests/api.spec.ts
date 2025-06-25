import { test, expect, request } from '@playwright/test';

const apiKey = 'reqres-free-v1';
let userId;

//SITE: https://reqres.in/
test.describe('Reqres API Test Suite', { tag: '@reqres' }, () => {
    test('POST create user', async ({ request }) => {
        const response = await request.post('https://reqres.in/api/users/', {
            headers: 
            { 'x-api-key': apiKey, },
            data: 
            {
                "name": "testname",
                "job": "job quality engineer",
            },
        });

        const res = await response.json();
        console.log(res);
        userId = res.id;
        console.log(userId);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status validation
        expect(response.status()).toBe(201);
        //data type object validation
        const isObject = typeof res === 'object' && res !== null && !Array.isArray(res);
        expect(isObject).toBe(true);
        //set expected fields
        const expectedFields = {
            name: 'string',
            job: 'string',
            id: 'string',
            createdAt: 'string',
        };
        //loop check fields and field type
        for (const [key, type] of Object.entries(expectedFields)) {
            expect(res).toHaveProperty(key);
            expect(typeof res[key]).toBe(type);
        };
    });

    test('GET user list with params', async ({ request }) => {
        const response = await request.get('https://reqres.in/api/users/', {
            params: { 'page': "1", 'per_page': '20' },
            headers: { 'x-api-key': apiKey, }
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBeTruthy();
        //data type array validation
        expect(Array.isArray(res.data)).toBe(true);

        for(const body of res.data) {
            //field validation
            expect(body).toHaveProperty('id');
            expect(body).toHaveProperty('email');
            expect(body).toHaveProperty('first_name');
            expect(body).toHaveProperty('last_name');
            expect(body).toHaveProperty('avatar');

            //field type validation
            expect(typeof body.id).toBe('number');
            expect(typeof body.email).toBe('string');
            expect(typeof body.first_name).toBe('string');
            expect(typeof body.last_name).toBe('string');
            expect(typeof body.avatar).toBe('string');
        }
    });

    test('GET single user', async ({ request }) => {
        const response = await request.get('https://reqres.in/api/users/2', {
            headers: { 'x-api-key': apiKey, }
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(200);
        //top key validation
        expect(res).toHaveProperty('data');
        expect(res).toHaveProperty('support');
        //nested key validation
        const dataKeys = {
            id: 'number',
            email: 'string',
            first_name: 'string',
            last_name: 'string',
            avatar: 'string',
        }
        //data keys
        for(const [key, type] of Object.entries(dataKeys)) {
            expect(res.data).toHaveProperty(key);
            expect(typeof res.data[key]).toBe(type);
        }
        
        const supportKeys = {
            url: 'string',
            text: 'string',
        }
        //support keys
        for(const [key, type] of Object.entries(supportKeys)) {
            expect(res.support).toHaveProperty(key);
            expect(typeof res.support[key]).toBe(type);
        }
    });

    test('GET single user not found 404', async ({ request }) => {
        const response = await request.get('https://reqres.in/api/users/99', {
            headers:
            { 'x-api-key': apiKey }
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(404);
        //response validation
        expect(res).toEqual({});
    });

    test('GET List <Resource>', async ({ request }) => {
        const response = await request.get('https://reqres.in/api/unknown', {
            headers: {
                'x-api-key': apiKey,
            }
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(200);
        //data type validation
        expect(Array.isArray(res.data)).toBe(true);
        //loop key value pair
        for(const body of res.data) {
            //key validation
            expect(body).toHaveProperty('id');
            expect(body).toHaveProperty('name');
            expect(body).toHaveProperty('year');
            expect(body).toHaveProperty('color');
            expect(body).toHaveProperty('pantone_value');

            //key type validation
            expect(typeof body.id).toBe('number');
            expect(typeof body.name).toBe('string');
            expect(typeof body.year).toBe('number');
            expect(typeof body.color).toBe('string');
            expect(typeof body.pantone_value).toBe('string');
        }
    });

    test('GET Single <Resource>', async ({ request }) => {
        const response = await request.get('https://reqres.in/api/unknown/2', {
            headers: {
                'x-api-key': apiKey,
            }
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(200);
        //data type validation
        const isObject = typeof res === 'object' && res !== null && !Array.isArray(res);
        expect(isObject).toBe(true);
        //top level key validation
        expect(res).toHaveProperty('data');
        expect(res).toHaveProperty('support');
        
        const dataKeys = {
            id: 'number',
            name: 'string',
            year: 'number',
            color: 'string',
            pantone_value: 'string',
        }

        for(const [key, type] of Object.entries(dataKeys)) {
            expect(res.data).toHaveProperty(key);
            expect(typeof res.data[key]).toBe(type);
        }

        const supportKeys = {
            url: 'string',
            text: 'string',
        }

        for(const [key, type] of Object.entries(supportKeys)) {
            expect(res.support).toHaveProperty(key);
            expect(typeof res.support[key]).toBe(type);
        }
    });

    test('GET Single <Resource> Not Found 404', async ({ request }) => {
        const response = await request.get('https://reqres.in/api/unknown/23', {
            headers: {
                'x-api-key': apiKey,
            }
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(404);
        //response validation
        expect(res).toEqual({});
    });

    test('PUT update user', async ({ request }) => {
        const response = await request.put('https://reqres.in/api/users/' + userId, {
            headers: 
            { 'x-api-key': apiKey, },
            data: 
            {
                "name": "nik leafar put update",
                "job": "job update qa engineer",
            },
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(200);
        //key validation
        expect(res).toHaveProperty('name');
        expect(res).toHaveProperty('job');
        expect(res).toHaveProperty('updatedAt');
        //key type validation
        expect(typeof res.name).toBe('string');
        expect(typeof res.job).toBe('string');
        expect(typeof res.updatedAt).toBe('string');
    });

    test('PATCH update user name only', async ({ request }) => {
        const keys = {
            "name": "nik leafar patch update",
        }

        const response = await request.patch('https://reqres.in/api/users/' + userId, {
            headers:
            { 'x-api-key': apiKey },
            data: keys
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(200);
        //key validation
        for(const [key, type] of Object.entries(keys)) {
            expect(res).toHaveProperty(key);
            expect(typeof res[key]).toBe(typeof type);
        }
        expect(res).toHaveProperty('updatedAt');
        expect(typeof res.updatedAt).toBe('string');
    });

    test('DELETE created user', async ({ request }) => {
        const response = await request.delete('https://reqres.in/api/users/' + userId, {
            headers: { 'x-api-key': apiKey }
        });

        expect(response.status()).toBe(204);
    });

    test('POST register successful', async ({ request }) => {
       const response = await request.post('https://reqres.in/api/register', {
            headers: 
            { 'x-api-key': apiKey },
            data: 
            {
                "email": "eve.holt@reqres.in",
                "password": "pistol"
            },
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(200);
        //response type validation
        const isObject = typeof res === 'object' && res !== null && !Array.isArray(res);
        expect(isObject).toBe(true);
        //key validation
        expect(res).toHaveProperty('id');
        expect(res).toHaveProperty('token');
        //key type validation
        expect(typeof res.id).toBe('number');
        expect(typeof res.token).toBe('string');
    });

    test('POST register unsuccessful 400 error', async ({ request }) => {
        const response = await request.post('https://reqres.in/api/register', {
            headers:
            { 'x-api-key': apiKey },
            data:
            {
               "email": "eve.holt@reqres.in"
            }
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(400);
        //key validation
        expect(res).toHaveProperty('error');
        //key type validation
        expect(typeof res.error).toBe('string');
        //response validation
        expect(res.error).toEqual('Missing password');
    });

    test('POST Login successful', async ({ request }) => {
        const response = await request.post('https://reqres.in/api/login/', {
            headers:
            { 'x-api-key': apiKey },
            data:
            {
                "email": "eve.holt@reqres.in",
                "password": "cityslicka"
            },
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(200);
        //response type validation
        const isObject = typeof res === 'object' && res !== null && !Array.isArray(res);
        expect(isObject).toBe(true);
        //key validation
        expect(res).toHaveProperty('token');
        //key type validation
        expect(typeof res.token).toBe('string');
    });

    test('POST Login unsuccessful 400', async ({ request }) => {
        const response = await request.post('https://reqres.in/api/login/', {
            headers:
            { 'x-api-key': apiKey },
            data:
            {
                "email": "kin.d@email.com"
            },
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(400);
        //response type validation
        const isObject = typeof res === 'object' && res !== null && !Array.isArray(res);
        expect(isObject).toBe(true);
        //key validation
        expect(res).toHaveProperty('error');
        //key type validation
        expect(typeof res.error).toBe('string');
        //response validation
        expect(res.error).toEqual('Missing password');
    });

    test('GET delayed response for 3 seconds', async ({ request }) => {
        const response = await request.get('https://reqres.in/api/users?delay=3', {
            headers: { 'x-api-key': apiKey },
        });

        const res = await response.json();
        console.log(res);

        //header validation
        expect(response.headers()['content-type']).toContain('application/json');
        //status code validation
        expect(response.status()).toBe(200);
        //response type validation
        const isObject = typeof res === 'object' && res !== null && !Array.isArray(res);
        expect(isObject).toBe(true);
        //top key validation
        expect(res).toHaveProperty('data');
        expect(res).toHaveProperty('support');
        //data key type validation
        for(const body of res.data) {
            expect(body).toHaveProperty('id');
            expect(body).toHaveProperty('email');
            expect(body).toHaveProperty('first_name');
            expect(body).toHaveProperty('last_name');
            expect(body).toHaveProperty('avatar');

            expect(typeof body.id).toBe('number');
            expect(typeof body.email).toBe('string');
            expect(typeof body.first_name).toBe('string');
            expect(typeof body.last_name).toBe('string');
            expect(typeof body.avatar).toBe('string');
        }
        //support key validation
        const supportKeys = {
            url: 'string',
            text: 'string',
        }

        for(const [key, type] of Object.entries(supportKeys)) {
            expect(res.support).toHaveProperty(key);
            expect(typeof res.support[key]).toBe(type);
        }
    });
});