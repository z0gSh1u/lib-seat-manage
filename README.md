# 图书馆座位智能管理系统

本项目硬件使用Arduino Uno开发板与PIR传感器，软件基于Vue.js (前端框架) + Node.js (后端) + Python (软硬件交互侦听)。主要功能是图书馆座位的预约、热度的统计和入/离座的检测。

![Image](https://s2.ax1x.com/2019/10/09/uo9ckT.jpg)

## 部署

### 硬件搭建

- 使用Arduino Uno开发板（也可以换成其他类似的开发板），参考`sketch.ino`的管脚定义来接线。

- 为方便接线，可以添加一块传感器扩展板（Shield）
- 不要忘记给按钮接下拉电阻

```c
const int Seat1PIRSensor 	= 12; // PIR传感器输入
const int Seat1RedLight 	= 10; // 红灯输出
const int Seat1YellowLight 	= 9;  // 黄灯输出
const int Seat1GreenLight 	= 8;  // 绿灯输出
const int Seat1CheckBtn 	= 7;  // 入座按钮输入
const int Seat1FreeBtn 		= 6;  // 座位释放按钮输入
```

### 网页端搭建

- 如有需要，修改`server/app.js`中网页服务的端口

- 修改`server/web/js/my.js`中的`siteUrl`为部署Node.js（Express）服务端的广域网地址

- 运行Node.js服务器

  ```bash
  cd server
  node app.js
  ```

  也可以使用pm2来进行进程守护

  ```bash
  cd server
  pm2 start app.js
  ```

### 主机侦听器

- 修改`host/listener.py`中的如下设置

  ```python
  PORTX = "COM3" # 硬件连接的串口编号
  BPS = 9600 # 波特率，无特殊情况不修改
  TIMEX = 5 # 超时标准
  APIPATH = "http://localhost:8888/api/" # API地址，请修改到网页端对应地址
  ```

- 运行侦听器

  ```bash
  cd host
  python listener.py
  ```

## 第三方库声明

- Bootstrap

  ```
   * Bootstrap v3.3.7 (http://getbootstrap.com)
   * Copyright 2011-2016 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  ```

- Highcharts

  ```
   * @license Highcharts
   * (c) 2009-2016 Torstein Honsi
   * License: www.highcharts.com/license
  ```

- axios

  ```
  /* axios v0.18.0 | (c) 2018 by Matt Zabriskie */
  ```

- Vue.js

  ```
   * Vue.js v2.6.10
   * (c) 2014-2019 Evan You
   * Released under the MIT License.
  ```

- jQuery

  ```
  /*! jQuery v3.3.1 | (c) JS Foundation and other contributors | jquery.org/license */
  ```

  