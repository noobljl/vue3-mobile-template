<template>
	<div class="home-container">
		<van-overlay
			:show="showPopup || showRule"
			:custom-style="{ opacity: 0.5 }"
			duration="0"
		/>
		<img src="@/assets/img/home_img_bg@2x.jpg" alt="" class="bg-img" />
		<img
			src="@/assets/img/home_img_title@2x.png"
			alt=""
			class="banner-img center-class"
		/>
		<img
			src="@/assets/img/home_img_broadside@2x.png"
			alt=""
			class="aside rule-img"
			@click="clickRule"
		/>
		<img
			src="@/assets/img/home_img_broadside01@2x.png"
			alt=""
			class="aside record-img"
			@click="router.push('/order')"
		/>
		<img
			:src="activityNum ? btnImg : btnDisImg"
			alt=""
			class="btn center-class"
			@click="receive"
		/>
		<popup v-if="showPopup" title="领取成功" @closePop="showPopup = false">
			<template #content>
				<div class="congrats">恭喜你获得</div>
				<div class="prize">15元微信立减金</div>
			</template>
			<template #button>
				<div class="pop-button" @click="showPopup = false">开心收下</div>
			</template>
		</popup>
		<popup v-if="showRule" title="活动规则" @closePop="showRule = false">
			<template #content>
				<div class="rule-content">
					<div>
						1.活动仅限衢州地区使用企业手机银行参与非登陆交易的企业客户参与。
					</div>
					<div>
						2.每个手机号码最多领取3次，微信立减金礼品数量有限，每日全市名额共50名，先到先得，发完即止。
					</div>
					<div>
						3.所领取的微信立减金是工行借记卡可用的通用立减金，15元立减金需用户使用工行借记卡绑定微信支付在消费时满15.01元使用。微信立减金自获得之日起7天内有效，逾期未使用将视为自动放弃，不予补发
					</div>
					<div>
						4.兑换成功的微信立减金会以卡券形式存入用户微信卡包中，可前往“微信-我-卡包-券与礼品卡”查看
					</div>
					<div>
						5.微信立减金在所有具备微信支付功能的微信商户均可使用（转账理财等部分商户除外），使用微信支付绑定工行借记卡消费即可抵扣。支付时需使用微信支付，并选择使用立减金付款，立减金可叠加使用（支付金额需大于立减金额）
					</div>
				</div>
			</template>
		</popup>
	</div>
</template>

<script lang="ts" setup>
import router from "@/router"
import btnImg from "@/assets/img/home_btn_enter_normal@2x.png"
import btnDisImg from "@/assets/img/home_btn_enter_disabled@2x.png"
import itemCode from "@/api/itemCode"
import Popup from "@/components/Popup.vue"
import { API_GetActivityNum, API_Receive } from "@/api/activity"
const $toast: any = inject("$toast")

// 领取成功弹窗状态
const showPopup = ref(false)
// 规则弹窗状态
const showRule = ref(false)

const clickRule = () => {
	showRule.value = true
}

const activityNum = ref(0)
const getActivityNum = async () => {
	const { code, data } = await API_GetActivityNum()
	if (code == 0) {
		activityNum.value = data
	}
}
const receive = async () => {
	if (!activityNum.value) {
		return $toast("无参与次数！", "fail")
	}
	let issuePhone = localStorage.getItem("phone")
	const { code, data } = await API_Receive({ issuePhone, itemCode })
	if (code == 0) {
		showPopup.value = true
		getActivityNum()
	}
}

const init = () => {
	getActivityNum()
}
init()
</script>

<style lang="less" scoped>
.home-container {
	.bg-img {
		width: 100%;
		display: block;
	}
	.banner-img {
		position: absolute;
		top: 74px;
		width: 606px;
	}
	.aside {
		position: absolute;
		right: 0;
		width: 48px;
	}
	.rule-img {
		top: 235px;
	}
	.record-img {
		top: 347px;
	}
	.btn {
		position: absolute;
		width: 468px;
		top: 1183px;
	}
	.congrats {
		margin-top: -50px;
		text-align: center;
		font-size: 32px;
		font-weight: bold;
	}
	.prize {
		margin-top: 29px;
		text-align: center;
		font-size: 30px;
		color: #f54240;
	}
	.pop-button {
		margin-top: 52px;
		font-size: 32px;
		font-weight: bold;
		color: #fff;
		width: 442px;
		height: 86px;
		line-height: 86px;
		text-align: center;
		background-image: linear-gradient(to right, #ff9372, #fa4524);
		border-radius: 43px;
	}
	.rule-content {
		margin-left: 50%;
		transform: translateX(-50%);
		height: 624px;
		overflow: scroll;
		width: 502px;
		font-size: 26px;
		color: #4f4d4f;
		line-height: 41px;
	}
}
</style>
