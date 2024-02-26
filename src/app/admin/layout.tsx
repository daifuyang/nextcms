import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Layout as AntdLayout } from 'antd';
import Root from './ui/root'
import SiderNav from './ui/sider'
import Header from './ui/header'
import Content from './ui/content';
import prisma from '@/model'


export default async function Layout(props: any) {
    const user = await getUser()
    const { children } = props
    return (
        <Root>
            <AntdLayout>
                <Header />
                <AntdLayout>
                    <SiderNav />
                    <AntdLayout>
                        <Content>
                            {children}
                        </Content>
                    </AntdLayout>
                </AntdLayout>
            </AntdLayout>
        </Root>
    )
}

async function getUser() {
    const token = cookies().get('token')?.value
    if (token) {
        const tokenObj = JSON.parse(token)
        if (tokenObj.accessToken) {
            const usereToken = await prisma.cmsUserToken.findFirst({
                where: {
                    accessToken: tokenObj.accessToken,
                    expiry: {
                        gt: new Date() // 没有失效 
                    }
                }
            })
            if (usereToken?.userId) {
                const user = await prisma.cmsUser.findFirst({
                    where: {
                        id: usereToken?.userId
                    }
                })
                return user
            }
        }
    }
    redirect('/login')
}