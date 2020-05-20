import axios from 'axios';
export const url = 'http://vue.wclimb.site';
// export const url = 'http://localhost:3000';
let $axios = axios.create({
  baseURL: url + '/vi/',
});
function getCookie(name) {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    //第一个捕获组代表匹配一个开始占位符或者(不清楚啥意思)，链接一个name变量，第二个捕获组
    //匹配除了分号外的所有字符串，第三个捕获组匹配一个分号或者结束占位符
    // "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImxsbCIsImlhdCI6MTU4ODk0OTc3MiwiZXhwIjoxNTkxNTQxNzcyfQ.EZ5y9anhwqwT7yvEz2pS8U9HI-Ba6un37toqbgLR42k"
    // 已废弃,unescape() 方法计算生成一个新的字符串，其中的十六进制转义序列将被其表示的字符替换。
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}

function $fetch(method, url, data) {
  return new Promise((reslove, reject) => {
    $axios({
      method,
      url,
      data: data,
      // axios 中 `headers` 是即将被发送的自定义请求头
      //Access-Control-Allow-Headers 服务端需要配置这个？？(自定义请求头)
      //每次发送ajax请求的时候都会带上自定义请求头 token 
      headers: {
        token: getCookie('token'),
      },
    })
      .then(res => {
        let body = res.data;
        if (body.code == 200 || body.code == 201) {
          reslove(body);
        } else {
          reject(body);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

// 首页初始化数据
export const initHome = () => $fetch('get', 'list');

// 验证码
export const yzmChange = () => $fetch('get', 'getYzm');

// 注册登录
export const signin = (userName, password) =>
  $fetch('post', 'signin', { userName, password });

// 个人评论
export const meComment = userName =>
  $fetch('post', 'getUserComment', { userName });

// 获取用户喜欢不喜欢数据
export const meLike = userName =>
  $fetch('post', 'getUserLikeData', { userName });

// 删除评论---
export const meDelete = (commentId, userName) =>
  $fetch('post', 'deleteComment', { userName, commentId });

// 上传头像----
export const uploadAvator = (userName, avator) =>
  $fetch('post', 'uploadAvator', { avator, userName });

// 获取头像
export const getAvator = userName =>
  $fetch('post', 'getUserAvator', { userName });

// 编辑用户名
export const editNameData = (oldName, newName) =>
  $fetch('post', 'editUserName', { newName, userName: oldName });

// 搜索
export const search = val => $fetch('post', 'search', { val });

// 获取单个video数据
export const singleVideoData = videoId =>
  $fetch('post', 'getVideoById', { videoId });

// 获取评论
export const getVideoComment = videoId =>
  $fetch('post', 'getVideoComment', { videoId });

// 初始化单个video的like信息（判断用户当前的选项）
export const getInitVideoLikeData = (videoId, userName) =>
  $fetch('post', 'getUserSingleLike', { userName, videoId });

// 提交用户选择like数据
export const postVideoLikeData = (
  videoId,
  like,
  userName,
  videoName,
  videoImg,
  star,
) =>
  $fetch('post', 'postUserLike', {
    like,
    userName,
    videoName,
    videoImg,
    star,
    videoId,
  });

// 发表评论
export const reportComment = (videoId, userName, content, videoName, avator) =>
  $fetch('post', 'postComment', {
    videoId,
    userName,
    content,
    videoName,
    avator,
  });
