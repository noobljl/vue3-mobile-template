<template>
	<div
		class="drag-verify"
		ref="dragVerify"
		:style="{
			borderRadius: options.borderRadius,
			backgroundColor: drawBg,
		}"
	>
		<div
			class="slider"
			:style="{
				left: options.moveX + 'px',
				borderRadius: options.borderRadius,
				backgroundColor: slideBg,
			}"
			ref="slider"
			:draggable="true"
			@touchstart="touchstart"
			@touchmove="touchmove"
			@touchend="touchend"
		>
			<div class="arrow" v-if="!isSuccess">>></div>
			<div class="count_hook" v-else>√</div>
		</div>
		<div class="text">滑动滑块验证</div>
		<div
			class="drag-bg"
			ref="dragBg"
			:style="{
				width: options.dragBgWidth + 'px',
				backgroundColor: afterSlideDrawBg,
			}"
		>
			<div class="text" v-if="isSuccess">验证成功</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	// 圆角弧度
	borderRadius: {
		type: String,
		required: false,
		default: "",
	},
	// 滑道背景色
	drawBg: {
		type: String,
		required: false,
		default: "",
	},
	// 滑块背景色
	slideBg: {
		type: String,
		required: false,
		default: "#489D60",
	},
	// 滑块划过后的滑道背景色
	afterSlideDrawBg: {
		type: String,
		required: false,
		default: "#2f644b",
	},
})
const emit = defineEmits(["success"])
// 滑道ref
const dragVerify = ref()
// 滑块
const slider = ref()
// 滑道背景色
const dragBg = ref()
// 属性值
const options = reactive({
	// 手指的初始位置
	startX: 0,
	// 手指移动的距离
	moveX: 0,
	// 能够移动的最大距离
	maxX: 0,
	// 背景色宽度
	dragBgWidth: 0,
	// 圆角
	borderRadius: props.borderRadius,
})
// 是否成功
const isSuccess = ref(false)
// 点击
const touchstart = (e: any) => {
	options.startX = e.targetTouches[0].clientX
}
// 拖动
const touchmove = (e: any) => {
	if (!isSuccess.value) {
		e.preventDefault()
		fingerStep(e)
	}
}
// 停止拖动
const touchend = () => {
	if (options.moveX < options.maxX) {
		slider.value.style.transition = "left .3s"
		dragBg.value.style.transition = "width .5s"
		options.moveX = 0
		options.dragBgWidth = 0
	}
}
// 手指移动的距离
const fingerStep = (e: any) => {
	// 手指移动距离
	const clientX = e.targetTouches[0].clientX
	// 移动
	sliderMove(clientX)
}
// 滑块移动
const sliderMove = (clientX: number) => {
	// 清除动画
	slider.value.style.transition = "none"
	// 移动距离
	const moveX = clientX - options.startX
	// 右滑
	if (moveX > 0) {
		// 移动
		rightSlide(moveX)
		// 填充颜色
		fillBg(moveX)
	}
}
// 右滑
const rightSlide = (moveX: number) => {
	options.moveX = moveX
	// 最小阈值
	if (moveX <= 0) {
		options.moveX = 0
	}
	// 最大阈值
	else if (moveX >= options.maxX) {
		options.moveX = options.maxX
		slideSuccess()
	}
}
// 背景色填充
const fillBg = (moveX: number) => {
	dragBg.value.style.transition = "none"
	options.dragBgWidth = moveX + 50
}
// 能够移动的最大距离
const maxMove = () => {
	// 滑块宽度
	const slideW = slider.value.offsetWidth
	// 滑道宽度
	const dragW = dragVerify.value.offsetWidth
	// 可移动最大距离
	options.maxX = dragW - slideW
}
// 获取元素属性
const getStyle = () => {
	// 滑道高度
	const draw_h = dragVerify.value.offsetHeight
	// 设置圆角
	if (options.borderRadius == "") {
		options.borderRadius = draw_h / 2 + "px"
	}
}
// 滑块验证成功
const slideSuccess = () => {
	isSuccess.value = true
	emit("success")
}
onMounted(() => {
	maxMove()
	getStyle()
})
</script>
<style lang="scss" scoped>
.drag-verify {
	width: 100%;
	height: 100%;
	position: relative;
	font-size: 28px;
	color: #666666;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border: 1px solid #999;

	.slider {
		width: 157px;
		height: 100%;
		font-size: 36px;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 39px;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}

	.drag-bg {
		position: absolute;
		height: 100%;
		top: 0;
		left: 0;
		border-radius: 39px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 26px;
	}
}
</style>
