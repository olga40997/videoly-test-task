# Videoly test task
Videoly test task is a small test suite for testing lamoda's page

## Installation

[Nodejs](https://nodejs.org/en/) should be installed on computer

To install modules use command
```npm install```

To install browsers `npx playwright install`

To run tests use ```npm test```

Before running test please check the mock file `product_data.ts` (mocking database) to be sure that it contains the right info, because info on item's page is changeable (for example price, sizes availability)

## Description
This suite contains 5 case for testing [item's page](lamoda.ru/p/rtlaba126501/clothes-weekendmaxmara-kardigan/)
1. Checking adding the particular size to the basket on the item's page
2. Checking the basket's page after the item was added
3. Checking the page info about item
4. Checking change of color
5. Checking the sizes chart

