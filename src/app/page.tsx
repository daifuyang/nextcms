'use client'

import {} from 'react'

import ReactRender from "@zerocmf/lowcode-react-renderer/src";


const components: any = {
  // Page: (props) => {
  //   console.log('props',props)
  //   return <div>hello page  </div>;
  // },
  Button: ({children}) => {
    return <button>button:{children}</button>;
  }
}

const schema: any = {
  "componentName": "Page",
  "id": "node_dockcviv8fo1",
  "props": {
    "ref": "outerView",
    "style": {
      "height": "100%"
    }
  },
  "fileName": "/",
  "dataSource": {
    "list": [
      {
        "type": "fetch",
        "isInit": true,
        "options": {
          "params": {},
          "method": "GET",
          "isCors": true,
          "timeout": 5000,
          "headers": {},
          "uri": "mock/info.json"
        },
        "id": "info",
        "shouldFetch": {
          "type": "JSFunction",
          "value": "function() { \n  console.log('should fetch.....');\n  return true; \n}"
        }
      }
    ]
  },
  "state": {
    "text": {
      "type": "JSExpression",
      "value": "\"outer\""
    },
    "isShowDialog": {
      "type": "JSExpression",
      "value": "false"
    }
  },
  "css": "body {}",
  "lifeCycles": {
    "componentDidMount": {
      "type": "JSFunction",
      "value": "function componentDidMount() {\n  console.log('did mount');\n}"
    },
    "componentWillUnmount": {
      "type": "JSFunction",
      "value": "function componentWillUnmount() {\n  console.log('will unmount');\n}"
    }
  },
  "methods": {
    "testFunc": {
      "type": "JSFunction",
      "value": "function testFunc() {\n  console.log('test func');\n}"
    },
    "onClick": {
      "type": "JSFunction",
      "value": "function onClick() {\n  this.setState({\n    isShowDialog: true\n  });\n}"
    },
    "closeDialog": {
      "type": "JSFunction",
      "value": "function closeDialog() {\n  this.setState({\n    isShowDialog: false\n  });\n}"
    }
  },
  "originCode": "class LowcodeComponent extends Component {\n  state = {\n    \"text\": \"outer\",\n    \"isShowDialog\": false\n  }\n  componentDidMount() {\n    console.log('did mount');\n  }\n  componentWillUnmount() {\n    console.log('will unmount');\n  }\n  testFunc() {\n    console.log('test func');\n  }\n  onClick() {\n    this.setState({\n      isShowDialog: true\n    })\n  }\n  closeDialog() {\n    this.setState({\n      isShowDialog: false\n    })\n  }\n}",
  "hidden": false,
  "title": "",
  "isLocked": false,
  "condition": true,
  "conditionGroup": "",
  "children": [
    {
      "componentName": "Button",
      "id": "node_oclsod3cxg1",
      "props": {
        "type": "primary",
        "children": "主按钮",
        "htmlType": "button",
        "size": "middle",
        "shape": "default",
        "block": false,
        "danger": false,
        "ghost": false,
        "disabled": false
      },
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
