# 首页接口文档

## 接口信息

| 属性 | 值 |
|------|-----|
| **接口路径** | `GET /api/home` |
| **认证方式** | Bearer Token |
| **所属模块** | 首页 |

## 响应结构

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "carousel": {
      "interval": 3,
      "items": [
        {
          "id": "string",
          "imageUrl": "https://example.com/banner1.jpg",
          "jumpUrl": "https://example.com/page1"
        }
      ]
    },
    "continueLearning": {
      "sectionTitle": "继续学习",
      "sectionLink": "/learning/history",
      "course": {
        "id": "string",
        "title": "智慧安防：2026款传感器安装规范",
        "coverImage": "https://example.com/course.jpg",
        "currentTime": "08:45",
        "totalTime": "15:20",
        "progress": 50,
        "jumpUrl": "/learning/detail/{courseId}"
      }
    },
    "courseModules": [
      {
        "moduleType": "required",
        "sectionTitle": "岗位必修 (安装岗)",
        "sectionLink": "/learning/required",
        "courses": [
          {
            "id": "string",
            "title": "工业级网关部署规范",
            "coverImage": "https://example.com/course1.jpg",
            "duration": "45分钟",
            "label": "热门",
            "labelStyle": {
              "backgroundColor": "#4F46E5",
              "textColor": "#FFFFFF"
            },
            "jumpUrl": "/learning/detail/{courseId}"
          }
        ]
      },
      {
        "moduleType": "certificate",
        "sectionTitle": "专业证书",
        "sectionLink": "/learning/certificate",
        "courses": [
          {
            "id": "string",
            "title": "云端协同方案实操视频",
            "coverImage": "https://example.com/course2.jpg",
            "duration": "32分钟",
            "label": "新上线",
            "labelStyle": {
              "backgroundColor": "#059669",
              "textColor": "#FFFFFF"
            },
            "jumpUrl": "/learning/detail/{courseId}"
          }
        ]
      }
    ]
  }
}
```

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `code` | number | 是 | 响应状态码 |
| `message` | string | 是 | 响应消息 |
| `data.carousel` | object | 是 | 轮播图配置 |
| `data.continueLearning` | object | 否 | 继续学习模块 |
| `data.courseModules` | array | 是 | 课程模块列表 |

## 轮播图配置 (carousel)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `interval` | number | 是 | 轮播间隔(秒) |
| `items` | array | 是 | 轮播项列表 |

### 轮播项 (carousel.items[])

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 轮播项ID |
| `imageUrl` | string | 是 | 图片URL |
| `jumpUrl` | string | 是 | 跳转URL |

## 继续学习模块 (continueLearning)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `sectionTitle` | string | 是 | 模块标题 |
| `sectionLink` | string | 是 | 查看全部链接 |
| `course` | object | 否 | 继续学习课程 |

### 继续学习课程 (continueLearning.course)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 课程ID |
| `title` | string | 是 | 课程标题 |
| `coverImage` | string | 是 | 封面图URL |
| `currentTime` | string | 是 | 当前播放时间 |
| `totalTime` | string | 是 | 课程总时长 |
| `progress` | number | 是 | 播放进度百分比 (0-100) |
| `jumpUrl` | string | 是 | 跳转链接 |

## 课程模块列表 (courseModules)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `moduleType` | string | 是 | 模块类型 |
| `sectionTitle` | string | 是 | 模块标题 |
| `sectionLink` | string | 是 | 查看全部链接 |
| `courses` | array | 是 | 课程列表 |

### moduleType 枚举值

| 值 | 说明 |
|------|------|
| `required` | 岗位必修 |
| `certificate` | 专业证书 |

### 课程对象 (courseModules[].courses[])

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 课程ID |
| `title` | string | 是 | 课程标题 |
| `coverImage` | string | 是 | 封面图URL |
| `duration` | string | 是 | 课程时长 |
| `label` | string | 否 | 标签文本 |
| `labelStyle` | object | 否 | 标签样式配置 |
| `jumpUrl` | string | 是 | 跳转链接 |

### 标签样式 (labelStyle)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `backgroundColor` | string | 是 | 标签背景色 |
| `textColor` | string | 是 | 标签文字颜色 |

## 错误码说明

| code | 说明 |
|------|------|
| 200 | 成功 |
| 401 | 未授权 / Token 过期 |
| 500 | 服务器内部错误 |
