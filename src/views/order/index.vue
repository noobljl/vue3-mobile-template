<template>
	<div class="order-container">
		<div class="back-icon">
			<img
				src="@/assets/img/icon_back@2x.png"
				alt=""
				@click="goBack"
				class="left-arrow"
			/>
		</div>
		<div class="empty" v-if="orderList.length <= 0">
			<Empty class="empty-icon center-class" description="暂无记录"></Empty>
		</div>
		<div v-else class="order-card-container">
			<div class="order-card" v-for="item in orderList">
				<div class="card-top">
					<div class="order-no">订单编号：{{ item.orderNo }}</div>
					<div class="status" :class="item.grantStatus ? 'success' : 'fail'">
						{{ item.grantStatus ? "领取成功" : "领取失败" }}
					</div>
				</div>
				<div class="order-body">
					<img
						src="@/assets/img/img_thumbnail@2x.png"
						alt=""
						class="good-img"
					/>
					<div class="body-right">
						<div class="good-name">{{ item.prizeSubName }}</div>
						<div class="create-time">
							领取时间：{{
								dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")
							}}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import router from "@/router"
import { Empty } from "vant"
import dayjs from "dayjs"
import { API_OrderList } from "@/api/activity"

const goBack = () => {
	router.back()
}
const orderList = reactive<any[]>([])
// 获取奖品列表
const getOrderList = async () => {
	orderList.length = 0
	const { code, data } = await API_OrderList()
	if (code == 0) {
		orderList.push(...data)
	}
}

const init = () => {
	getOrderList()
}
init()
</script>

<style lang="less" scoped>
.order-container {
	background-color: #f5f5f5;
	.back-icon {
		position: fixed;
		background-color: #f5f5f5;
		width: 100vw;
		height: 77px;
		line-height: 77px;
		.left-arrow {
			margin-left: 25px;
			margin-top: 25px;
			width: 16px;
		}
	}
	.empty {
		height: 100vh;
		background-color: #f5f5f5;

		.empty-icon {
			width: 300px;
			font-size: 28px;
			text-align: center;
			margin-top: 118px;
		}
	}
	.order-card-container {
		background-color: #f5f5f5;
		height: calc(100vh - 77px - 50px);
		overflow: auto;
		padding: 30px;
		padding-top: 77px;
		padding-bottom: 50px;
		display: flex;
		flex-direction: column;
		gap: 40px;
	}
	.order-card {
		width: 100%;
		background-color: #fff;
		border-radius: 20px;
		box-sizing: border-box;
		padding: 18px 21px 25px 21px;

		.card-top {
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding-bottom: 11px;
			font-size: 28px;
			color: #666;
			.order-no {
				color: #666;
			}
			.fail {
				color: #f54240;
			}
			.success {
				color: #2e2e2e;
			}
		}

		.order-body {
			display: flex;
			align-items: center;
			margin-top: 39px;

			.good-img {
				width: 100px;
				display: block;
			}

			.body-right {
				margin-left: 42px;
				line-height: 42px;

				.good-name {
					font-size: 28px;
					color: #2e2e2e;
				}
				.create-time {
					font-size: 24px;
					color: #999;
				}
			}
		}
	}
}
</style>
