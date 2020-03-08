"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BigFanReg = /icon_bigfans(\d)?/;
async function GetPageInfo(_page) {
    let out = [];
    let feed_list = await _page.$$(`div.WB_detail`);
    for (let i = 0; i < feed_list.length; i++) {
        let info = await FeedInfo(feed_list[i]);
        out.push(info);
    }
    return out;
}
exports.GetPageInfo = GetPageInfo;
async function FeedInfo(ele) {
    let out = {
        usrName: '',
        text: '',
        bigFanLv: -1,
        singleApproved: false,
        officialApproved: false,
        time: 0,
        tags: [],
        at: [],
        superTopics: [],
    };
    let header = await ele.$('.WB_info');
    //获取用户名
    out.usrName = await (await (await header.$('a')).getProperty('innerText')).jsonValue();
    let iconList = await header.$$('.W_icon'); //all the icon which could give us the info about the usr
    for (let i = 0; i < iconList.length; i++) {
        let _class = await (await iconList[i].getProperty('className')).jsonValue();
        let try_fan = BigFanReg.exec(_class);
        if (try_fan) {
            out.bigFanLv = Number(try_fan[1] || 1); //铁粉等级
            continue;
        }
        if (/icon_approve(?=\s)/.test(_class)) {
            out.singleApproved = true; //个人
            continue;
        }
        if (/icon_approve_co/.test(_class)) { //大V
            out.officialApproved = true;
            continue;
        }
    }
    //所有的话题
    let _topics = await ele.$$('a.a_topic');
    for (let i = 0; i < _topics.length; i++) {
        let topic_s = await (await _topics[i].getProperty('innerText')).jsonValue();
        out.tags.push(topic_s.substr(1, topic_s.length - 2));
    }
    //所有的@
    let _ats = await ele.$$(`a[extra-data='type=atname']`);
    for (let i = 0; i < _ats.length; i++) {
        let _at_s = await (await _ats[i].getProperty('innerText')).jsonValue();
        out.at.push(_at_s.substring(1));
    }
    //所有的超话
    let _supers = await ele.$x(`i[contains(@class, "ficon_supertopic")]/ancestor::a[position()=1]`);
    for (let i = 0; i < _supers.length; i++)
        out.superTopics.push((await (await _supers[i].getProperty('title')).jsonValue()));
    return out;
}
//# sourceMappingURL=utils.js.map