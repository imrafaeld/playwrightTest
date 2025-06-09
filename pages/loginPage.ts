import { Locator, Page } from '@playwright/test';

export default class LoginPage {

    message: Locator;

    constructor(public page: Page) {
        this.message = page.locator('//h3');
    }

    async enterUsername(username: string) {
        await this.page.locator('');
    }

    async enterPassword(password: string) {
        await this.page.locator('');
    }

    async clickTheLoginButton() {
        await this.page.locator('').click();
    }
};