const Polynomial = require('./Polynomial');

class polyMath {
    constructor() {

    }

    newPolynomial(poly) {
        return new Polynomial(poly);
    }

    add(poly1, poly2) {
        let allMembers = poly1.members.concat(poly2.members); //соединить все члены в один массив
        let polyResult = new Polynomial(allMembers);
        let members = polyResult.members;
        for(let i = 1; i < members.length; i++) {
            if(members[i - 1].power == members[i].power) {
                members[i].koef += members[i - 1].koef;//сложить коэффициенты с одинаковыми степенями
                // if(members[i].koef == 0) {//если член стал с нулевым koef
                //     delete members[i];
                // }
                delete members[i - 1];//удалить лишний элемент
            }
        }
        polyResult.members = members.filter(member => member != null);//исключить пустые элементы
        return polyResult;
    }

    sub(poly1, poly2) {
        let members = [];
        for(let i = 0; i < poly2.length; i++) {//изменить знаки при koef у poly2
            members.push({ koef: -(poly2.members[i].koef), power: poly2.members[i].power });
        }
        let poly = new Polynomial(members);//poly2 с противоположными знаками
        return this.add(poly1, poly);
    }

    mult(poly1, poly2) {
        let members = [];
        //перемножить все koef и сложить все power между собой
        for(let i = 0; i < poly1.length; i++) {
            for(let j = 0; j < poly2.length; j++) {
                members.push({
                    koef: poly1.members[i].koef * poly2.members[j].koef,
                    power: poly1.members[i].power + poly2.members[j].power,
                });
            }
        }
        let polyResult = new Polynomial(members);
        return this.add(polyResult, new Polynomial());//привести полученный многочлен
    }
}

module.exports = polyMath;