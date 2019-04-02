module.exports = {
  title: '风华正茂',
  description: '我的个人网站',
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: '/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  themeConfig: {
    nav:[ // 导航栏配置
      {text: '前端基础', link: '/fe/promise.html' },
      {text: '生活随笔', link: '/live/'}     
    ],
    sidebar: {
      '/fe/': [
        {
          title: '前端小知识',
          children: [
            '/fe/promise.html',
            '/fe/ssh.html',
            '/fe/this.html',
            '/fe/authorize.html',
            '/fe/topic.html'
          ]
        }
      ],
      '/live/': [
        {
          title: '生活乐趣',
          children: [
            '/live/xiangshan.html',
            '/live/baiwang.html'
          ]
        }
      ],
    }, // 侧边栏配置
    sidebarDepth: 0, // 侧边栏显示2级
  }
};
