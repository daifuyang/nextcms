import { request } from '@/utils/request';
import ReactRenderCore from './ReactRenderCore'

export default async function ReactRender(props: any) {
    const { schema = {} } = props;
    const { dataSource = {} } = schema
    const apiList = dataSource?.list || []
    const state = await fetchData(apiList)

    schema.state = {...schema.state, ...state}
    
    return <ReactRenderCore {...props} />
}

export async function fetchData(apiList = []) {
    const state: any = {}
    for (let index = 0; index < apiList.length; index++) {
        const item: any = apiList[index];
        if (item.type === 'editor') {
            const { options } = item;
            const response: any = await request.instance({
                ...options,
                url: options.uri,
                method: options.method,
                data: options.params,
                headers: options.headers,
            })

            const res = response.data

            if (response.status === 200) {
                state[item.id] = {
                    type: 'JSExpression',
                    value: JSON.stringify(res.data)
                }
            }
        }
    }
    return state
}