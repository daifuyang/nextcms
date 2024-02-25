"use client"

import { useLayoutEffect, useState } from 'react'
import styles from './root.module.scss'
import { Spin } from 'antd'
import withTheme from '../theme'


const Root = function Root(props: any) {

    const [loading, setLoading] = useState(true)

    useLayoutEffect(() => {
        setLoading(false)
    }, [])

    const { children } = props

    if (loading) {
        return (
            <Spin spinning={loading} tip="加载中...">
                <div className={styles.root}></div>
            </Spin>
        )
    }

    return (
        <div className={styles.root}>
            {children}
        </div>
    )
}

const RootPage = (props: any) => {
    return withTheme(<Root {...props} />);
}

export default RootPage