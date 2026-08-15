<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header" :style="headerStyle">
      <!-- 状态栏：电量位置 -->
      <view class="status-bar"></view>
      <!-- 导航栏主题 -->
      <view class="nav-content" :style="navStyle">
        <view class="location" @click="startLocation">
          <uni-icons type="location" color="#fff" size="28" />
          <text class="city">{{ cityName }}</text>
        </view>
        <view class="search-box">
          <uni-search-bar style="width:100%" radius="100" placeholder="搜索宠物服务" clear-button="none"
            cancelButton="none"></uni-search-bar>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { onLoad } from '@dcloudio/uni-app';
  import { ref, computed } from 'vue';
  import { reverseCode } from '../utils/geoCode';
  const menuButtonInfo = ref<any>(null);
  onLoad(() => {
    // 胶囊按钮数据获取
    // #ifdef MP-WEIXIN
    menuButtonInfo.value = uni.getMenuButtonBoundingClientRect();
    // #endif
    // #ifdef WEB || APP-PLUS
    menuButtonInfo.value = {
      top: "0",
      height: "44px",
    };
    // #endif

    // 获取用户地理位置
    startLocation();
  })

  // 导航栏胶囊按钮兼容 ----------------start----------------------
  // 动态配置header高度，让导航栏完全包含胶囊按钮
  const headerStyle = computed(() => {
    let style = {
      height: "200px"
    }
    // #ifdef MP-WEIXIN
    if (menuButtonInfo.value) {
      style = {
        height: `${menuButtonInfo.value.top + menuButtonInfo.value.height + 20}px`
      }
    }
    // #endif
    // #ifdef WEB || APP-PLUS
    style = {
      height: "90px"
    }
    // #endif
    return style;
  });
  // 动态配置导航栏位置和高度，让导航栏和胶囊按钮平齐
  const navStyle = computed(() => {
    let style = {
      top: "0",
      height: "44px"
    }
    // #ifdef MP-WEIXIN
    if (menuButtonInfo.value) {
      style = {
        top: `${menuButtonInfo.value.top}px`,
        height: `${menuButtonInfo.value.height}px`
      }
    }
    // #endif
    // #ifdef WEB || APP-PLUS
    style = {
      top: "20px",
      height: "50px"
    }
    // #endif
    return style;

  })
  // 导航栏胶囊按钮兼容 ----------------end----------------------

  // 地理信息定位 --------------------start----------------------
  const cityName = ref<string>('');
  const startLocation = () => {
    // 开始定位
    uni.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log("位置信息：经纬度", res.latitude, res.longitude);
        reverseCode(res.latitude, res.longitude).then((res) => {
          console.log("位置信息：城市名称", res);
          cityName.value = res;
        }).catch(() => {
          cityName.value = '无法定位';
        })
      },
      fail: (err) => {
        console.log("获取位置失败", err);
        cityName.value = '无法获取位置';
        uni.showModal({
          title: '提示',
          content: '需要获取您的用户信息，是否去设置开启定位权限',
          success: (res) => {
            if (res.confirm) {
              // #ifdef MP-WEIXIN
              uni.openSetting() // 用户点击确定，跳转到设置页面
              // #endif
              // #ifdef APP-PLUS
              uni.showModal({
                title: '提示',
                content: '请去系统设置中开启定位权限并重新定位',
                showCancel: false,
              })
              // #endif
              // #ifdef WEB
              setTimeout(() => { // 增加时间延迟，防止弹窗闪现闪离
                uni.showModal({
                  title: '提示',
                  content: '请去浏览器设置中开启定位权限并重新定位',
                  showCancel: false,
                })
              }, 300)
              // #endif
            }
          }
        })
      }
    })
  }

  // 地理信息定位 --------------------end----------------------
</script>
<style scoped lang="scss">
  .container {
    background-color: #f7f7f7;

    .header {
      background-color: $uni-color-primary;

      .status-bar {
        width: 100%;
        height: var(--status-bar-height)
      }

      .nav-content {
        display: flex;
        align-items: center;
        padding: 0 30rpx;
        position: fixed;
        left: 0;
        right: 0;

        .location {
          display: flex;
          align-items: center;
          margin-right: 10rpx;

          .city {
            color: #fff;
            font-size: 28rpx;
            width: 100rpx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .search-box {
          width: 340rpx;
        }
      }
    }
  }
</style>
