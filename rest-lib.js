let users = [];
let inc = 0;

function getUserIndex(id){
    return users.findIndex(user => user.id == id);
}

function create(name, score){
    let id = ++inc;
    users.push({
        "id": id,
        "name": name,
        "score": score
    });
    return users[users.length - 1];
}

function get(id, fields){
    let data = {};
    let index = getUserIndex(id);

    if (index < 0)
        return false;

    if (fields){
        let fields = fields.split(",");
        fields.forEach((field) => data[field] = users[index][field]);
    } else {
        data = users[index];
    }

    return data;
}

function update(id, info){
    let index = getUserIndex(id);

    if (index < 0)
        return false;

    if (info.name)
        users[index].name = info.name;
    if (info.score)
        users[index].score = info.score;

    return users[index];
}

function remove(id){
    let index = getUserIndex(id);

    if (index < 0)
        return false;

    users.splice(index, 1);
    return {"deleted": "ok"};
}

function removeAll(){
    users = [];
    return {"deleted": "ok"};
}

function getAll(limit, offset, fields){
    let arUser = users.slice();

    if (limit){
        limit = Number(limit);
        offset = Number(offset) || 0;
        arUser = users.slice(offset, offset + limit);
    }

    if (fields){
        fields = fields.split(",");
        let arResult = [];
        arUser.forEach((user, index) => {
            let userCopy = Object.assign({}, user);
            for (prop in userCopy){
                if (fields.indexOf(prop) == -1){
                    delete userCopy[prop];
                }
            }
            arResult.push(userCopy);
        });
        arUser = arResult;
    }
    return arUser;
}

module.exports = {
    create,
    get,
    update,
    remove,
    removeAll,
    getAll
};