let baseUrl;
console.log(location, "location.hostname")
if (location.hostname == 'wisecampus-fat.yoowang.com') { //测试环境
    baseUrl = 'https://api-fat.yoowang.com';
} else if (location.hostname == 'wisecampus.yoowang.com') { //正式环境
    baseUrl = 'https://api.yoowang.com';
} else { //开发环境
    baseUrl = '/api'
}

export {
    baseUrl
}