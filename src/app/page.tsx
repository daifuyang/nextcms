import { getPage } from "@/services/app/page"
import { getConfig } from "@/services/app/config"

import ReactRender from './ReactRender'


export default async function Home() {

  // 获取首页
  const configRes = await getConfig('homePage')
  if(configRes.code === 0) {
    throw(configRes.msg)
  }

  console.log("configRes",configRes.data.value)

  const homeId = configRes.data.value

  const res = await getPage(homeId)
  if(res.code === 0) {
    throw(res.msg)
  }

  return <ReactRender schema={res.data.schema} />
}
