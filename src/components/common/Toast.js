var Toast = {};
Toast.install = function(Vue, options) {
  Vue.prototype.$toast = options => {
    let icon = options.icon == 'success' ? 'icon-chenggong' : 'icon-shibai';

    if (document.getElementsByClassName('dialog').length) return;
//Vue.extend():Create a “subclass” of the base Vue constructor. The argument 
//should be an object containing component options.
// mixin是对Vue类的options进行混入。所有Vue的实例对象都会具备混入进来的配置行为。
// extend是产生一个继承自Vue类的子类，只会影响这个子类的实例对象，不会对Vue类本身以及Vue类的实例对象产生影响。
///src/style/reset.scss样式来自于这里
    let toastCpl = Vue.extend({
      template: `<section class="dialog">
                    <div class="dialog_wrap aniDialog">
                        <i class="iconfont ${icon}"></i>
                        <p>${options.message}</p>
                    </div>
                </section>`,
    });
    //查看vm.$mount 渲染在文档之外，并未挂载，之后使用appendChild方法挂载
    //https://vuejs.org/v2/api/#vm-mount
    let tpl = new toastCpl().$mount().$el;
    document.body.appendChild(tpl);
    setTimeout(function() {
      document.body.removeChild(tpl);
      //执行成功后的回调函数
      options.success && options.success();
    }, 1500);
  };
};
module.exports = Toast;
