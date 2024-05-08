import dayjs from "dayjs";

export type modelDateTime = {
    createdTime?: string
    updatedTime?: string
}

const format = "YYYY-MM-DD HH:mm:ss"

export function widthDateTime( target: any , item: any) {
    if (item.createdAt) {
        target.createdTime = dayjs.unix(item.createdAt).format(format);
      }
  
      if (item.updatedAt) {
        target.updatedTime = dayjs.unix(item.updatedAt).format(format);
      }
}