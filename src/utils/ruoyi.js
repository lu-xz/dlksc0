/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */
const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

// 表单重置
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}

// 添加日期范围
export function addDateRange(params, dateRange) {
	var search = params;
	search.beginTime = "";
	search.endTime = "";
	if (null != dateRange && '' != dateRange) {
		search.beginTime = this.dateRange[0];
		search.endTime = this.dateRange[1];
	}
	return search;
}

// 通用下载方法
export function download(fileName,isDelete = true) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + isDelete;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = [];
	Object.keys(datas).some((key) => {
		if (datas[key].dictValue == ('' + value)) {
			actions.push(datas[key].dictLabel);
			return true;
		}
	})
	return actions.join('');
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
	var actions = [];
	var currentSeparator = undefined === separator ? "," : separator;
	var temp = value.split(currentSeparator);
	Object.keys(value.split(currentSeparator)).some((val) => {
		Object.keys(datas).some((key) => {
			if (datas[key].dictValue == ('' + temp[val])) {
				actions.push(datas[key].dictLabel + currentSeparator);
			}
		})
	})
	return actions.join('').substring(0, actions.join('').length - 1);
}

// 字符串格式化(%s )
export function sprintf(str) {
	var args = arguments, flag = true, i = 1;
	str = str.replace(/%s/g, function () {
		var arg = args[i++];
		if (typeof arg === 'undefined') {
			flag = false;
			return '';
		}
		return arg;
	});
	return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
	if (!str || str == "undefined" || str == "null") {
		return "";
	}
	return str;
}

// 数据合并
export function mergeRecursive(source, target) {
	for (var p in target) {
		try {
			if (target[p].constructor == Object) {
				source[p] = mergeRecursive(source[p], target[p]);
			} else {
				source[p] = target[p];
			}
		} catch (e) {
			source[p] = target[p];
		}
	}
	return source;
};

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
	let config = {
		id: id || 'id',
		parentId: parentId || 'parentId',
		childrenList: children || 'children'
	};

	var childrenListMap = {};
	var nodeIds = {};
	var tree = [];

	for (let d of data) {
		let parentId = d[config.parentId];
		if (childrenListMap[parentId] == null) {
			childrenListMap[parentId] = [];
		}
		nodeIds[d[config.id]] = d;
		childrenListMap[parentId].push(d);
	}

	for (let d of data) {
		let parentId = d[config.parentId];
		if (nodeIds[parentId] == null) {
			tree.push(d);
		}
	}

	for (let t of tree) {
		adaptToChildrenList(t);
	}

	function adaptToChildrenList(o) {
		if (childrenListMap[o[config.id]] !== null) {
			o[config.childrenList] = childrenListMap[o[config.id]];
		}
		if (o[config.childrenList]) {
			for (let c of o[config.childrenList]) {
				adaptToChildrenList(c);
			}
		}
	}
	return tree;
}

export const cutMoneyFiter = (amount) => {
	if (!amount) {
		return "-"
	}
	//强制保留两位小数
	let f = parseFloat(amount);
	if (isNaN(f)) return false;
	let s = f.toString();
	//每三位用一个逗号隔开
	let array = s.split(".");
	let leftNum = array[0];
	let rightNum = array.length > 1 ? "." + array[1] : '';
	let result;
	//定义数组记录截取后的价格
	let resultArray = new Array();
	if (leftNum.length > 3) {
		let i = true;
		while (i) {
			resultArray.push(leftNum.slice(-3));
			leftNum = leftNum.slice(0, leftNum.length - 3);
			if (leftNum.length < 4) {
				i = false;
			}
		}
		//由于从后向前截取，所以从最后一个开始遍历并存到一个新的数组，顺序调换
		let sortArray = new Array();
		for (let i = resultArray.length - 1; i >= 0; i--) {
			sortArray.push(resultArray[i]);
		}
		result = leftNum + "," + sortArray.join(",") + rightNum;
	} else {
		result = s;
	}
	return result;
}

/**

* [groupingData 根据共同字段将数据分组]

* @param {[type]} arr [数据源]

* @param {[type]} field [字段名]

*/

export const groupingData = (data, filed) => {

	let map = {};

	let dest = [];

	data.forEach(item => {

		if (!map[item[filed]]) {

			dest.push({

				[filed]: item[filed],

				list: [item]

			});

			map[item[filed]] = item;

		} else {

			dest.forEach(dItem => {

				if (dItem[filed] == item[filed]) {

					dItem.list.push(item);

				}

			});

		}

	})

	return dest;

}

//绑定事件，可重复绑定('事件名称'必须加引号)
export function bind(obj, evname, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(evname, fn, false);
		if (evname == 'mousewheel') {
			obj.addEventListener('DOMMouseScroll', fn, false);
		}
	} else {
		obj.attachEvent('on' + evname, function () {
			fn.call(obj);
		});
	}
};

//取消绑定，可重复取消('事件名称'必须加引号)
export function unbind(obj, evname, fn) {
	if (obj.removeEventListener) {
		obj.removeEventListener(evname, fn, false);
		if (evname == 'mousewheel') {
			obj.removeEventListener('DOMMouseScroll', fn, false);
		}
	} else {
		obj.detachEvent('on' + evname, fn);
	}
};

// 拖拽

export function objDrag(id) {
	var _this = this;
	this.oDiv = document.getElementById(id);
	this.oDiv.onmousedown = function (event) {
		_this.fnDown(event);
		return false;
	}
	this.positionArray = []
	this.nX = null;
	this.nY = null;
	this.timer = null;
}

objDrag.prototype.fnDown = function (event) {
	var _this = this;
	var evt = event || window.event;
	this.nX = evt.clientX - this.oDiv.offsetLeft;
	this.nY = evt.clientY - this.oDiv.offsetTop;
	document.onmousemove = function (event) {
		_this.fnMove(event);
	}
	this.oDiv.onmouseup = function (event) {
		_this.fnUp(event)
	};
}

objDrag.prototype.fnMove = function (event) {
	var evt = event || window.event;
	var left = evt.clientX - this.nX;
	var top = evt.clientY - this.nY;
	this.oDiv.style.left = left + 'px';
	this.oDiv.style.top = top + 'px';
	this.positionArray.push({
		left: this.oDiv.offsetLeft,
		top: this.oDiv.offsetTop
	});
}

objDrag.prototype.returnWay = function () { // 拖拽轨迹原路返回
	console.log(this.positionArray.length);
	let positionArray = this.positionArray
	this.positionArray = []
	let _this = this
	console.log(positionArray, 'pos')
	var index = positionArray.length - 1;
	this.timer = setInterval(function () {
		if (index < 0) {
			clearInterval(this.timer);
			return;
		}
		if (positionArray.length) {
			console.log(_this.oDiv, '_this.oDiv')
			if (_this.oDiv.style) {
				_this.oDiv.style.left = positionArray[index--].left + "px";
				_this.oDiv.style.top = positionArray[index--].top + "px";
			}
		}
	}, 1);
}

objDrag.prototype.fnUp = function () {
	document.onmousemove = null;
}


