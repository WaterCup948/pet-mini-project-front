// 逆地理信息编码
interface AMapResponse {
  status: string;
  info: string;
  regeocode: {
    formatted_address: string;
    addressComponent: {
      province: string;
      city: string;
      district: string;
      township: string;
    };
  };
}
/**
 * 逆地理信息编码
 * @param latitude 纬度
 * @param longitude 经度
 * @returns
 */
export const reverseCode = (
  latitude: number,
  longitude: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return reject(new Error("latitude and longitude must be numbers"));
    }

    uni.request({
      url: "https://restapi.amap.com/v3/geocode/regeo",
      data: {
        key: "cd5e5ee22bbe62f64a9fc27ee6100517",
        location: `${longitude},${latitude}`,
      },
      success(res) {
        const data: AMapResponse = res.data as AMapResponse; // 类型断言
        if (data.status !== "1") {
          return reject("定位失败");
        } else {
          const city = data.regeocode.addressComponent.city;
          const province = data.regeocode.addressComponent.province;
          const address: string = city.length ? city : province;
          return resolve(address);
        }
      },
      fail(err) {
        return reject(err);
      },
    });
  });
};
