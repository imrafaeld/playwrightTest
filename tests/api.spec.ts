import { test, expect, request } from '@playwright/test';

const apiKey = 'reqres-free-v1';
let userId;

test.describe('Resreq API Test Suite', { tag: '@resreq' }, () => {
    test('GET user list with params', async ({ request }) => {
        const response = await request.get('https://reqres.in/api/users', {
            params: { "page": "2", },
            headers: { 'x-api-key': apiKey, }
        });

        const res = await response.json();
        console.log(res);
        expect(response.status()).toBeTruthy();
    });

    test('POST create user', async ({ request }) => {
        const response = await request.post('https://reqres.in/api/users', {
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

        expect(response.status()).toBe(201);
        expect(res).toHaveProperty('createdAt');
    });

    test('GET single user', async ({ request }) => {
        const response = await request.get('https://reqres.in/api/users' + userId, {
            headers: { 'x-api-key': apiKey, }
        });

        const res = await response.json();
        console.log(res);
        expect(response.status()).toBe(200);
        expect(res).toHaveProperty(['data', 'support']);
    });

    test('PUT update user', async ({ request }) => {
        const response = await request.put('https://reqres.in/api/users/' + userId, {
            headers: 
            { 'x-api-key': apiKey, },
            data: 
            {
                "name": "nikleafarupdate",
                "job": "job update qa engineer",
            },
        });

        const res = await response.json();
        console.log(res);
        expect(response.status()).toBe(200);
        expect(res).toHaveProperty('updatedAt');
    });

    test('PATCH update user name only', async ({ request }) => {
        const response = await request.patch('https://reqres.in/api/users/' + userId, {
            headers:
            { 'x-api-key': apiKey },
            data: 
            {
                "name": "nik leafar patch update",
            }
        });

        const res = await response.json();
        console.log(res);
        expect(response.status()).toBe(200);
        expect(res).toHaveProperty('updatedAt');
    });

    test('DELETE created user', async ({ request }) => {
        const response = await request.delete('https://reqres.in/api/users/' + userId, {
            headers: { 'x-api-key': apiKey }
        });

        expect(response.status()).toBe(204);
    });

    test('GET uknown user 404 not found', async ({ request }) => {
        const response = await request.get('https://reqres.in/api/users/99', {
            headers:
            { 'x-api-key': apiKey }
        });

        expect(response.status()).toBe(404);
    });

    test('POST register unsuccessful 400 error', async ({ request }) => {
        const response = await request.post('https://reqres.in/api/register', {
            headers:
            { 'x-api-key': apiKey },
            data:
            {
               'email': 'kin@g.c'
            }
        });

        const res = await response.json();
        console.log(res);
        expect(response.status()).toBe(400);
        expect(res).toHaveProperty('error');
        expect(res.error).toEqual('Missing password');
    });
});