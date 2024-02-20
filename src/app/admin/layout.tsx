import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/model'
import SideNav from './ui/sidenav';


export default async function Layout(props: any) {
    const user = await getUser()
    const { children } = props
    return <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
            <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
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