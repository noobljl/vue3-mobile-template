<template>
	<div class="login-container rootPageDiv">
		<van-overlay
			:show="showOverlay"
			:custom-style="{ opacity: 0.5 }"
			duration="0"
		/>
		<div class="top">
			<img src="@/assets/img/login_img_bg@2x.jpg" alt="" class="banner-img" />
			<div class="hello-welcome">
				<div class="hello-text">您好</div>
				<div class="welcome">
					<img
						src="@/assets/img/login_img_dialogbox@2x.png"
						alt=""
						class="welcome-img"
					/>
					<div class="welcome-text">欢迎使用</div>
				</div>
			</div>
			<div class="use-login">
				{{ countDown ? "短信验证码已发送至" + hidePhone : "请使用手机号登录" }}
			</div>
		</div>
		<div class="bottom">
			<div class="login-form">
				<!-- 手机号部分 -->
				<div class="form-part">
					<div class="phone-title">手机号</div>
					<div class="phone-input">
						<input
							v-model="phone"
							type="text"
							oninput="value=value.replace(/[^\d]/g,'')"
							placeholder="请输入您的手机号"
							maxlength="11"
							class="input-field"
						/>
						<img
							v-if="phone"
							src="@/assets/img/login_icon_delete@2x.png"
							alt=""
							class="clear-icon"
							@click="phone = ''"
						/>
					</div>
				</div>
				<!-- 图形验证码部分 -->
				<!-- <div class="form-part">
					<div class="phone-title">图形验证码</div>
					<div class="phone-input">
						<input
							v-model="inputRandomCode"
							type="text"
							placeholder="请输入图形验证码答案"
							maxlength="11"
							class="input"
						/>
						<random-code
							class="RandomCode"
							@randomSuccess="randomSuccess"
							:errorNum="errorNum"
						></random-code>
					</div>
				</div> -->
				<!-- 验证码部分 -->
				<div class="form-part">
					<div class="phone-title">验证码</div>
					<div class="phone-input">
						<input
							v-model="smsCode"
							type="text"
							placeholder="请输入您的验证码"
							maxlength="6"
							class="input-field"
						/>
						<div class="clear-icon get-sms" @click="getMsgCode">
							{{ countDown ? `${countDown}s` : "获取验证码" }}
						</div>
					</div>
				</div>
				<div
					class="login-btn"
					:class="phone && smsCode && 'login-btn-able'"
					@click="login"
				>
					登录
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import router from "@/router"
import {
	API_Login,
	API_GetMsgCode,
	API_GetStock,
	API_QueryOpenId,
	API_GetOpenId,
} from "@/api/user"
import {
	randomCodeVerification,
	phoneVerification,
	msgCodeVerification,
} from "@/utils/verification"
import { debounce } from "@/utils/debounceThrottle"
import itemCode from "@/api/itemCode"
import RandomCode from "@/components/RandomCode.vue"
import { Base64 } from "js-base64"
// import { areaLimit } from "@/utils/areaLimit"
const $toast: any = inject("$toast")
//地区限制
// let areaLimitVisible = false
//用户手机号
const phone = ref<string>("")
//短息验证码
const smsCode = ref<string>("")
//输入的图形验证码
const inputRandomCode = ref<string>("")
//生成的图形验证码
const randomCode = ref<string>("")
//获取验证码 倒计时
const countDown = ref<number>(0)
//图形验证码错误次数
const errorNum = ref<number>(0)
//倒计时timer
const timer = ref<any>(null)
// 禁止点击遮罩层
const showOverlay = ref<boolean>(true)

//接收生成的随机数
const randomSuccess = (randomNum: string) => {
	randomCode.value = randomNum
	// localStorage.setItem("abc", window.btoa(randomNum))
}

const userOpenid = ref<string>("")
// 查是否有openid
const queryOpenId = async () => {
	const { code, data } = await API_QueryOpenId({ itemCode })
	if (code == 0) {
		// 如果没有openid，去获取
		if (data.userOpenid) {
			userOpenid.value = data.userOpenid
			showOverlay.value = false
			getStock()
		} else {
			getOpenId()
		}
	}
}

// 获取openid
const getOpenId = async () => {
	const { code, data } = await API_GetOpenId({
		itemCode,
		redirectUrl: Base64.encode(
			import.meta.env.MODE == "development"
				? "http://192.168.1.7:8080/#/login"
				: import.meta.env.VITE_BASE_URL + "#/login"
		),
	})
	if (code == 0) {
		window.location.replace(data)
		userOpenid.value = data.userOpenid
	}
}

// 获取库存
const getStock = async () => {
	const { code, data } = await API_GetStock({ itemCode })
	if (code == 0) {
		// 1=活动开启，0=活动维护中
		if (!data.activityStatus) {
			showOverlay.value = true
			return $toast("维护中！", "fail")
		}
		// true = 没有库存，直接提示奖品已领完，不让用户输入手机号，false为奖品未领完
		if (data.activityKc) {
			showOverlay.value = true
			return $toast("奖品已领完！", "fail")
		}
		showOverlay.value = false
		// areaLimitInit()
	}
}

