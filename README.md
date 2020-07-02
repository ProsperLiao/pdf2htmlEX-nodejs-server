#pdf转换为html

遵从开源协议 GPLv3+

- 本工具使用 pdf2htmlEX [https://github.com/coolwanglu/pdf2htmlEX] 作为pdf 转换至 html的工具。
- 并对生成的 html 的功能样式，做了扩展.
- 使用express, node.js实现一个服务端程序，用以接受 post pdf文件的请求，在服务端生成html，并返回.
- docker 化。 

## 注意！
- 使用了--split-pages， 生成的html文件，使用xhr异步加载页面. 因浏览器CORS 的安全限制，生成的html只能用于服务端提供，下载到本地无法正常使用， 除非转换时禁止分页异步加载。
 
##pdf转换为html5方案 - pdf2htmlEX
###现状
- 最开始是使用转码服务器把pdf，word, excel 等转换为html, 但体验不是很好。
- 后来换成 目前在用的 pdf课件显示方案，后端提供原生pdf文件, 前端使用pdf.js把pdf文件通过canvas 和 text layer 来渲染，但由于占用内存过大，性能不佳， 容易出现白页的bug, 而且加载时间也不是很理想。 偶尔会收到生产环境反馈的一些问题， 通过升级pdf.js 和ng2-pdf-viewer 的版本，稍有改善， 但没有证据证明完全解决了问题。
- 最新了解到一个工具 pdf2htmlEX,  是在服务器端，把pdf转换为html5.  网上反馈效果不错，经测试，效果也不错， 建议使用。


###工具
-  https://github.com/coolwanglu/pdf2htmlEX
-  GPLv3+ 开源协议，可用于商业使用，但基于此二次开发的软件需要开源并遵从GPLv3+ 。
-  测试: 使用阿里巴巴巴Java开发手册 1.4.0 版.pdf,  经过处理，把内容复制了很多遍，合并为一个巨大的pdf文件，2100页， 56.9MB 。用http-server 在本机提供文件服务，用Charles 限速为3G网络，经过电脑端、ipone safari,  微信浏览器测试。

|类型|转换速度|输出大小|显示效果|加载速度|PDF功能|
| :--------: | :--------: | :--------: | :--------: | :--------: | :--------: |
|未经线性优化的pdf|-| 56.9MB |原生pdf效果|需加载完整个pdf文件，用时与大小，网速相关| 原生pdf功能|
|转换为单个文件html|7分15秒|241.1MB|高度还原PDF显示效果，无异常，无文字或图片等元素缺失|需加载完整个文件才显示 18分40秒|无pdf目录功能，无按页码跳转定位功能 |
| 转换为单页多个文件html| 9分钟|198.6MB|同上|因为是懒加载的方式，白屏时间 仅为2秒，5秒能显示完首页的图片，在快速滚动到后面很远的页面的情况下，也能即时加载出该页面|无pdf目录功能,无按页码跳转定位功能|
	

###使用
 可通过docker 镜象 bwits/pdf2htmlex 或 本机安装的命令行两种方式使用，建议用docker方式，较简便。
 
- docker 方式.  
~/pdf 为本机目录.
```
// 生成单个html文件
docker run -ti --rm -v ~/pdf:/pdf bwits/pdf2htmlex pdf2htmlEX --process-outline 1 --data-dir pdf2htmlEX_data --dest-dir out/test test.pdf

// 生成单页多个html文件 
docker run -ti --rm -v ~/pdf:/pdf bwits/pdf2htmlex pdf2htmlEX --embed cfijo --split-pages 1 --process-outline 1 --data-dir pdf2htmlEX_data --dest-dir out/test --page-filename test-%d.page test.pdf
```

- Linux 命令行
```
// 安装工具到本机.
linux: sudo apt install pdf2htmlex
macos: brew install pdf2htmlex

// 使用方式类似于docker
// 生成单个html文件
pdf2htmlEX --process-outline 1 --data-dir pdf2htmlEX_data --dest-dir out/test test.pdf

// 生成单页多个html文件 
pdf2htmlEX --embed cfijo --split-pages 1 --process-outline 1 --data-dir pdf2htmlEX_data --dest-dir out/test --page-filename test-%d.page test.pdf
```

###扩展 
pdf2htmlEX_data 为pdf转换为 html 时使用的数据文件，包括html模板，js, css等。
从安装好的pdf2htmlEX工具后，在目录 /usr/local/Cellar/pdf2htmlex/0.14.6_xx/share/pdf2htmlEX 拷贝出来。
修复工具 pdf2htmlEX 自身的bugs, 及进行定制化生成的html等所进行的扩展。
通过修改pdf2htmlEX_data内的文件，增加了以下功能：
   - 增加了顶部工具条（类似pdf.js样式), PC及移动端显示时样式变化.
   - PC 端全屏显示. 
   - 增加了按钮及手势捏合的放大缩小功能, 及PC端缩放比例选择菜单
   - 页码显示，及按钮翻页功能.
   - 浏览位置及放大比例等状态, 每隔三秒保存在localstorage, 下次访问时恢复状态.
   - 修复放大缩小时, 在某些情况下，页面位置大幅移位的bug.

###前后端交互
因为公司原有产品的系统中存在下载功能，且PC, ios, android 等 对本地的pdf的支持还不错。及转换后生成的html文件不支持本地浏览（除非不使用分页异步加载）。且原文件，可能是ppt 或 word 先转换为pdf, 再二次转换为html的. 建议使用时，服务端既保存原文件，也保存转换后的html文件, 根据项目需要，下载时提供原文件，在线浏览时提供html文件。

#  node.js server


#  dockerize


#参考文档
- https://github.com/coolwanglu/pdf2htmlEX/wiki/
- https://github.com/pdf2htmlEX/pdf2htmlEX
- https://www.itread01.com/content/1548397099.html
- https://www.cnblogs.com/zhuchenglin/p/7363214.html
