class ORM {
    constructor(db) {
        this.db = db;
    }

    // взять ОДНУ запись
    // table - название таблицы. Строка
    // params - параметры выбора данных из таблицы. Объект
    // detail - поля, которые необходимо взять. Строкой через запятую
    // operand - оператор между параметрами (AND или OR). Строка
    detail(table, params, detail, operand) {
        if (table && params) {
            let str = [];
            let arr = [];
            if (params instanceof Object) {
                const keys = Object.keys(params);
                str = keys.map(key => key + '=?');
                arr = keys.map(key => params[key]);
            } else { // выбор по id
                str.push('id=?');
                arr.push(params);
            }
            const query = `SELECT ${detail ? detail : '*'} FROM ${table} WHERE ${str.join(operand ? ' ' + operand + ' ' : ' AND ')}`;
            return this.db.get(query, arr);
        }
        return null;
    }

    // взять МАССИВ записей
    list(table, params, detail, operand) {
        if (table && params instanceof Object) {
            const keys = Object.keys(params);
            const str = keys.map(key => key + '=?');
            const arr = keys.map(key => params[key]);
            const query = `SELECT ${detail ? detail : '*'} 
                           FROM ${table} 
                           ${str.length ? `WHERE ${str.join(operand ? ' ' + operand + ' ' : ' AND ')}` : '' }`;
            return this.db.all(query, arr);
        }
        return null;
    }

    // добавить запись
    // table - название таблицы. Строка
    // fields - список добавляемых полей. Строка
    // values - массив значений. Массив
    add(table, fields, values) {
        if (table && fields && values instanceof Array) {
            const str = [];
            let arr = [];
            if (values[0] instanceof Array) { // создаем более чем одну запись
                for (let i = 0; i < values.length; i++) {
                    const part = [];
                    for (let j = 0; j < values[i].length; j++) {
                        arr.push(values[i][j]);
                        part.push('?');
                    }
                    str.push(`(${part.join(',')})`);
                }
            } else {
                arr = values;
                const part = values.map(elem => '?');
                str.push(`(${part.join(',')})`);
            }
            const query = `INSERT INTO ${table} (${fields}) VALUES ${str.join(',')}`;
            return this.db.run(query, arr);
        }
        return null;
    }

    // удалить запись
    // table - название таблицы
    // params - параметры выбора данных из таблицы. Объект
    // operand - оператор между параметрами (AND или OR)
    delete(table, params, operand) {
        if (table && params) {
            let str = [];
            let arr = [];
            if (params instanceof Object) {
                const keys = Object.keys(params);
                str = keys.map(key => key + '=?');
                arr = keys.map(key => params[key]);
            } else { // выбор по id
                str.push('id=?');
                arr.push(params);
            }
            const query = `DELETE FROM ${table} WHERE ${str.join(operand ? ' ' + operand + ' ' : ' AND ')}`;
            return this.db.run(query, arr);
        }
        return null;
    }

    // изменить запись
    // table - название таблицы
    // values - значения, которые записываем. Объект
    // params - параметры выбора строк для изменения. Объект
    // operand - оператор между параметрами (AND или OR)
    update(table, values, params, operand) {
        if (table && values) {
            const strSet = [];
            const strWhere = [];
            const arr = [];
            for (let key in values) {
                strSet.push(key + '=?');
                arr.push(values[key]);
            }
            if (params instanceof Object) {
                for (let key in params) {
                    strWhere.push(key + '=?');
                    arr.push(params[key]);
                }
            }
            const query = `UPDATE ${table} SET ${strSet.join(',')} WHERE ${strWhere.join(operand ? ' ' + operand + ' ' : ' AND ')}`;
            return this.db.run(query, arr);
        }
        return null;
    }
}

module.exports = ORM;