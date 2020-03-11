const Member = require('./Member');

class Polynomial {
    constructor(data) {
        this.members = [];
        if(data && data.length) {
            data.forEach(elem => {
                this.members.push(new Member(elem.koef, elem.power));
            });
            this.members.sort((a, b) => b.power - a.power);
        } else {
            this.members.push(new Member());
        }
        this.length = this.members.length;
    }
    
    //sum members of polynomial
    getValue(x) {
        // let sum = 0;
        // this.members.forEach(elem => {
        //     sum += elem.getValue(x);
        // })
        // return sum;        
        return this.members.reduce((s, elem) => s + elem.getValue(x), 0);
    }
    
    getMemberByPower(power) {
        for(let i = 0; i < this.members.length; i++) {
            if(this.members[i].power == power) return this.members[i];
        }
        return false;
    }
}
module.exports = Polynomial;