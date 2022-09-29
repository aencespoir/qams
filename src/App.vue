<template>
	<div id="app">
		<a-config-provider :locale="zh_CN">
			<router-view />
		</a-config-provider>
	</div>
</template>

<style lang="less">
:root {
	// 红色
	--primaryColor: #ef4d5b;
	--primaryHoverColor: rgba(#ef4d5b, 0.1);
	// 绿色
	// --primaryColor: #0da157;
	// --primaryHoverColor: rgba(#0da157, 0.1);
	// 蓝色
	// --primaryColor: #008ed5;
	// --primaryHoverColor: rgba(#008ed5, 0.1);
}
#app {
	width: 100%;
	height: 100%;
	// background: #ebf0f2;
}
</style>
