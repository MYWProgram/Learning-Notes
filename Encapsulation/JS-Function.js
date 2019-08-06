/**
 * 常用JS函数的封装
 */



/**
 * 根据ID获取元素
 */
function my$(id) {
	return document.getElementById(id);
};



/**
 * 获取任意一个元素的任意一个属性值的当前值(兼容IE8)
 */
// element表示当前的元素,attr表示需要获取的元素的属性值
function getStyle(element, attr) {
	return window.getComputedStyle ? window.getComputedStyle(element, null)[attr] : element.currentStyle[attr] || 0;
};



/**
 * 变速动画函数
 */
function animateSpeedChange(element, json, fn) {
	// 首先清理这个定时器,防止上一次定时器遗留
	clearInterval(element.timeId);
	element.timeId = setInterval(function () {
		// 设置一个布尔值默认为true,假设所有的属性及值已经改变完成
		// var flag = true;
		// 遍历json对象中多个元素以及元素对应的属性值
		for (var attr in json) {
			// 判断这个元素的属性值是不是透明度
			if (attr === "opacity") {
				// 获取元素当前的透明度值放大100倍方便计算
				var current = getStyle(element, attr) * 100;
				// 把目标透明度值也放大100倍
				var target = json[attr] * 100;
				// 定义一个速率的概念
				var speed = (target - current) / 10;
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
				// 当前值改变为目标值
				current += speed;
				element.style[attr] = current / 100;
			}
			// 判断这个元素属性是不是层级
			else if (attr === "zIndex") {
				// 如果是层级就直接改变这个值
				element.style[attr] = json[attr];
			}
			// 其他的情况(类似上面的透明度)
			else {
				// 因为获取到的含有单位所以进行只取数值的操作
				var current = parseInt(getStyle(element, attr));
				var target = json[attr];
				var speed = (target - current) / 10;
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
				current += speed;
				// 此处结尾应该加上px单位,应为getStyle获取到的是数值型
				element.style[attr] = current + "px";
			};
			// 判断所有属性值是否改变完成
			if(current != target) {
				// 若果有属性值没有完成改变,改变布尔值类型;再一次进行动画函数
				flag = false;
			};
		};
		// 判断是否有回调函数
		if(flag) {
			// 首先清理定时器,因为动画已经执行完毕,防止定时器的遗留
			clearInterval(element.timeId);
			// 函数执行的条件是传入了这个函数并且所有动画执行完毕,这时调用这个回调函数执行
			if(fn) {
				fn();
			};
		};
	}, 20);
};



/**
 * window.event(IE8的事件参数对象)和事件参数对象e(谷歌火狐)的兼容
 */
const evt = {
	// 1.window.event和事件参数对象e的兼容
	getEvent: function (evt) {
		return window.event || evt;
	},
	// 2.可视区域横纵坐标获取
	getClientX: function (evt) {
		return this.getEvent(evt).clientX;
	},
	getClientY: function (evt) {
		return this.getEvent(evt).clientY;
	},
	// 3.向上向左卷曲值的获取
	getScrollTop: function () {
		return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
	},
	getScrollLeft: function () {
		return window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft || 0;
	},
	// 4.相对于页面的横纵坐标获取
	getPageX: function () {
		return this.getEvent(evt).pageX ? this.getEvent(evt).pageX : this.getClientX(evt) + this.getScrollLeft();
	},
	getPageY: function () {
		return this.getEvent(evt).pageY ? this.getEvent(evt).pageY : this.getClientY(evt) + this.getScrollTop();
	},
};