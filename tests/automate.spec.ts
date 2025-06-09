import { test, expect, request } from '@playwright/test';
import LoginPage from '../pages/loginPage';

test.describe('Group Test', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
    });

    test('Login Invalid Credentials', { tag: '@invalid' }, async ({ page }) => {
        const login = new LoginPage(page);
        login.enterUsername('standard_user');
        login.enterPassword('malipassword');
        login.clickTheLoginButton();

        await expect(login.message).toBeVisible();
    });

    test('Login Valid Credentials', { tag: '@valid' }, async ({ page }) => {
        const login = new LoginPage(page);
        login.enterUsername('standard_user');
        login.enterPassword('secret_sauce');
        login.clickTheLoginButton();
    });

});