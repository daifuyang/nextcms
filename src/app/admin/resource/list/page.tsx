"use client";

import { useRef } from "react";
import { Assets, ChooseModal, ChooseModalRef } from "@nextcms/easy-upload/src";
import { getResourceList, uploadFiles } from "@/services/admin/resource";

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
        listRequest={async () => {
          const res = await getResourceList();
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
      />
    </>
  );
}
