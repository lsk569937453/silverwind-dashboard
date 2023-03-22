export default class CommonUtils {
    /**
     * 判断字符串是否为空
     * @param str
     * @returns {boolean}
     */
    static isNull(str) {
        return str == null || str.length === 0 || str === '';
    }
    static guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
 
    /**
     *
     * @desc  判断是否为身份证号
     * @param  {String|Number} str
     * @return {Boolean}
     */
    static isIdCard(str) {
        return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str)
    }
    static checkIsIPV4(entry) {
        var blocks = entry.split(".");
        if(blocks.length === 4) {
          return blocks.every(function(block) {
            return parseInt(block,10) >=0 && parseInt(block,10) <= 255;
          });
        }
        return false;
      }
    /**
     *
     * @desc   判断是否为手机号
     * @param  {String|Number} str
     * @return {Boolean}
     */
    static isPhoneNum(str) {
        return /^(0|86|17951)?(1[3-9][0-9])[0-9]{8}$/.test(str)
    }
}
