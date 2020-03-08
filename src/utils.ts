import puppeteer from 'puppeteer';
const BigFanReg = /icon_bigfans(\d)?/;

interface super_hanashi_feed {
  usrName: string;
  text: string;
  bigFanLv: Number; //铁粉等级  不是为-1
  singleApproved: Boolean; //个人认证
  officialApproved: Boolean; //官方认证 （大V）
  time: Number;//时间戳
  tags: string[];
  at: string[];
  superTopics: string[];
}

export async function GetPageInfo(_page: puppeteer.ElementHandle<Element>): Promise<super_hanashi_feed[]> {
  let out = [];
  let feed_list = await _page.$$(`div.WB_detail`);
  for (let i = 0; i < feed_list.length; i++) {
    let info = await FeedInfo(feed_list[i]);
    out.push(info);
  }
  return out;
}

async function FeedInfo(ele: puppeteer.ElementHandle<Element>): Promise<super_hanashi_feed> {//get information for a single
  let out: super_hanashi_feed = {
    usrName: '',
    text: '',
    bigFanLv: -1,
    singleApproved: false,
    officialApproved: false,
    time: 0,
    tags: [],
    at: [],
    superTopics: [],
  }
  let header = await ele.$('.WB_info');
  //获取用户名
  out.usrName = await (await (await header.$('a')).getProperty('innerText')).jsonValue() as string;
  let iconList = await header.$$('.W_icon'); //all the icon which could give us the info about the usr
  for (let i = 0; i < iconList.length; i++) {
    let _class = await (await iconList[i].getProperty('className')).jsonValue() as string;
    let try_fan = BigFanReg.exec(_class);
    if (try_fan) {
      out.bigFanLv = Number(try_fan[1] || 1);//铁粉等级
      continue;
    }
    if (/icon_approve(?=\s)/.test(_class)) {
      out.singleApproved = true;//个人
      continue;
    }
    if (/icon_approve_co/.test(_class)) {//大V
      out.officialApproved = true;
      continue;
    }
  }
  //所有的话题
  let _topics = await ele.$$('a.a_topic');
  for (let i = 0; i < _topics.length; i++) {
    let topic_s = await (await _topics[i].getProperty('innerText')).jsonValue() as string;
    out.tags.push(topic_s.substr(1, topic_s.length - 2))
  }
  //所有的@
  let _ats = await ele.$$(`a[extra-data='type=atname']`)
  for (let i = 0; i < _ats.length; i++) {
    let _at_s = await (await _ats[i].getProperty('innerText')).jsonValue() as string;
    out.at.push(_at_s.substring(1))
  }
  //所有的超话
  let _supers = await ele.$x(`i[contains(@class, "ficon_supertopic")]/ancestor::a[position()=1]`)
  for (let i = 0; i < _supers.length; i++)
    out.superTopics.push((await (await _supers[i].getProperty('title')).jsonValue()) as string)
  return out;
}

