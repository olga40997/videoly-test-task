import { test, expect, Page } from '@playwright/test';
import { SELECTORS } from '../utils/constants';
import PRODUCT_DATA from '../utils/mock/product_data';



test.beforeEach(async ({ page }) => {
  await page.goto('/p/rtlaba126501/clothes-weekendmaxmara-kardigan/', {waitUntil: 'domcontentloaded'})
});

test.afterEach(async ({ page }, testInfo) => {
  console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

  if (testInfo.status !== testInfo.expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);
});


test.describe('adding item to the basket', () => {
  test('checking adding item to the basket', async ({page}) => {
    //open sizes chooser
    await page.locator(SELECTORS.sizesChooser).click();
    await expect(page.locator(SELECTORS.sizes)).toBeVisible();

    //choose size
    if (PRODUCT_DATA[1].sizes[0].stock_quantity != 0) {
      await addItemToBasket(page, SELECTORS.xsSize, 0)
    }
    else if (PRODUCT_DATA[1].sizes[1].stock_quantity != 0) {
      await addItemToBasket(page, SELECTORS.sSize, 1)
    }
    else if (PRODUCT_DATA[1].sizes[2].stock_quantity != 0) {
      await addItemToBasket(page, SELECTORS.mSize, 2)
    }
    else if (PRODUCT_DATA[1].sizes[3].stock_quantity != 0) {
      await addItemToBasket(page, SELECTORS.lSize, 3)
    }
    else {
      console.log('Did not run as expected, all sizes of this item is unavailable')
    }
  })

  test('checking the basket', async ({page}) => {
    //add item to the basket
    await page.locator(SELECTORS.sizesChooser).click();
    await expect(page.locator(SELECTORS.sizes)).toBeVisible();

    await page.locator(SELECTORS.xsSize).click();
    await page.locator(SELECTORS.addToBasket).click();
    await expect(page.locator(SELECTORS.modalFrame)).toBeVisible();

    await page.locator(SELECTORS.modalFrameCrossButton).click()

    //going to the basket page
    await page.locator(SELECTORS.basketButton).click();

    await expect(page.locator(SELECTORS.basketText)).toContainText(PRODUCT_DATA[1].title + ' ' + PRODUCT_DATA[1].brand.title);
    await expect(page.locator(SELECTORS.basketSizes)).toContainText(PRODUCT_DATA[1].sizes[0].title);

  })

})

test.describe('the Page', () => {
  test('checking the page info', async ({page}) => {
    //check that info on page is correct
    await expect(page.locator(SELECTORS.productBrandName)).toHaveText(PRODUCT_DATA[1].brand.title);
    await expect(page.locator(SELECTORS.productModelName)).toHaveText(PRODUCT_DATA[1].title + ' ' + PRODUCT_DATA[1].model_title);
    await expect(page.locator(SELECTORS.productPrice)).toContainText(PRODUCT_DATA[1].price);
    await expect(page.locator(SELECTORS.productSku)).toHaveText(PRODUCT_DATA[1].sku);

  })
})

test.describe('Colors', () => {
  test('checking change of color', async ({page}) => {
    //check that second color is not visible
    await expect(page.locator(SELECTORS.secondColor)).toHaveCSS('display', 'none');
    //open the color chooser
    await page.locator(SELECTORS.colorChooser).click();
    await expect(page.locator(SELECTORS.secondColor)).toBeVisible();
    await expect(page.locator(SELECTORS.secondColorText)).toHaveText(PRODUCT_DATA[0].colors[0].title);

    //changing the color to second
    await page.locator(SELECTORS.secondColor).click();
    await expect(page).toHaveURL(/.*rtlaba126601/); //sku of second color

    //check the color on color chooser
    await expect(page.locator(SELECTORS.firstColorText)).toHaveText(PRODUCT_DATA[0].colors[0].title);
  })
})

test.describe('Sizes chart', () => {
  test('checking opening the sizes chart', async ({page}) => {
    //check that sizes chart closed by default
    await expect(page.locator(SELECTORS.sizesVideoFrame)).not.toBeVisible();
    await expect(page.locator(SELECTORS.sizesChart)).not.toBeVisible();

    //open the sizes chart
    await page.locator(SELECTORS.sizesChartButton).click();

    await page.locator(SELECTORS.sizesChart).click();

    //check that sizes chart opened
    await expect(page.locator(SELECTORS.sizesVideoFrame)).toBeVisible();
    await expect(page.locator(SELECTORS.sizesChart)).toBeVisible();

    //closing sizes chart
    await page.locator(SELECTORS.sizeChartFrameCrossButton).click();

  })
})

async function addItemToBasket(page: Page, selector: string, size: number) {
  await page.locator(selector).click();
  await expect(page.locator(SELECTORS.sizesChooserText)).toHaveText(PRODUCT_DATA[1].sizes[size].text);

  //add to basket
  //checking the basket icon on product's page
  await expect(page.locator(SELECTORS.basket)).toHaveText('Корзина');
  await page.locator(SELECTORS.addToBasket).click();
  await expect(page.locator(SELECTORS.modalFrame)).toBeVisible();
  //checking of
  await expect(page.locator(SELECTORS.modalFrameText)).toContainText(PRODUCT_DATA[1].title + ' ' + PRODUCT_DATA[1].brand.title);
  //checking the size of the product on modal frame
  await expect(page.locator(SELECTORS.modalFrameSizes)).toContainText(PRODUCT_DATA[1].sizes[size].title);
  await page.locator(SELECTORS.modalFrameCrossButton).click();
  //check the basket text on clothes page
  await expect(page.locator(SELECTORS.basket)).toHaveText('1 товар');
}