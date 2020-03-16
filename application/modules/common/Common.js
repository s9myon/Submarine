class Common {

    getRoomId() {
        const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = "";
        for (let i = 0; i < 8; i++){
            let rnd = Math.floor(Math.random() * str.length);
            result += str.charAt(rnd);
        }
        return result;
    }
}

module.exports = Common;