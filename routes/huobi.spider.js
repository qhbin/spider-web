var router = require('koa-router')();
const puppeteer = require('puppeteer');
router.prefix('/spider/huobi');

router.get('/market', async (ctx, next) =>{
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.huobi.co/zh-cn/markets');
  const html = await page.evaluate(() => {
    const doms = document.querySelectorAll('.goDetail');
    const items = Array.from(doms);
    return items.map(item=>{
      return {
        name: item.querySelector('.coin_name').innerText,
        rate: item.querySelector('.rate').innerText
      }
    })
  });

  ctx.body = html;
});

module.exports = router;
