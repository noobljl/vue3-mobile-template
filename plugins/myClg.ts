export default function () {
	return {
		name: "my-clg",
		transform(code, id) {
			if (id.endsWith("main.ts")) {
				return `${code}\nif (typeof window !== 'undefined'){
					const content = "骑在银龙背上！"
					console.log('%c' + content, 'color:red;font-size:26px;font-weight:bold;')
				}`
			}
			return code
		},
	}
}
