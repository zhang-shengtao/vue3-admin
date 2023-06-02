import request from "@/utils/request";

// 路由
export function addMenu(data) {
  return request({
    url: "/menu",
    method: "post",
    data,
  });
}
export function menulist() {
  return request({
    url: "/menu",
  });
}
export function putmenulist(data) {
  return request({
    url: "/menu",
    data,
    method: "put",
  });
}
export function delmenulist(data) {
  return request({
    url: "/menu",
    data,
    method: "delete",
  });
}

// 角色
export function postRole(data) {
  return request({
    url: "/role",
    data,
    method: "post",
  });
}
export function getRole() {
  return request({
    url: "/role",
  });
}
export function getRoleList() {
  return request({
    url: "/role/list",
  });
}
export function delRole(data) {
  return request({
    url: "/role",
    method: "delete",
    data,
  });
}
export function putRole(data) {
  return request({
    url: "/role",
    method: "put",
    data,
  });
}
export function putRoleBtn(data) {
  return request({
    url: "/role/put",
    method: "put",
    data,
  });
}

// 用户