const verify = () => {
	if (showOverlay.value) {
		return false
	}
	// if (!areaLimitVisible) {
	// 	$toast("您所在地区不可以参与此活动", "fail")
	// return  false
	// }

	//手机号校验格式
	const phoneFormat = phoneVerification(phone.value)
	if (!phoneFormat) return false
	//图形验证码格式校验
	// const randomCodeFormat = randomCodeVerification(
	// 	inputRandomCode.value,
	// 	randomCode.value
	// )
	// if (!randomCodeFormat) {
	// 	//输错次数+1
	// 	errorNum.value += 1
	// 	//清空输入框
	// 	inputRandomCode.value = ""
	// 	return false
	// }
	return true
}

// 已获取验证码的手机号，用来校验是否获取过验证码
let getSmsCount = ""
// 掩码手机号
const hidePhone = ref("")
//获取短信验证码
const getMsgCode = debounce(async () => {
	if (countDown.value) return
	if (!verify()) return
	const { code, data } = await API_GetMsgCode({
		phone: phone.value,
		itemCode: itemCode,
	})

	if (code === 0) {
		countDown.value = 60
		timer.value = setInterval(() => {
			countDown.value--
			if (!countDown.value) {
				clearInterval(timer.value)
			}
		}, 1000)
		getSmsCount = phone.value
		// 掩码手机号
		hidePhone.value =
			phone.value.substring(0, 3) +
			"****" +
			phone.value.substring(phone.value.length - 4)
		return $toast("获取验证码成功！", "success")
	}
}, 500)

//登录
const login = debounce(async () => {
	if (!verify() || !smsCode.value) return
	if (getSmsCount !== phone.value) {
		return $toast("请先获取验证码", "fail")
	}
	//短信验证码格式校验
	const msgCodeFormat = msgCodeVerification(smsCode.value)
	if (!msgCodeFormat) {
		errorNum.value += 1
		inputRandomCode.value = ""
		return
	}
	const { code, data } = await API_Login({
		itemCode,
		phone: phone.value,
		smsCode: smsCode.value,
		openId: userOpenid.value,
	})
	if (code !== 0) return
	localStorage.setItem("phone", phone.value)
	localStorage.setItem(itemCode + "token", data.token)
	router.replace("/home")
}, 500)

//判断地区
// const areaLimitInit = () => {
// 	//校验地区限制
// 	areaLimit().then((res: any) => {
// 		areaLimitVisible = res
// 		res ? queryOpenId() : (showOverlay.value = true)
// 	})
// }
const init = () => {
	queryOpenId()
	// getStock()
}
init()

onUnmounted(() => {
	clearInterval(timer.value)
})
</script>
<style lang="less" scoped>
.login-container {
	.top {
		position: relative;
		.banner-img {
			position: absolute;
			top: 0;
			display: block;
			width: 100%;
		}
		.hello-welcome {
			position: absolute;
			display: flex;
			align-items: end;
			left: 73px;
			top: 97px;
			.hello-text {
				font-size: 62px;
				font-weight: bold;
				line-height: 62px;
			}
			.welcome {
				position: absolute;
				left: 127px;
				height: 62px;
				.welcome-img {
					width: 201px;
				}
				.welcome-text {
					position: absolute;
					left: 36px;
					top: 50%;
					transform: translateY(-50%);
					font-size: 34px;
					font-weight: bold;
					color: #fff;
				}
			}
		}
		.use-login {
			position: absolute;
			top: 188px;
			left: 73px;
			font-size: 36px;
		}
	}
	.bottom {
		display: flex;
		justify-content: center;
		position: absolute;
		top: 318px;
		background-color: #fff;
		width: 100%;
		border-radius: 40px;
		.login-form {
			margin-top: 65px;
			width: 609px;
			.form-part {
				position: relative;
				margin-top: 76px;
				&:first-of-type {
					margin-top: 0;
				}
			}
			.phone-title {
				font-size: 36px;
				font-weight: bold;
			}
			.phone-input {
				display: flex;
				align-items: center;
				margin-top: 40px;
				font-size: 32px;
				width: 100%;
				border-bottom: 1px solid #f3f3f3;
				padding-bottom: 27px;
				.input-field {
					border: none;
					margin-left: -5px;
					width: 100%;
					&::placeholder {
						color: #9f9f9f;
					}
				}
			}
			.clear-icon {
				position: absolute;
				right: 0;
				width: 30px;
			}
			.get-sms {
				color: #f54240;
				font-size: 28px;
				width: fit-content;
			}
			.login-btn {
				width: 100%;
				margin-top: 91px;
				background: linear-gradient(to right, #ffc9b6, #ffa9aa);
				border-radius: 45px;
				height: 90px;
				text-align: center;
				line-height: 90px;
				color: #fff;
				font-size: 36px;
			}
			.login-btn-able {
				background: linear-gradient(to right, #ff936d, #ff5355);
			}
		}
	}
}
</style>
