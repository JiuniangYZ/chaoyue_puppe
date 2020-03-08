"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const puppeteer = require('puppeteer');
const puppeteer_1 = __importDefault(require("puppeteer"));
const utils_1 = require("./utils");
let super_hanashi = 'https://weibo.com/p/1008082a98366b6a3546bd16e9da0571e34b84/super_index';
(async () => {
    const browser = await puppeteer_1.default.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(super_hanashi);
    await page.waitForNavigation();
    // await page.goto('https://weibo.com/login.php');
    // await page.click(`#weibo_top_public > div > div > div.gn_position > div.gn_login > ul > li:nth-child(3) > a`);
    await page.waitForSelector(`a[node-type="loginBtn"]`);
    let btn = await page.$(`a[node-type="loginBtn"]`);
    console.log('btn as ', btn);
    await btn.click();
    //await page.click(`a[node-type="loginBtn"]`);
    await page.waitForSelector('div.username > input');
    await page.type('div.username > input', '13806442210');
    await page.type('div.password > input', 'daixinyu1991');
    await page.click(' div.B_login> div.item_btn > a.W_btn_a');
    await page.waitForSelector('a[node-type="publish"]');
    await page.waitForSelector('div.WB_feed.WB_feed_v3.WB_feed_v4');
    await scroll2Bottom(page);
    await page.waitForSelector('div.W_pages');
    let wrapper = await page.$('div.WB_feed.WB_feed_v3.WB_feed_v4');
    let ss = await utils_1.GetPageInfo(wrapper);
    console.log(ss);
    // let list = await wrapper.$$('div.WB_detail');
    // let list2 = await (await (await list[0].$x(`./div[contains(@class, 'WB_info')][position()=1]/a`)));//获取用户名的那个节点
    // let all_super_topic = await list[0].$x(`.//i[contains(@class, "ficon_supertopic")]/ancestor::a[position()=1]`);
    // let all_topic = await list[0].$x(`.//i[contains(@class, "ficon_supertopic")]/ancestor::a[position()=1]`);
    // // let all_link = await list[0].$x(`.//i[contains(@class, "ficon_supertopic")]/ancestor::a[position()=1]`)
    // //console.log(all_link.length);
    // //console.log(all_super_topic.length);
    // //let super_name =await (await list3[0].getProperty('title')).jsonValue();
    // //console.log(list3.length);
    // //console.log(super_name);
    // //console.log(await (await list2[0].getProperty('innerText')).jsonValue());
    // // let aList = await (await list[0].$('.WB_info')).$$('a');
    // // let iconList = await (await list[0].$('.WB_info')).$$('.W_icon'); 
    // // let name = await (await aList[0].getProperty('innerText')).jsonValue();
    // // let className = await (await iconList[1].getProperty('className')).jsonValue();
    // // console.log('name is ',name);
    // // console.log('class is ',className);
})();
//爬某超话页面的
let scroll2Bottom = async (page, count = 2) => {
    page.evaluate(async (count) => {
        console.log(count);
        let c = 0;
        let finished = false;
        let ob = new MutationObserver(() => {
            console.log('jucy!');
            c++;
            if (c == count) {
                ob.disconnect();
                finished = true;
            }
        });
        let list = document.querySelector('div.WB_feed.WB_feed_v3.WB_feed_v4');
        ob.observe(list, { childList: true });
        while (true) {
            if (finished) {
                ob.disconnect();
                return;
            }
            window.scrollBy(0, 100000);
            await new Promise(res => { setTimeout(() => { res(); }, 500); });
        }
    }, count);
};
//# sourceMappingURL=juicy.js.map