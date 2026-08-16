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
    <view class="content">
      <swiper class="banner-swiper" indicator-dots autoplay circular indicator-color="rgba(255,255,255,0.3)"
        indicator-active-color="#fff">
        <swiper-item v-for="item in bannerList" :key="item.title">
          <view class="banner-item-content">
            <image :src="item.url" mode="aspectFill"></image>
          </view>
        </swiper-item>
      </swiper>
      <view class="part">
        <up-scroll-list indicatorColor="rgba(255,255,255,0.3)" indicatorActiveColor="#ffce2c">
          <view class="scroll-item" v-for="item in partList" :key="item.title">
            <image class="scroll-image" :src="item.url" mode="aspectFill"></image>
            <text class="item-title">{{ item.title }}</text>
          </view>
        </up-scroll-list>
      </view>
      <view class="part">
        <view class="p-4 bg-white">
          <up-box height="350rpx" gap="12px">
            <template #left>
              <image class="box-image" src="/src/static/modules/home/pic1.png" mode="aspectFill" />
            </template>
            <template #rightTop>
              <image class="box-image" src="/src/static/modules/home/pic2.png" mode="aspectFill" />
            </template>
            <template #rightBottom>
              <image class="box-image" src="/src/static/modules/home/pic3.png" mode="aspectFill" />
            </template>
          </up-box>
        </view>
      </view>
      <view class="exchange-section">
        <view class="section-title-area">
          <text class="section-title">省钱速报</text>
          <text class="section-subtitle">折扣促销每日更新</text>
          <view class="go-btn">GO</view>
        </view>
        <view class="promo-cards">
          <view class="promo-card">
            <image class="image-placeholder" src="/src/static/modules/home/pic4.jpg" mode="aspectFill" />
            <text class="promo-title">到店服务</text>
            <text class="promo-desc">限时降价</text>
            <view class="small-go">GO</view>
          </view>
          <view class="promo-card">
            <image class="image-placeholder" src="/src/static/modules/home/pic5.jpg" mode="aspectFill" />
            <text class="promo-title">领券中心</text>
            <text class="promo-desc">618立减</text>
            <view class="small-go">GO</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { onLoad } from '@dcloudio/uni-app';
  import { ref, computed } from 'vue';
  import { reverseCode } from '../utils/geoCode';
  import { get } from '../utils/http';
  import { ImageItem } from './index.ts';
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

    // 获取banner轮播图
    getBannerList();

    // 获取分区列表
    getPartList();
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
      height: "60px"
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
      top: "5px",
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

  // banner获取  ------------------start----------------------
  const bannerList = ref<ImageItem[]>([])
  const getBannerList = async () => {
    try {
      const data = await get("/home/banner");
      bannerList.value = data.banner;
    } catch (error) {
      console.log(error);
    }
  }
  // banner获取  ------------------end----------------------------

  // 功能列表板块 ------------------start----------------------
  const partList = ref<ImageItem[]>([])
  const getPartList = async () => {
    try {
      const data = await get("/home/part");
      partList.value = data.part;
    } catch (error) {
      console.log(error);
    }
  }
  // 功能列表板块 ------------------end----------------------
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

    .content {
      padding: 10rpx 0;

      .banner-swiper {
        width: 100%;
        height: 350rpx;
        // margin-top: 4rpx;
        // border-radius: 16rpx;

        .banner-item-content {
          width: 100%;
          height: 100%;

          image {
            width: 100%;
            height: 100%;
            // border-radius: 16rpx;
          }
        }
      }

      .part {
        background-color: #fff;
        margin-top: 20rpx;
        margin-bottom: 24rpx;
        border-radius: 16rpx;
        padding: 30rpx;

        .scroll-item {
          text-align: center;

          .scroll-image {
            width: 90rpx;
            height: 90rpx;
            box-sizing: border-box;
            margin: 0 20rpx;
          }

          .scroll-text {
            font-size: 24rpx;
            color: $uni-text-color;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .box-image {
          width: 100%;
          height: 100%;
          border-radius: 16rpx;
        }
      }

      .exchange-section {
        background-color: #fff;
        border-radius: 16rpx;
        padding: 30rpx;
        margin-bottom: 24rpx;

        .section-title-area {
          display: flex;
          align-items: center;
          margin-bottom: 24rpx;

          .section-title {
            font-size: 32rpx;
            font-weight: bolder;
            color: #000;
            margin-right: 16rpx;
          }

          .section-subtitle {
            font-size: 24rpx;
            color: $uni-text-color-grey;
            flex: 1;
          }

          .go-btn {
            background-color: #ff6b81;
            border-radius: 22rpx;
            font-size: 24rpx;
            color: #fff;
            padding: 4rpx 20rpx;
          }
        }

        .promo-cards {
          display: flex;
          justify-content: space-between;

          .promo-card {
            width: 50%;
            background-color: #f9f9f9;
            border-radius: 16rpx;
            padding: 20rpx;
            position: relative;

            .image-placeholder {
              width: 100%;
              height: 160rpx;
              border-radius: 8rpx;
              margin-bottom: 16rpx;
            }

            .promo-title {
              font-size: 28rpx;
              color: $uni-text-color;
              line-height: 40rpx;
              display: block;
            }

            .promo-desc {
              font-size: 24rpx;
              color: #999;
              line-height: 34rpx;
              display: block;
            }

            .small-go {
              position: absolute;
              right: 20rpx;
              bottom: 20rpx;
              background-color: #ff6b81;
              border-radius: 16rpx;
              font-size: 20rpx;
              color: #fff;
              padding: 2rpx 16rpx;
            }
          }
        }

      }
    }
  }
</style>
