"use client";

import { useRef } from "react";
import { Assets, ChooseModal, ChooseModalRef } from "@nextcms/easy-upload/src";
import {
  deleteResource,
  getResourceCategory,
  getResourceList,
  uploadFiles
} from "@/services/admin/resource";

export default function Resource() {
  const chooseRef = useRef<ChooseModalRef>(null);
  return (
    <>
      <ChooseModal ref={chooseRef} />
      <Assets
        uploadRequest={async (params: any) => {
          const res = await uploadFiles(params);
          if (res.code == 1) {
            return {
              data: res.data,
              success: true
            };
          }
          return {
            success: false
          };
        }}
        listRequest={async (params: any) => {
          const res = await getResourceList(params);
          if (res.code == 1) {
            return {
              data: res.data.data,
              success: true,
              total: res.data.total
            };
          }
          return {
            success: false
          };
        }}
        deleteRequest={async (id: number) => {
          const res = await deleteResource(id);
          if (res.code == 1) {
            return {
              data: res.data,
              success: true
            };
          }
          return {
            success: false
          };
        }}
        categoryRequest={async (params: any) => {
          const res = await getResourceCategory(params);
          if (res.code == 1) {
            return {
              data: res.data,
              success: true
            };
          }
          return {
            success: false
          };
        }}
        uploadProps={{
          fieldNames: { label: "name", value: "id", children: "children" }
        }}
        categoryProps={{
          fieldNames: { title: "name", key: "id", children: "children" }
        }}
        colSpan={{
          span: 4
        }}
        pagination={{
          pageSize: 12
        }}
      />
    </>
  );
}
