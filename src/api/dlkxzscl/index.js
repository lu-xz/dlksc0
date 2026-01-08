import request from '@/utils/request'
// 查询村污站点列表
export function map(query) {
    return request({
      url: '/dlkcw/index/map',
      headers: {
        isToken: false
      },
      method: 'get',
      params: query
    })
}

// 获取各镇村污站点数
export function getCwSiteCountByTown() {
    return request({
      url: '/dlkcw/index/getCwSiteCountByTown',
      headers: {
        isToken: false
      },
      method: 'get'
    })
}

// 获取村污站点详情
export function getCwSite(custNo) {
    return request({
      url: '/dlkcw/index/getCwSite/' + custNo,
      headers: {
        isToken: false
      },
      method: 'get'
    })
}

// 获取村污站点异常数据
export function getAbnormalList(query) {
    return request({
      url: '/dlkcw/index/getAbnormalList',
      headers: {
        isToken: false
      },
      method: 'get',
      params: query
    })
}

export function getAllAbnormalList(query) {
  return request({
    url: '/dlkcw/index/getAllAbnormalList',
    headers: {
      isToken: false
    },
    method: 'get',
    params: query
  })
}

export function getAllDealPowerList(){
  return request({
    url: '/dlkcw/index/getAllDealPowerList',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

export function getDealPower(custNo) {
  return request({
    url: '/dlkcw/index/getDealPower/' + custNo,
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

export function getAllPowerList(){
  return request({
    url: '/dlkcw/index/getAllPowerList',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

export function getPower(custNo) {
  return request({
    url: '/dlkcw/index/getPower/' + custNo,
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

export function getTownList(){
  return request({
    url: '/dlkcw/index/getTownList',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

export function getCwSiteList(){
  return request({
    url: '/dlkcw/index/getCwSiteList',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}