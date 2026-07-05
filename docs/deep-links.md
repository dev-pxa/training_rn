# 企训通 Deep Link 路径

## Scheme

- 自定义 Scheme：`qixuntong://`
- 预留 HTTPS 前缀：`https://app.qixuntong.com/`

## 路径表

| 页面 | 路径 | 参数 | 示例 |
| --- | --- | --- | --- |
| 登录页 | `qixuntong://login` | 无 | `qixuntong://login` |
| 注册页 | `qixuntong://register` | 无 | `qixuntong://register` |
| 首页 | `qixuntong://home` | 无 | `qixuntong://home` |
| 个人中心 | `qixuntong://profile` | 无 | `qixuntong://profile` |
| 课程列表 | `qixuntong://courses` | `category?` | `qixuntong://courses?category=required` |
| 课程播放页 | `qixuntong://course/player` | `courseId?` | `qixuntong://course/player?courseId=course_001` |
| 考试页 | `qixuntong://exam/detail` | `chapterId`、`courseId?`、`name?` | `qixuntong://exam/detail?courseId=course_001&chapterId=2&name=结业考试` |
| 考试结果页 | `qixuntong://exam/result` | `examRecordId`、`courseId?`、`chapterId?`、`name?` | `qixuntong://exam/result?examRecordId=123&courseId=course_001` |
| 证书详情页 | `qixuntong://certificate/detail` | `certificateId` | `qixuntong://certificate/detail?certificateId=1001` |

## 鉴权规则

- `login` 和 `register` 是公开页面。
- 其他页面都需要登录。
- 未登录打开业务链接时，App 会先停留在登录页，并缓存目标链接。
- 登录成功后，App 会自动跳转到刚才缓存的目标页面。
