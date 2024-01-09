import {
	createRouter,
	createWebHashHistory,
	type RouteRecordRaw,
} from "vue-router"
import itemCode from "@/api/itemCode"

const routes: Array<RouteRecordRaw> = [
	{ path: "/", redirect: { name: "Login" } },
	{
		path: "/login",
		name: "Login",
		component: () => import("@/views/login/index.vue"),
	},
	{
		path: "/home",
		name: "Home",
		component: () => import("@/views/home/index.vue"),
	},
	{
		path: "/order",
		name: "Order",
		component: () => import("@/views/order/index.vue"),
	},
	{
		path: "/error",
		name: "Error",
		component: () => import("@/views/error/index.vue"),
	},
]
const router = createRouter({
	history: createWebHashHistory(import.meta.env.VITE_BASE),
	routes,
})
router.afterEach((to, from) => {
	window.scrollTo(0, 0)
})
router.beforeEach((to, form, next) => {
	const token = localStorage.getItem(itemCode + "token")
	// if (to.path === "/error") {
	// 	next()
	// 	return
	// }
	if (token !== null) {
		if (to.path === "/login") {
			next("/home")
		} else {
			next()
		}
	} else {
		if (to.path !== "/login") {
			next("/login")
		} else {
			next()
		}
	}
})
export default router
