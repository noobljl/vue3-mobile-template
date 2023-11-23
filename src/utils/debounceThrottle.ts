import $toast from "@/utils/toast"

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number
) {
	let timer: ReturnType<typeof setTimeout> | null = null
	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (timer !== null) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			func.apply(this, args)
			timer = null
		}, delay)
	}
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	delay: number
) {
	let timer: ReturnType<typeof setTimeout> | null = null
	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (timer === null) {
			timer = setTimeout(() => {
				func.apply(this, args)
				timer = null
			}, delay)
		}
	}
}
