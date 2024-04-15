'use client'

import * as components from "web-material";

import ReactRender from "@zerocmf/lowcode-react-renderer/src";


const schema: any = {
  "componentName": "Page",
  "id": "node_dockcviv8fo1",
  "props": {
    "ref": "outerView",
    "style": {
      "height": "100%"
    }
  },
  "docId": "doclaqkk3b9",
  "fileName": "/",
  "dataSource": {
    "list": []
  },
  "state": {},
  "css": "",
  "lifeCycles": {
    "componentDidMount": {
      "type": "JSFunction",
      "value": "function componentDidMount() {\n  console.log('did mount');\n}",
      "source": "function componentDidMount() {\n  console.log('did mount');\n}"
    },
    "componentWillUnmount": {
      "type": "JSFunction",
      "value": "function componentWillUnmount() {\n  console.log('will unmount');\n}",
      "source": "function componentWillUnmount() {\n  console.log('will unmount');\n}"
    }
  },
  "methods": {},
  "originCode": "class LowcodeComponent extends Component {\n  state = {\n    \n  }\n  componentDidMount() {\n    console.log('did mount');\n  }\n  componentWillUnmount() {\n    console.log('will unmount');\n  }\n}",
  "hidden": false,
  "title": "",
  "isLocked": false,
  "condition": true,
  "conditionGroup": "",
  "children": [
    {
      "componentName": "Header",
      "id": "node_ocluw9z6ia1",
      "props": {},
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": "",
      "children": [
        {
          "componentName": "Container",
          "id": "node_ocluw9z6ia4",
          "props": {
            "fluid": false
          },
          "hidden": false,
          "title": "",
          "isLocked": false,
          "condition": true,
          "conditionGroup": "",
          "children": [
            {
              "componentName": "Navbar",
              "id": "node_ocluw9z6ia8",
              "props": {
                "brand": {
                  "type": "JSSlot",
                  "value": [
                    {
                      "componentName": "Div",
                      "id": "node_ocluw9z6ia7",
                      "props": {
                        "style": {
                          "display": "flex",
                          "flexDirection": "row",
                          "justifyContent": "flex-start",
                          "alignItems": "center"
                        }
                      },
                      "hidden": false,
                      "title": "",
                      "isLocked": false,
                      "condition": true,
                      "conditionGroup": "",
                      "children": [
                        {
                          "componentName": "Image",
                          "id": "node_ocluw9z6ia5",
                          "props": {
                            "src": "https://aimg8.dlszyht.net.cn/module/simplepic/1436296/993/1985315_1493263713.png?x-oss-process=image/resize,m_fixed,w_59,h_58,limit_0",
                            "width": "",
                            "height": "",
                            "alt": "logo"
                          },
                          "hidden": false,
                          "title": "",
                          "isLocked": false,
                          "condition": true,
                          "conditionGroup": ""
                        },
                        {
                          "componentName": "Title",
                          "id": "node_ocluw9z6ia6",
                          "props": {
                            "children": "Handicraf",
                            "level": 1,
                            "style": {
                              "marginBottom": "0px",
                              "marginLeft": "10px",
                              "fontSize": "24px"
                            }
                          },
                          "hidden": false,
                          "title": "",
                          "isLocked": false,
                          "condition": true,
                          "conditionGroup": ""
                        }
                      ]
                    }
                  ],
                  "title": "插槽容器"
                },
                "menuAlign": "right",
                "menu": {
                  "type": "JSSlot",
                  "value": [
                    {
                      "componentName": "Menu",
                      "id": "node_ocluw9z6iae",
                      "props": {
                        "fontSize": "16",
                        "color": "#000000",
                        "hoverColor": "#1677ff",
                        "bgColor": "",
                        "items": [
                          {
                            "label": "首页"
                          },
                          {
                            "label": "关于我们"
                          },
                          {
                            "label": "产品中心"
                          },
                          {
                            "label": "新闻中心"
                          },
                          {
                            "label": "联系我们"
                          }
                        ]
                      },
                      "hidden": false,
                      "title": "",
                      "isLocked": false,
                      "condition": true,
                      "conditionGroup": ""
                    }
                  ]
                }
              },
              "hidden": false,
              "title": "",
              "isLocked": false,
              "condition": true,
              "conditionGroup": ""
            }
          ]
        }
      ]
    },
    {
      "componentName": "Main",
      "id": "node_ocluw9z6ia2",
      "props": {},
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "Footer",
      "id": "node_ocluw9z6ia3",
      "props": {},
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    }
  ]
}

export default function Home() {
  return (
    <>
      <h1>hello next.js</h1>
      <ReactRender schema={schema} components={components} />
    </>
  );
}
