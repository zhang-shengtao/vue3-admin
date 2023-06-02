import request from "@/utils/request";

export function captcha() {
  return request({
    url: "/captcha",
  });
}
// 用户
export function login(data) {
  return request({
    url: "/user/login",
    data,
    method: "post",
  });
}
export function logout() {
  return request({
    url: "/user/logout",
  });
}
export function info() {
  return request({
    url: "/user/info",
  });
}
export function addUser(data) {
  return request({
    url: "/user",
    method: "post",
    data,
  });
}
export function getUserList(params = {}) {
  return request({
    url: "/user/list",
  });
}
export function putUser(data) {
  return request({
    url: "/user",
    method: "put",
    data,
  });
}
export function delUser(data) {
  return request({
    url: "/user",
    method: "delete",
    data,
  });
}
