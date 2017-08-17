# jQuery-template Change Log
--

## 1.0.1

`2017-08-16`

- `New` 新建项目工程模板。

- `New` 这里记录下搭建这个模板遇到的问题。主要就是用cli工具下载之后，不能正常运行（目录src的handlebarjs语法，如{{}}被过滤）的问题。后来发现，cli工具本身就用到了此模板，因此再生成具体项目模板的时候，会根据用户生成的内容自动替换掉。如`package.json`里的`name description`等。最终解决方案，就是在`meta.js`里，添加了`skipInterpolation`，用来过滤掉不需要替换的文件。



