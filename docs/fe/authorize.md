# 微信网页授权

appid    公众号唯一标识

微信官网地址：https://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html

## 1、用户同意授权，获取code


https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93f7ba2b40b1a344&redirect_uri=https%3A%2F%2Fm.mobike.com%2Fh5%2Ftest%2Fzh%2Findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirec

<img style=" width: 400px; height: 400px;" src="/images/WechatIMG220.png">

### 需要在微信公众号后台配置回调域名，打开上边的链接会弹出授权页面，成功授权后会跳转自己的业务页面，url后会带着 code 回来：

https://x.xxx.com/app/pages/aboutus/index.html?code=021P5hiq1INP0o0Dxnhq1z5jiq1P5hio&state=STATE

## 2、通过code换取网页授权access_token   【后端服务】

https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx93f7ba2b40b1a344&secret=f69d1e0f4971998a8f911a0d537da9e2&code=021P5hiq1INP0o0Dxnhq1z5jiq1P5hio&grant_type=authorization_code

接口返回：



{

      access_token: "BEg1vcZCMu7IfXKFf6PgrzxcRWdDD50Z1qx_jnI2NIXMO_4SvgC0NVauh8LcDUpn1j8a7erDbW1I4SC1PNfN2a_I0SR1vmyrFLmCTYgncnc",
      expires_in: 7200,
      refresh_token: "Dm4b52Slx_fR1D1XdI086TLAoufGeNsSvEbdmUGd9af7IBVpsL8_YpOHiEckCPYChswwcF_INqY_kIXPQmWQSwT88ebSadZGoMbnXB4UJic",
      openid: "oCRqiuHR5V9njqqh1wgA3AvDbHKU",
      scope: "snsapi_userinfo"
}

## 4、拉取用户信息  【后端服务】

http：GET（请使用https协议）
https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN

注意：上线后需要开启跨域

参数：

| 属性 | 说明  |
| --- | --- |
| access_token | 网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同link) |
| openid | 用户的唯一标识|
|lang | 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语|


