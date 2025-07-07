import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello() {
    return 'Hello World!'
  }

  async getHello2() {
    const urlList = [
      // 'https://api.byxy.vip/v2/idcard/',
      // 'https://www.wapi.cn/api/realname/verify',
      // http://api.muwl.xyz/api/%E4%BA%8C%E8%A6%81%E7%B4%A0/?realname=%E7%8E%8B%E6%AD%A3%E8%8A%9D&idcard=522327200006110021
    ];
    const appkeyList = [
      // 'b6131281611f6e1fc86c8662f549bdd683a68517203ba312',
      // '01e21c3405f115deb5d7820d55d19e8bc84d6ae1914b86e6',
      // '0f61d45269e06c8ed851b11b0ebb7b4a065ae9f33e3bcaf4',
      // '83f8661d159ecf1fed24cf312149079cdb4663b602fd891d',
      // 'f478186edba9854f205a130aa888733d227a8f82f98d84b9',
      // '6c6810d9871b4f37afcc1cd8542dc336e6b5aaba548add55',
      // '3a923e1137b1822c58d01cf41649bec2600c29d0884b4e19',
      '3a923e1137b1822c58d01cf41649bec2600c29d0884b4e19',
    ];
    const ids = [
      '522327200006110005',
      '522327200006110021',
      '522327200006110048',
      '522327200006110064',
      '522327200006110080',
      // '522327200106012015',
    ];
    let url = urlList[0];
    let payload = {
      realname: '王正芝',
      idcard: '522327200006110021',
      // idcard: '522327200106012015',
      // realname: '罗成敏',
      appkey: appkeyList[Math.floor(Math.random() * appkeyList.length)],
    };

    const users = [
      {
        idcard: '522327200006110021',
        realname: '王正芝',
      },
      {
        idcard: '522327200012150046',
        realname: '王安英',
      },
      {
        idcard: '522327199903020012',
        realname: '王仕福',
      },
      {
        idcard: '522327200106012015',
        realname: '罗成敏',
      },
      {
        idcard: '522326200003172028',
        realname: '谭必琴',
      },
    ];

    const res = {
      // time: new Date(),
      // request: payload,
    };

    // for (const user of users) {
      for (const id of ids) {
      payload = {
        // ...user,
        ...payload,
        idcard: id,
        appkey: '',
      };
      for (const key of appkeyList) {
        payload.appkey = key;
        const x = Object.keys(payload)
          .map((key) => `${key}=${payload[key]}`)
          .join('&');
        const result = await fetch(url + '?' + x, {
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          // body: JSON.stringify(payload),
          // mode: 'no-cors',
        })
          .then((r) => {
            console.log('🚀 ~ AppService ~ getHello ~ r:', r);
            return r.json();
          })
          .catch((e) => {
            console.log('🚀 ~ AppService ~ getHello ~ e:', e);
            return e;
          });
        res[id + key] = result;
        // res[user.idcard + key] = result;
      }
    }
    return res;
  }
}
