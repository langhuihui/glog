# Group Log 
[![OSCS Status](https://www.oscs1024.com/platform/badge/langhuihui/glog.svg?size=small)](https://www.oscs1024.com/project/langhuihui/glog?ref=badge_small)

数值时间线日志显示工具(浏览器扩展)

主要用途：需要大量打印数值调试信息，使用本工具可避免控制台被刷屏而无法查看其他重要日志信息。

# 使用方法

- 将仓库clone下来后，打开浏览器扩展管理，点击`加载解压缩的扩展`，选择仓库中的dist目录。
- 打开一个页面，并打开控制台，选择超级日志标签，即可看到扩展页面。
- 使用扩展在全局创建的glog函数来发送数据。格式：glog({key:value})

# 功能

- 扩展页面可以显示多个不同key的时间线图表
- 扩展按钮弹出页面可以显示实时数据