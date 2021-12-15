const authconfig = require('../auth/config');
const jwt = require('../auth/token/jwt');
const multidrm = require('../auth/token/multidrm');
/***
 *
 * @param option
 * {
 *     cuid : 시청자 아이디
 *     expt : token 유효시간 초단위 최소 1분이상
 *     mck : 미디어 컨텐츠키
 *     multidrm : {
 *         hdcp_level:
 *         license_duration:
 *         expire_date:
 *         cid : 컨텐츠 업로드 파일키
 *         ua: user-agent
 *     }
 * }
 */
let createPlayerUrl = (option) => {
    let payload = {};
    payload.expt = parseInt(new Date().getTime() / 1000) + option.expt;
    payload.cuid = option.cuid;
    let mc = [];
    let mc_item = {};
    mc_item.mckey = option.mck;
    if (option.hasOwnProperty('multidrm')) {
        let drm_policy = {};
        drm_policy.kind = 'inka';
        let drm_type = multidrm.determineDrmType(option.multidrm.ua);
        drm_policy['streaming_type'] = drm_type === 'FairPlay' ? 'hls' : 'dash';
        let policy = multidrm.createPolicy(option.multidrm['hdcp_level'],
            option.multidrm['license_duration'],
            option.multidrm['expire_date']);
        let policyToken = multidrm.createPolicyToken(policy);
        let multidrmToken = multidrm.createMultiDrmToken(drm_type, policyToken, option.cuid, option.multidrm.cid);
        drm_policy.data = {
            license_url: 'https://license.pallycon.com/ri/lisenseManage.do',
            certificate_url: `https://license.pallycon.com/ri/fpsKeyManager.do?ssiteId=${authconfig.multidrm.siteid}`,
            custom_header: {
                key: 'pallycon-customdata-v2',
                value: multidrmToken
            }
        }
        mc_item['drm_policy'] = drm_policy;
    }
    mc.push(mc_item);
    payload.mc = mc;
    let token = jwt.create(payload, authconfig.secretkey)
    console.log(token);
    return `https://v.kr.kollus.com/s?jwt=${token}&custom_key=${authconfig.kollus.customkey}`;
}

module.exports = {
    createPlayerUrl : createPlayerUrl
}