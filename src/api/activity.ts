import { get, post } from "../request"

//用户抽奖
export const API_Receive = (params: any) => post("/entrance/receive", params)

// 获取活动次数
export const API_GetActivityNum = () => post("/entrance/get/activity/num")

//订单列表
export const API_OrderList = () => post("/order/info")
