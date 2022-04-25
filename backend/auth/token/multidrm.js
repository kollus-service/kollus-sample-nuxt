const crypto = require('crypto');
const moment = require('moment');
const authconfig = require('../config');
const uaparser = require('ua-parser-js');

let determineDrmType = (ua) => {
    let parser = uaparser(ua);
    let drmtype = '';
    if (parser.getDevice().vendor.toLowerCase().indexOf('apple') > -1){
        drmtype = 'FairPlay'
    }else {
        if(parser.getBrowser().name.toLowerCase().indexOf('ie') > -1 ||
            parser.getBrowser().name.toLowerCase().indexOf('edge') > -1){
            drmtype = 'PlayReady'
        }
        else {
            drmtype = 'Widevine';
        }
    }
    return drmtype;
}
let createPolicyToken = (policy) => {
    let str_policy = JSON.stringify(policy);
    let cipher = crypto.createCipheriv('aes-256-cbc', authconfig.multidrm.sitekey, authconfig.multidrm.iv);
    let token = cipher.update(str_policy, 'utf8', 'base64');
    token += cipher.final('base64');
    return token;
}
let createMultiDrmToken = (drm_type, policyToken, user_id, cid) => {
    let now = new Date();
    let timestamp = `${moment(now).format('yyyy-MM-DD')}T${moment(now).format('HH:mm:ss')}Z`;
    let str_hash = `${authconfig.multidrm.accesskey}${drm_type}${authconfig.multidrm.siteid}${user_id}${cid}${policyToken}${timestamp}`;
    let hash = crypto.createHash('sha256').update(str_hash).digest('base64');
    let payload = {
        drm_type: drm_type,
        site_id: authconfig.multidrm.siteid,
        user_id: user_id,
        cid: cid,
        policy: policyToken,
        timestamp: timestamp,
        hash: hash,
        response_format: 'original',
        key_rotation: false
    }
    let str_payload = JSON.stringify(payload);
    let token = Buffer.from(str_payload).toString('base64');
    return token;
}
// https://pallycon.com/docs/ko/multidrm/license/license-token/
/***
 *
 * @param hdcp_level HDMI를 이용한 외부 출력 여부 설정 -1: 기본값 0: HDMI_1.0  1: HDMI_2.0  2: HDMI_2.2 3: 허용 안함
 * @param license_duration 라이센스 유효 기간 (초) -1 : expire_date 사용, 0: 무제한
 * @param expire_date 라이센스 유효 기간 (일자) UnixTimestamp license_duration 이 -1 이 아니면 무시
 * @returns {{}}
 */
let createPolicy = (hdcp_level = -1, license_duration = -1, expire_date = -1) => {

    let policy = {};
    policy['policy_version'] = 2;
    let playback_policy = {};
    playback_policy['persistent'] = false;
    if (license_duration > -1) {
        playback_policy['licensse_duration'] = license_duration;
    } else {
        if (expire_date !== -1) {
            let date_expire_date = new Date(expire_date);
            let timestamp = `${moment(date_expire_date).format('yyyy-MM-DD')}T${moment(date_expire_date).format('HH:mm:ss')}Z`;
            playback_policy['expire_date'] = timestamp;
        }
    }
    playback_policy['allowed_track_types'] = 'ALL';
    policy['playback_policy'] = playback_policy;
    if (hdcp_level > -1) {
        let security_policy = [];
        let security_policy_item = {};
        security_policy_item['track_type'] = 'ALL';
        let widevine = {};
        widevine['security_level'] = 1;
        widevine['required_hdcp_version'] = hdcp_level === 0 ? 'HDCP_V1' :
            hdcp_level === 1 ? 'HDCP_V2' : hdcp_level === 2 ? 'HDCP_V2_2' : 'HDCP_NO_DIGITAL_OUTPUT';
        widevine['required_cgms_flags'] = 'COPY_NONE';
        widevine['disable_analog_output'] = true;
        widevine['hdcp_srm_rule'] = 'HDCP_SRM_RULE_NONE';
        widevine['override_device_revocationn'] = true;
        security_policy_item['widevine'] = widevine;
        let playready = {};
        playready['security_level'] = 150;
        playready['digital_video_protection_level'] = hdcp_level === 0 ? 100 : hdcp_level === 1 ? 270 : hdcp_level === 2 ? 300 : 301;
        playready['analog_video_protection_level'] = hdcp_level === 0 ? 100 : hdcp_level === 1 ? 150 : hdcp_level === 2 ? 200 : 201;
        playready['digital_audio_protection_level'] = hdcp_level === 0 ? 100 : hdcp_level === 1 ? 250 : hdcp_level === 2 ? 300 : 301;
        playready['require_hdcp_type_1'] = hdcp_level >= 2;
        security_policy_item['playready'] = playready;
        let fairplay = {}
        fairplay['hdcp_enforcement'] = hdcp_level <= 1 ? 0 : 1
        fairplay['allow_airplay'] = false;
        fairplay['allow_av_adapter'] = fsle;
        security_policy_item['fairplay'] = fairplay;
        security_policy.push(security_policy_item);
        policy['security_policy'] = security_policy;
    }
    return policy
}
module.exports = {
    determineDrmType : determineDrmType,
    createPolicy: createPolicy,
    createPolicyToken: createPolicyToken,
    createMultiDrmToken: createMultiDrmToken
}
