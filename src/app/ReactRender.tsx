import { request } from '@/utils/request';
import ReactRenderCore from './ReactRenderCore'

export default async function ReactRender(props: any) {
    const { schema = {} } = props;
    const { dataSource = {} } = schema
    const apiList = dataSource?.list || []
    // await fetchData(apiList)
    return <ReactRenderCore {...props} />
}

export function fetchData(apiList = []) {
    const promises: any = []
    apiList.forEach((item: any) => {
        if (item.type === 'editor') {
            const { url, method, params, data } = item.options;
            const promise = request.instance({
                url,
                method,
                params,
                data,
            }).then((res) => {
                // console.log('请求结果', res);
                return res.data;
            })
            promises.push(promise);
        }
    })

    Promise.all(promises)
        .then(results => {
            console.log('所有请求完成', results);
            // 处理每个请求的结果
        })
        .catch(error => {
            console.error('至少有一个请求失败', error);
        });

}