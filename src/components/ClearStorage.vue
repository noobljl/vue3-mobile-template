<!-- 隐藏在左右上角的清空缓存方法触点 -->
<template>
	<div class="clear-storage-container">
		<div
			class="clear-storage clear-left"
			id="clearDiv"
			@click="clearStorageLeft"
		></div>
		<div
			class="clear-storage clear-right"
			id="clearDiv"
			@click="clearStorageRight"
		></div>
		<div id="vconsole-input-field">
			<input type="text" v-model="vconsolePass" />
			<button @click="showVConsole">ok</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import router from "@/router"
import VConsole from "vconsole"

let vConsole = null

let clearLeft = false
let clearRight = false
const removeClearDiv = (e: any) => {
	if (e.target.id !== "clearDiv") {
		clearLeft = false
		clearRight = false
	}
}
window.addEventListener("click", removeClearDiv)
const clearStorageLeft = () => {
	clearLeft = true
	setTimeout(() => {
		clearLeft = false
	}, 1000)
	if (clearRight) {
		localStorage.clear()
		clearLeft = false
		clearRight = false
		router.replace("/")
	}
}
import.meta.env.MODE == "beta" && (vConsole = new VConsole())

const clearStorageRight = () => {
	clearRight = true
	setTimeout(() => {
		clearRight = false
	}, 1000)
	if (clearLeft) {
		if (vConsole) {
			vConsole.destroy()
			vConsole = null
			document.getElementById("vconsole-input-field").style.display = "none"
		} else {
			document.getElementById("vconsole-input-field").style.display = "block"
			if (
				document.getElementById("vconsole-input-field").style.display !== "none"
			) {
				setTimeout(() => {
					document.getElementById("vconsole-input-field").style.display = "none"
				}, 5000)
			}
		}
		clearLeft = false
		clearRight = false
	}
}

const vconsolePass = ref("")
const password = "kykjhz369clg."
const showVConsole = () => {
	if (vconsolePass.value === password) {
		vConsole = new VConsole()
		document.getElementById("vconsole-input-field").style.display = "none"
	}
}
</script>

<style lang="less" scoped>
.clear-storage-container {
	position: relative;
	z-index: 999998;
	.clear-storage {
		position: fixed;
		bottom: 0;
		width: 50px;
		height: 50px;
	}
	.clear-left {
		left: 0;
	}
	.clear-right {
		right: 0;
	}
	#vconsole-input-field {
		position: fixed;
		display: none;
		width: 80%;
		left: 10%;
		top: 50%;
		transform: translateY(-50%);
		z-index: 999999;
		input {
			border: 2px solid red;
			width: 80%;
		}
	}
}
</style>
