import { test, expect, request } from '@playwright/test';

const KANKOLEK_URL = 'https://dev-api.peddlr.io/v5/kankolek/mobile';

async function getToken() {
    const context = await request.newContext({
        extraHTTPHeaders: {
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
            'Content-Type': 'application/x-amz-json-1.1',
        }
    });

    const body = {
        'AuthParameters': {
            'USERNAME': '+639173069996',
            'PASSWORD': '@Rafaeld96'
        },
        'AuthFlow': 'USER_PASSWORD_AUTH',
        'ClientId': '76gt8ham9fb3cjleilqq3nuiep',
    }

    const response = await context.post('https://cognito-idp.ap-southeast-1.amazonaws.com/', {
        data: body,
    });

    expect(response.status()).toEqual(200);
    
    const value = await response.json();
    const token = 'Bearer ' + value.AuthenticationResult?.IdToken;

    return token;
}

test.describe('API Test Suite', () => {
    test.only('GET', { tag: '@getapi' }, async ({ page }) => {
        const token = await getToken();

        const response = await page.request.get('https://dev-api.peddlr.io/v5/mobile/digital-products/eload/payment-method/list-v2', {
            headers: {
                'Authorization': token,
            }
        });

        expect(response.status()).toEqual(200);

        const results = await response.json();
        const paymentMethods = results.message?.paymentMethods;
        const names = paymentMethods.filter((m: any) => m.rateType === 'mdr').map((m: any) => m.name);
        console.log('---FULL RESPONSE---');
        console.log(names);
        // console.log(paymentMethods);
        // console.log(JSON.stringify(result));
    });

    test('POST', { tag: '@postapi' }, async ({ page }) => {
        const token = await getToken();

        const response = await page.request.post(KANKOLEK_URL + '/peddlr-wallet/transaction/details', {
            headers: {
                'Authorization': token,
            },
            data: {
                'transactionId': '8358060',
            }
        });

        expect(response.status()).toEqual(200);

        const result = await response.json();
        const datas = result.message?.transactionDetails;
        console.log(datas);
        // const value = datas.map((m: any) => m.transactionId);
    });
});