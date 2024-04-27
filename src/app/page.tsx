import { getPage } from "@/services/app/page"
import { getConfig } from "@/services/app/config"

import ReactRender from './ReactRender'
import { notFound } from "next/navigation"


export default async function Home() {
  // 获取首页
  const configRes = await getConfig('homePage')
  if(configRes.code === 0) {
    throw(configRes.msg)
  }

  const homeId = configRes.data?.value || 1
  const res = await getPage(homeId)
  if(res.code === 0) {
    notFound()
  }

  return <ReactRender schema={res.data.schema} />
}
