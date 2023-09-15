<script setup>
	import { ref, reactive, computed, watch, unref, onMounted } from 'vue';
	import cursorUrl from '@/assets/cursor.svg';
	const initialValue = Array(19)
		.fill()
		.map(() =>
			Array(19)
				.fill()
				.map(() => null)
		);

	const array = ref([...initialValue]);
	// console.log(array);

	// 总共下了多少次
	const times = ref(0);

	// 当前下的一方 ：黑子/白子
	const currentSide = computed(() => times.value % 2);

	// 下棋事件
	const append = (i, j) => {
		// 该位置已下过 则直接退出事件
		if (array.value[i][j] !== null) return;

		times.value++;

		array.value[i][j] = currentSide.value;
		// dialog.value.showModal();
		checkWin();
	};

	// 胜利的一方
	const winName = ref('');

	const dialog = ref(null);

	// 判断是否胜利
	const checkWin = (i, j) => {
		// 遍历整个二维数组，看是否存在近5项为0或1
		let xList = [];
		let yList = [];

		for (let i = 0; i < array.value.length; i++) {
			const x = array.value[i];

			let flag = false;
			for (let j = 0; j < x.length; j++) {
				const y = x[j];
				if (y === null) continue;

				// 垂直方向的判断
				if (yList.length) {
					if (yList.at(-1) === y) yList.push(y);
					else yList = [y];
				} else {
					yList.push(y);
				}

				// 水平方向的判断
				// if (xList.length) {
				// 	if (xList.at(-1) === y) xList.push(y);
				// 	else xList = [y];
				// } else {
				// 	xList.push(y);
				// }

				if (yList.length > 4) {
					console.log('获胜了');
					flag = true;
					break;
				}
			}

			if (flag) break;
		}
		if (yList.length > 4) {
			winName.value = yList[0] ? '黑子' : '白子';
			dialog.value.showModal();
			// setTimeout(() => {
			// 	restart();
			// }, 3000);
		}
	};

	const checkWinByX = () => {
		const x = array.value;
	};

	// 重新开始
	const restart = () => {
		location.reload();
		times.value = 0;
		array.value = unref(array);
	};

	const cursor = ref(null);

	let lastX = 0;
	let lastY = 0;

	const cursorStyle = reactive({});
	const handleMouseenter = ({ fromElement }) => {
		const { offsetLeft, offsetTop } = fromElement;
		console.log(offsetLeft);
		console.log(offsetLeft - lastX);

		const offsetX = offsetLeft - lastX > 0 ? 40 : -40;

		cursorStyle.left = offsetLeft + 'px';
		cursorStyle.top = offsetTop + 'px';

		lastX = offsetLeft;
	};
	// const handleMouseenter = (even) => {
	// 	console.log(even);
	// };
</script>
<template>
	<main
		ref="main"
		class="flex relative"
	>
		<div
			ref="cursor"
			class="cursor absolute z-30 w-40 h-40"
			:style="cursorStyle"
		>
			<!-- <img
				class="w-full"
				src="@/assets/cursor.svg"
				alt=""
			/> -->
		</div>
		<ul v-for="i in 19">
			<li
				@mouseenter="handleMouseenter"
				@click="append(i - 1, j - 1)"
				class="w-40px h-40px relative cursor-none"
				v-for="j in 19"
			>
				<div
					v-show="array[i - 1][j - 1]"
					class="chessman bg-black"
				></div>
				<div
					v-show="array[i - 1][j - 1] === 0"
					class="chessman bg-gray"
				></div>
			</li>
		</ul>
	</main>

	<footer>
		<button
			@click="restart"
			class="px-10 py-6 bg-#3e68d7 border-0 rounded-4 text-white cursor-pointer"
		>
			重新开始
		</button>
	</footer>

	<dialog
		ref="dialog"
		@click="
			({ target }) => {
				if (target.nodeName === 'DIALOG') dialog.close();
			}
		"
	>
		<p>{{ winName }}获胜！</p>
	</dialog>
</template>
<style lang="scss">
	html {
		font-size: 4px;
	}
	.cursor {
		background: url('@/assets/cursor.png');
		background-size: cover;
	}
	dialog {
		width: 30%;
		padding: 0;
		padding: 2rem;
		outline: none;
		border: none;
		p {
			text-align: center;
			font-size: 20px;
			line-height: 140px;
		}
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}
	main,
	main * {
		cursor: none;
		// cursor: url('@/assets/cursor.png'), auto !important;
		// cursor: url('cursor.svg'), auto !important;
	}
	#app {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		flex-direction: column;
		gap: 50px;
		align-items: center;
	}
	main {
		position: relative;
		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			left: -5px;
			top: -5px;
			border-radius: 5px;
			border: 5px solid #d39254;
		}
	}
	li {
		position: relative;
		z-index: 1;
	}
	li::before,
	li::after {
		content: '';
		display: block;
		position: absolute;
		width: 100%;
		height: 1px;
		background-color: #fbbf24;
		left: 0%;
		top: 50%;
	}
	li::after {
		transform: rotate(90deg);
	}

	// 棋子样式
	.chessman {
		@apply w-90% h-90%  rounded-50 absolute top-0 left-0px z-2;
	}
</style>
