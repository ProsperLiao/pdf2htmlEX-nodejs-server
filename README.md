#pdf转换为html5方案 - pdf2htmlEX

遵从开源协议 GPLv3+

`本库仅为pdf2htmlEX的配置文件, 是从安装好的pdf2htmlEX工具后，`
`在目录 /usr/local/Cellar/pdf2htmlex/0.14.6_xx/share/pdf2htmlEX 拷贝出来的。`
`用于修复工具自身的bugs, 及进行定制化生成的html等的扩展所用。`
`可修改manifest， html模板, css, js等文件。`


##现状
- 最开始是使用转码服务器把pdf，word, excel 等转换为html, 但体验不是很好。
- 后来换成 目前在用的 pdf课件显示方案，后端提供原生pdf文件, 前端使用pdf.js把pdf文件通过canvas 和 text layer 来渲染，但由于占用内存过大，性能不佳， 容易出现白页的bug, 而且加载时间也不是很理想。 偶尔会收到生产环境反馈的一些问题， 通过升级pdf.js 和ng2-pdf-viewer 的版本，稍有改善， 但没有证据证明完全解决了问题。
- 最新了解到一个工具 pdf2htmlEX,  是在服务器端，把pdf转换为html5.  网上反馈效果不错，经测试，效果也不错， 建议使用。


##工具
-  https://github.com/coolwanglu/pdf2htmlEX
-  GPLv3+ 开源协议，可用于商业使用，但基于此二次开发的软件需要开源并遵从GPLv3+ 。
-  测试: 使用阿里巴巴巴Java开发手册 1.4.0 版.pdf,  经过处理，把内容复制了很多遍，合并为一个巨大的pdf文件，2100页， 56.9MB 。用http-server 在本机提供文件服务，用Charles 限速为3G网络，经过电脑端、ipone safari,  微信浏览器测试。

|类型|转换速度|输出大小|显示效果|加载速度|PDF功能|
| :--------: | :--------: | :--------: | :--------: | :--------: | :--------: |
|未经线性优化的pdf|-| 56.9MB |原生pdf效果|需加载完整个pdf文件，用时与大小，网速相关| 原生pdf功能|
|转换为单个文件html|7分15秒|241.1MB|高度还原PDF显示效果，无异常，无文字或图片等元素缺失|需加载完整个文件才显示 18分40秒|无pdf目录功能，无按页码跳转定位功能 |
| 转换为单页多个文件html| 9分钟|198.6MB|同上|因为是懒加载的方式，白屏时间 仅为2秒，5秒能显示完首页的图片，在快速滚动到后面很远的页面的情况下，也能即时加载出该页面|无pdf目录功能,无按页码跳转定位功能|
	

##使用
- 可通过docker 或 命令行两种方式使用，建议用docker方式，较简便。
- 转换后的html文件在移动设备上有点问题，滚动条不显示，需要修改源文件配置. 通过从安装好的pdf2htmlEX工具后，在目录 /usr/local/Cellar/pdf2htmlex/0.14.6_xx/share/pdf2htmlEX 拷贝出来的 pdf2htmlEX 文件夹，并把它放置在~/pdf目录下，转换时指定--data-dir为此文录，即可使用修改后的配置来转换。
- 此文件夹已放置到内部 git库， https://192.168.0.33/git/LiaoHongXing/pdf2htmlEX.git ，并修复了滚动条问题。 后续自定义配置的修改可以此库进行.
###- docker
~/pdf 为本机目录.

```
// 生成单个html文件
docker run -ti --rm -v ~/pdf:/pdf bwits/pdf2htmlex pdf2htmlEX --zoom 1.4 --data-dir pdf2htmlEX --dest-dir out/test test.pdf

// 生成单页多个html文件 
docker run -ti --rm -v ~/pdf:/pdf bwits/pdf2htmlex pdf2htmlEX --embed cfijo --split-pages 1 --zoom 1.4 --data-dir pdf2htmlEX --dest-dir out/test --page-filename test-%d.page test.pdf
```

###- Linux 命令行

```
// 安装工具到本机.
sudo apt install pdf2htmlex

// 使用方式类似于docker
// 生成单个html文件
pdf2htmlEX --zoom 1.4 --data-dir pdf2htmlEX --dest-dir out/test test.pdf

// 生成单页多个html文件 
pdf2htmlEX --embed cfijo --split-pages 1 --zoom 1.4 --data-dir pdf2htmlEX --dest-dir out/test --page-filename test-%d.page test.pdf
```

##扩展
- 如需修改样式，或增加更多功能，可通过修改 pdf2htmlEX 文件夹内的 html模板， css 和 js 文件来实现。 

##前后端交互
- 因为系统中存在下载功能，且原生APP(ios, android) 对原生pdf的支持还不错。
- 但原生APP对于体积较大的pdf文件的显示速度也会比较慢。
- 可考虑让后端在转换pdf文件到html5后保留pdf原文件，用作提供给下载使用.

##参考文档
- https://github.com/coolwanglu/pdf2htmlEX/wiki/
- https://www.itread01.com/content/1548397099.html
- https://www.cnblogs.com/zhuchenglin/p/7363214.html
